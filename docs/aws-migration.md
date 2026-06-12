# AWS migration runbook — Deque Demo Library

Move the multi-sector demo library off Vercel and into Deque's own AWS account, hosted via S3 + CloudFront, with infrastructure-as-code in CloudFormation following the patterns in [`dequelabs/infrastructure/cloudformation/`](https://github.com/dequelabs/infrastructure/blob/develop/cloudformation/README.md).

This doc is the runbook + architecture reference. The actual template lives at [`cloudformation/deque-demo-library.yaml`](../cloudformation/deque-demo-library.yaml); the one-shot deploy helper is [`scripts/deploy-cfn.sh`](../scripts/deploy-cfn.sh).

## Why move, why this pattern

We're currently on Vercel (see `vercel.json` + the deploy section in the root README). Two reasons to move:

1. **Tenancy / legal.** A customer-facing Deque demo site living in third-party Vercel tenancy raises eyebrows in security review. Hosting in Deque's AWS org sidesteps that conversation entirely.
2. **Consistency.** Every other Deque product (axe Linter, axe Reports, axe-net-web, etc.) deploys from `dequelabs/infrastructure/cloudformation/`. New infrastructure should match.

For a static Vite/React SPA the canonical AWS pattern is **S3 + CloudFront**. Our HashRouter setup (every route is `/#/...`) is actually the easy mode here — the server only ever serves `index.html`, so there's no SPA-on-S3 routing pain (no 404-rewrite, no CloudFront Function, no Lambda@Edge).

Alternative considered: **AWS Amplify Hosting**, which `dequelabs/infrastructure/cloudformation/axe-reports-amplify.yaml` already uses for at least one Deque product. Amplify gives push-to-deploy previews-per-branch like Vercel, but at the cost of being more opaque, more expensive at scale, and harder to reason about under IAM. We're picking the S3 + CloudFront primitives instead.

## Architecture

```
GitHub push
    │
    ▼
CircleCI pipeline (deploy-cfn.sh)
    │
    ├── aws cloudformation deploy   ─►  ensures stack is up-to-date
    ├── npm run build               ─►  Vite outputs dist/
    ├── aws s3 sync dist/   ─►  S3 bucket (private)
    │                                   ├── index.html       (cache-control: no-store)
    │                                   └── assets/* (immutable, 1 year)
    └── aws cloudfront create-invalidation   ─►  / and /index.html
                                                       │
                            ┌──────────────────────────┘
                            ▼
                CloudFront distribution (edge cache, HTTPS, gzip/brotli)
                            │
                            ├── ACM cert (us-east-1)         ─► HTTPS
                            ├── OAC (sigv4 to S3)            ─► private origin
                            ├── ResponseHeaders policy       ─► HSTS, X-Frame-Options, etc.
                            └── CustomErrorResponse 403/404  ─► /index.html (defensive)
                            │
                            ▼
                    Route53 alias record
                    ▲
            demo-library[-dev|-qa].dequelabs.com
```

### Resources the stack creates

| Resource | Purpose |
| --- | --- |
| `AWS::S3::Bucket` | Private origin for the `dist/` output. Versioned, with 30-day non-current-version expiry. |
| `AWS::S3::BucketPolicy` | Allow-only-this-CloudFront-distribution. Bucket stays fully private. |
| `AWS::CloudFront::OriginAccessControl` | Modern SigV4-based S3 lockdown (replaces legacy OAI). |
| `AWS::CloudFront::Distribution` | The CDN. HTTP/2 + HTTP/3, gzip + brotli, HTTPS-only, PriceClass_100 (NA + EU). |
| `AWS::CloudFront::CachePolicy` × 2 | One immutable-long-cache policy for fingerprinted `assets/*`, one no-store policy for `index.html` + `/`. |
| `AWS::CloudFront::ResponseHeadersPolicy` | HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, basic XSS protection. |
| `AWS::Route53::RecordSet` | Alias A record pointing at the CloudFront distribution. |
| `AWS::IAM::Role` | Optional. CircleCI OIDC deploy role, scoped to the bucket + distribution only. Created only when `CircleCIOidcProviderArn` is supplied. |

The ACM certificate is referenced by ARN, not created by the stack — keep cert lifecycle separate so renewals don't churn the demo stack.

## Prerequisites — get these from IT / cloud-platform before deploying

The template needs five real-world inputs that have to be procured ahead of time:

1. **AWS account.** Probably the existing Deque AWS account where other Solutions-Engineering infra lives. Confirm with cloud-platform.
2. **`dequedev` / `dequeprod` AWS profile** in `~/.aws/credentials`, matching the convention from `dequelabs/infrastructure/cloudformation/README.md`.
3. **Route53 hosted zone ID** for `dequelabs.com` (or whichever zone owns the target domain). Find under Route53 → Hosted zones in the AWS console.
4. **ACM certificate ARN** covering `demo-library.dequelabs.com`, `demo-library-dev.dequelabs.com`, and `demo-library-qa.dequelabs.com` — **must live in us-east-1** (CloudFront only consumes us-east-1 certs). If a wildcard `*.dequelabs.com` cert already exists, that works.
5. **CircleCI OIDC provider ARN** (optional but recommended). One-time per AWS account. If Deque already uses CircleCI OIDC for other projects, the provider already exists — grab the ARN from IAM → Identity providers. Otherwise it can be created later with a one-line `aws iam create-open-id-connect-provider` command (see CircleCI docs).

Without (5), the stack still deploys — you just deploy the bundle from a workstation with `AWS_PROFILE=dequedev` instead of from CI. The IAM role can be added in a later stack update.

## First deploy — local, from a workstation

Sanity-test the template before wiring up CI.

```bash
# from inside the repo
cd "/Users/patlouis/DemoSites/Deque Asset Demo Library"

# Required environment variables
export DEMO_LIBRARY_HOSTED_ZONE_ID=Z0123456789ABCDEFGHIJ
export DEMO_LIBRARY_ACM_CERT_ARN=arn:aws:acm:us-east-1:123456789012:certificate/abc-…

# Optional: lock down the CircleCI deploy role
# export DEMO_LIBRARY_CIRCLECI_OIDC=arn:aws:iam::123456789012:oidc-provider/oidc.circleci.com/org/abc-…
# export DEMO_LIBRARY_CIRCLECI_PROJ=abc-…

./scripts/deploy-cfn.sh dev
```

The script:

1. Validates the template (`aws cloudformation validate-template`).
2. Applies the stack (`aws cloudformation deploy --capabilities CAPABILITY_NAMED_IAM`).
3. Reads the stack outputs to discover the bucket name and CloudFront distribution ID.
4. Builds the Vite bundle (`npm run build`).
5. Syncs `dist/` to the bucket with the right cache headers (immutable on `assets/*`, no-store on `index.html`).
6. Invalidates `/` and `/index.html`.
7. Prints the final URL.

Total time: roughly 6–8 minutes for the first deploy (CloudFront distribution provisioning is the long pole). Subsequent deploys are 30–60 seconds.

## QA + Prod

Following the Deque convention from `infrastructure/cloudformation/README.md`:

```bash
# QA
./scripts/deploy-cfn.sh qa
# → stack name: deque-demo-library-qa
# → bucket:     deque-demo-library-qa-<acct>
# → URL:        https://demo-library-qa.dequelabs.com

# Prod
./scripts/deploy-cfn.sh prod
# → stack name: deque-demo-library-prod
# → bucket:     deque-demo-library-prod-<acct>
# → URL:        https://demo-library.dequelabs.com
```

Each environment is its own fully-isolated stack — separate bucket, distribution, IAM role, cache policy. No shared resources, no cross-environment blast radius.

`dev` and `qa` deploys land in the `dequedev` AWS profile by default; `prod` switches to `dequeprod` automatically. Override by exporting `AWS_PROFILE` before calling the script.

## CI/CD — CircleCI

CircleCI is the Deque-standard pipeline runner (per the infrastructure README's "CircleCI automatically deploys every `develop` commit"). A typical `.circleci/config.yml` job for this stack:

```yaml
version: 2.1

orbs:
  aws-cli: circleci/aws-cli@4.1

jobs:
  deploy-dev:
    docker:
      - image: cimg/node:lts
    steps:
      - checkout
      - aws-cli/setup:
          role_arn: arn:aws:iam::123456789012:role/deque-demo-library-dev-deploy
          region: us-east-1
      - run: npm ci
      - run:
          name: Deploy to dev
          command: |
            export DEMO_LIBRARY_HOSTED_ZONE_ID=$HOSTED_ZONE_ID
            export DEMO_LIBRARY_ACM_CERT_ARN=$ACM_CERT_ARN
            ./scripts/deploy-cfn.sh dev

workflows:
  on-develop:
    jobs:
      - deploy-dev:
          filters:
            branches:
              only: develop
```

The OIDC role from `CircleCIOidcProviderArn` is the trust mechanism — no long-lived access keys live in CircleCI. The `aws-cli/setup` orb exchanges the OIDC token for short-lived STS credentials.

A `prod` deploy job is identical except for the role ARN and the branch filter (`main` typically).

## Migration sequence — from Vercel to AWS, low risk

1. **Provision the prereqs above** (account, hosted zone, ACM cert). This is most of the calendar time; the actual technical work is fast.

2. **Land the CloudFormation template upstream.** Open a PR in `dequelabs/infrastructure` adding `cloudformation/deque-demo-library.yaml`. This file is identical to the one in this repo — the duplicate copy here is for local iteration; the source-of-truth lives in the infrastructure repo (consistent with how every other Deque service does it). Drop the local copy once it merges.

3. **First deploy to dev.** Run `./scripts/deploy-cfn.sh dev` from a workstation with `dequedev` AWS profile. Verify `https://demo-library-dev.dequelabs.com` loads, scans cleanly in axe DevTools®, all 14 Northbrook pages + 9 DQBC pages render, sign-in works.

4. **Wire CircleCI.** Add the `.circleci/config.yml` job. First green build = "we no longer touch this manually."

5. **Deploy to prod.** Run `./scripts/deploy-cfn.sh prod` (or let CircleCI do it from `main`).

6. **DNS cutover.** Once the prod CloudFront URL is verified, lower TTL on the current Vercel-pointing DNS record (if Vercel is fronted by your DNS) to a few minutes, wait for propagation, then flip the record to point at CloudFront. If the DNS is currently Vercel-managed and there's no third-party CNAME, just point `demo-library.dequelabs.com` at CloudFront directly via Route53.

7. **Verification window.** Leave the Vercel deployment running for 24-48 hours so we can roll back instantly by reverting the DNS record if anything regresses (Pro extension comparison, broken hashes, etc).

8. **Tear down Vercel.** Remove the Vercel project and the `vercel.json` from this repo. Update the root README's Deploy section to reference `docs/aws-migration.md` instead of Vercel.

## Trade-offs vs Vercel — honest accounting

**What we lose**

- **Preview deployments per PR.** Vercel mints a unique URL for every PR; AWS does not, out of the box. Two paths if we want this back:
  1. Spin up a second stack template parameterised by branch name (one S3 bucket + one CloudFront distribution per PR). Adds maybe 1-2 days of work and ~$0.50/month per open PR.
  2. Use AWS Amplify Hosting for the dev environment specifically (matching the precedent set by `axe-reports-amplify.yaml`) and keep S3 + CloudFront for prod.
- **Vercel's build orchestration UI.** Build logs live in CircleCI now.
- **Edge functions / middleware.** Not used today; not relevant.

**What we gain**

- **Lives in Deque's AWS org.** No third-party tenancy, no legal/security exception needed for customer-facing demo content.
- **Consistency.** Same deploy pattern, same IAM model, same observability stack (CloudWatch, DataDog) as every other Deque product.
- **Cost.** S3 + CloudFront for a low-traffic demo site costs roughly $1–5/month vs Vercel's plan tier. Not material either way, but worth noting.
- **Full IAM control.** The deploy role can `s3:PutObject` to one bucket and `cloudfront:CreateInvalidation` on one distribution. That's it. No console access, no other resources.

## Open questions / parking lot

- **Which AWS account?** Probably the existing Solutions-Engineering or shared sandbox account. Cloud-platform owns the answer.
- **Do we want per-PR preview URLs?** If yes, decide between the second-stack-per-branch path or moving to Amplify Hosting for the dev environment.
- **Custom error pages.** The current template aliases 403/404 to `/index.html` defensively (HashRouter doesn't strictly need this, but it covers e.g. a hand-typed `/favicon.ico` URL). If we want a real 404 page instead, that's a small template change.
- **WAF.** No AWS WAF attached to the distribution today. Worth adding if the prod site picks up unusual traffic — `AWS::WAFv2::WebACL` slots in as one extra resource and one `WebACLId` field on the distribution. Cost is ~$5/month + per-request fees.
- **Analytics.** The current site has nothing. If Deque uses an org-standard analytics path (Cloudflare Web Analytics, GA4, internal), add it after cutover.

## File reference

- `cloudformation/deque-demo-library.yaml` — the stack (this repo's copy; the upstream copy lives in `dequelabs/infrastructure/cloudformation/`)
- `scripts/deploy-cfn.sh` — one-shot validate + deploy + sync + invalidate
- `docs/aws-migration.md` — this document
