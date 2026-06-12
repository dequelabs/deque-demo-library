#!/usr/bin/env bash
#
# deploy-cfn.sh — apply the Deque Demo Library CloudFormation stack and
# sync the latest build to S3 + invalidate CloudFront.
#
# Mirrors the deploy pattern in dequelabs/infrastructure/cloudformation/README.md:
#   AWS_PROFILE=dequedev aws cloudformation deploy \
#     --template-file <template>.yaml \
#     --stack-name <stack> \
#     --region us-east-1 \
#     --capabilities CAPABILITY_NAMED_IAM
#
# Usage:
#   ./scripts/deploy-cfn.sh dev    # deploy dev stack
#   ./scripts/deploy-cfn.sh qa     # deploy qa stack
#   ./scripts/deploy-cfn.sh prod   # deploy prod stack
#
# Environment variables (override defaults inline or export):
#   AWS_PROFILE                 default: dequedev for dev/qa, dequeprod for prod
#   DEMO_LIBRARY_DOMAIN         default: demo-library.dequelabs.com
#   DEMO_LIBRARY_HOSTED_ZONE_ID required (no default — must be supplied)
#   DEMO_LIBRARY_ACM_CERT_ARN   required (must be a us-east-1 ACM cert)
#   DEMO_LIBRARY_CIRCLECI_OIDC  optional CircleCI OIDC provider ARN
#   DEMO_LIBRARY_CIRCLECI_PROJ  optional CircleCI project UUID
#   SKIP_SYNC=1                 deploy only the stack, don't push the bundle
#   SKIP_BUILD=1                use whatever's already in dist/

set -euo pipefail

ENV="${1:-}"
if [[ "$ENV" != "dev" && "$ENV" != "qa" && "$ENV" != "prod" ]]; then
  echo "usage: $0 <dev|qa|prod>" >&2
  exit 1
fi

# Per-env stack naming follows the Deque convention from
# dequelabs/infrastructure/cloudformation/README.md ("default" / "default-qa").
STACK_NAME="deque-demo-library"
[[ "$ENV" != "dev" ]] && STACK_NAME="${STACK_NAME}-${ENV}"

# AWS profile follows the same convention: dequedev for dev/qa accounts,
# dequeprod for production. Override with AWS_PROFILE before calling.
if [[ -z "${AWS_PROFILE:-}" ]]; then
  if [[ "$ENV" == "prod" ]]; then
    export AWS_PROFILE=dequeprod
  else
    export AWS_PROFILE=dequedev
  fi
fi

REGION="us-east-1"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATE="${REPO_ROOT}/cloudformation/deque-demo-library.yaml"

# ----- required parameters -----
: "${DEMO_LIBRARY_DOMAIN:=demo-library.dequelabs.com}"
: "${DEMO_LIBRARY_HOSTED_ZONE_ID:?DEMO_LIBRARY_HOSTED_ZONE_ID must be set (the Route53 hosted zone ID for the parent domain)}"
: "${DEMO_LIBRARY_ACM_CERT_ARN:?DEMO_LIBRARY_ACM_CERT_ARN must be set (must be us-east-1)}"

# ----- validate -----
echo "==> Validating template…"
aws cloudformation validate-template \
  --region "$REGION" \
  --template-body "file://$TEMPLATE" >/dev/null

# ----- deploy stack -----
PARAM_OVERRIDES=(
  "Env=$ENV"
  "DomainName=$DEMO_LIBRARY_DOMAIN"
  "HostedZoneId=$DEMO_LIBRARY_HOSTED_ZONE_ID"
  "AcmCertificateArn=$DEMO_LIBRARY_ACM_CERT_ARN"
)
if [[ -n "${DEMO_LIBRARY_CIRCLECI_OIDC:-}" ]]; then
  PARAM_OVERRIDES+=("CircleCIOidcProviderArn=$DEMO_LIBRARY_CIRCLECI_OIDC")
fi
if [[ -n "${DEMO_LIBRARY_CIRCLECI_PROJ:-}" ]]; then
  PARAM_OVERRIDES+=("CircleCIProjectId=$DEMO_LIBRARY_CIRCLECI_PROJ")
fi

echo "==> Deploying $STACK_NAME via $AWS_PROFILE to $REGION…"
aws cloudformation deploy \
  --template-file "$TEMPLATE" \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides "${PARAM_OVERRIDES[@]}" \
  --no-fail-on-empty-changeset

# ----- read outputs we need for the upload -----
echo "==> Reading stack outputs…"
BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)
DIST_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text)
SITE_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='SiteUrl'].OutputValue" --output text)

echo "    bucket:       $BUCKET"
echo "    distribution: $DIST_ID"
echo "    site URL:     $SITE_URL"

# ----- build + upload -----
if [[ "${SKIP_SYNC:-0}" == "1" ]]; then
  echo "==> SKIP_SYNC=1, leaving bundle alone."
  exit 0
fi

cd "$REPO_ROOT"
if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  echo "==> Building Vite bundle…"
  npm run build
fi

# 1) Upload everything except index.html with immutable far-future caching.
#    Vite fingerprints filenames under assets/, so they're safe to cache forever.
echo "==> Uploading fingerprinted assets (long-cache)…"
aws s3 sync "$REPO_ROOT/dist/" "s3://$BUCKET/" \
  --delete \
  --exclude index.html \
  --cache-control "public,max-age=31536000,immutable"

# 2) Upload index.html separately with no-store, so subsequent deploys
#    propagate immediately.
echo "==> Uploading index.html (no-store)…"
aws s3 cp "$REPO_ROOT/dist/index.html" "s3://$BUCKET/index.html" \
  --cache-control "no-store"

# 3) Invalidate the / and /index.html paths so CloudFront fetches fresh.
echo "==> Invalidating CloudFront…"
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/" "/index.html" >/dev/null

echo "==> Done. $SITE_URL"
