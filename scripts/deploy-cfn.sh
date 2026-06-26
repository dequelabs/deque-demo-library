#!/usr/bin/env bash
#
# deploy-cfn.sh — apply the Deque Asset Demo Library Amplify CloudFormation
# stack and (optionally) trigger the first build.
#
# Mirrors the deploy pattern in dequelabs/infrastructure/cloudformation/README.md:
#   AWS_PROFILE=dequedev aws cloudformation deploy \
#     --template-file <template>.yaml \
#     --stack-name <stack> \
#     --region us-east-1 \
#     --capabilities CAPABILITY_NAMED_IAM
#
# Amplify handles the actual build + hosting + SSL after the stack exists,
# so this script is dramatically simpler than the old S3 + CloudFront flow:
# no `npm run build`, no `aws s3 sync`, no CloudFront invalidation. Just
# create/update the stack and let Amplify do the rest from GitHub.
#
# Usage:
#   ./scripts/deploy-cfn.sh dev    # deploy dev stack
#   ./scripts/deploy-cfn.sh qa     # deploy qa stack
#   ./scripts/deploy-cfn.sh prod   # deploy prod stack
#
# Environment variables (override defaults inline or export):
#   AWS_PROFILE                 default: dequedev for dev/qa, dequeprod for prod
#   DEMO_LIBRARY_DOMAIN         default: dequelabs.com
#   DEMO_LIBRARY_SUBDOMAIN      default: demo-library
#   DEMO_LIBRARY_REPO           default: https://github.com/dequelabs/deque-demo-library
#   DEMO_LIBRARY_PROD_BRANCH    default: main
#   DEMO_LIBRARY_GITHUB_TOKEN   required (GitHub PAT with `repo` scope)
#   TRIGGER_BUILD=1             after deploy, kick off an Amplify build job

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
: "${DEMO_LIBRARY_DOMAIN:=dequelabs.com}"
: "${DEMO_LIBRARY_SUBDOMAIN:=demo-library}"
: "${DEMO_LIBRARY_REPO:=https://github.com/dequelabs/deque-demo-library}"
: "${DEMO_LIBRARY_PROD_BRANCH:=main}"
: "${DEMO_LIBRARY_GITHUB_TOKEN:?DEMO_LIBRARY_GITHUB_TOKEN must be set (GitHub PAT with repo scope)}"

# ----- validate -----
echo "==> Validating template…"
aws cloudformation validate-template \
  --region "$REGION" \
  --template-body "file://$TEMPLATE" >/dev/null

# ----- deploy stack -----
echo "==> Deploying $STACK_NAME via $AWS_PROFILE to $REGION…"
aws cloudformation deploy \
  --template-file "$TEMPLATE" \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    "Env=$ENV" \
    "DomainName=$DEMO_LIBRARY_DOMAIN" \
    "Subdomain=$DEMO_LIBRARY_SUBDOMAIN" \
    "Repository=$DEMO_LIBRARY_REPO" \
    "ProductionBranch=$DEMO_LIBRARY_PROD_BRANCH" \
    "GithubOAuthToken=$DEMO_LIBRARY_GITHUB_TOKEN" \
  --no-fail-on-empty-changeset

# ----- read outputs -----
echo "==> Reading stack outputs…"
APP_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='AppId'].OutputValue" --output text)
DEFAULT_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='DefaultDomain'].OutputValue" --output text)
SITE_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='SiteUrl'].OutputValue" --output text)
CONSOLE_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ConsoleUrl'].OutputValue" --output text)

echo
echo "    app id:        $APP_ID"
echo "    default URL:   https://${DEMO_LIBRARY_PROD_BRANCH}.${DEFAULT_DOMAIN}"
echo "    vanity URL:    $SITE_URL  (active after ACM + DNS propagate)"
echo "    console:       $CONSOLE_URL"

# ----- optionally trigger first build -----
# Amplify builds automatically on every push to the production branch once
# the webhook is registered. The very first deploy doesn't have a webhook
# event to react to yet, so we kick off a build by hand with start-job.
if [[ "${TRIGGER_BUILD:-0}" == "1" ]]; then
  echo "==> Triggering initial Amplify build of ${DEMO_LIBRARY_PROD_BRANCH}…"
  JOB_ID=$(aws amplify start-job \
    --region "$REGION" \
    --app-id "$APP_ID" \
    --branch-name "$DEMO_LIBRARY_PROD_BRANCH" \
    --job-type RELEASE \
    --query 'jobSummary.jobId' --output text)
  echo "    job id: $JOB_ID — watch progress at the console URL above"
fi

echo "==> Done."
