# AWS migration runbook — Deque Asset Demo Library

Move the multi-sector demo library off Vercel and into Deque's own AWS account, hosted via **AWS Amplify Hosting**, with infrastructure-as-code in CloudFormation following the patterns in [`dequelabs/infrastructure/cloudformation/`](https://github.com/dequelabs/infrastructure/blob/develop/cloudformation/README.md) and the Workshop2 demo site in [`dequelabs/axe-devtools-demos`](https://github.com/dequelabs/axe-devtools-demos).

This doc is the runbook + architecture reference. The actual template lives at [`cloudformation/deque-demo-library.yaml`](../cloudformation/deque-demo-library.yaml); the deploy helper is [`scripts/deploy-cfn.sh`](../scripts/deploy-cfn.sh).

## Why move, why Amplify

We're currently on Vercel (see `vercel.json` + the deploy section in the root README). Two reasons to move:

1. **Tenancy / legal.** A customer-facing Deque demo site living in third-party Vercel tenancy raises eyebrows in security review. Hosting in Deque's AWS org sidesteps that conversation entirely.
2. **Consistency.** Other Deque demo sites already deploy from CloudFormation. New infrastructure should match.

### Why Amplify specifically, not S3 + CloudFront

The Solutions-Architects team's `axe-devtools-demos` repo already hosts a near-identical workload (`workshop2.dequelabs.com`, `broken-workshop2.dequelabs.com`, `fixed-workshop2.dequelabs.com`) on AWS Amplify. Matching that precedent buys us a lot:

| What Amplify gives us out of the box | What we'd otherwise build by hand |
| --- | --- |
| Push-to-deploy from GitHub | CircleCI job, OIDC role trust policy, deploy script that does `s3 sync` + invalidate |
| Automatic SSL cert provisioning + renewal | ACM cert request, DNS validation, cert ARN parameter |
| Per-PR preview URLs (e.g. `https://pr-42.<appid>.amplifyapp.com`) | Per-PR S3 buckets + CloudFront distributions, or going without |
| Build logs UI tied to git refs | Building inside CircleCI, separate log surface |
| Branch-based subdomains (`fixed.` vs `main.`) | Multiple stacks parameterized by branch name |

The trade-off is a marginal cost increase (Amplify charges $0.01/build-minute + $0.023/GB hosting — for a low-traffic demo site this is ~$5-15/month versus ~$1-5 for S3+CloudFront) and slightly less control over caching/edge behaviour. Both are acceptable; the engineering-time savings are not.

We had originally drafted an S3+CloudFront template for this repo; it was replaced when the Workshop2 precedent surfaced. The old template is available in git history (`git log --follow cloudformation/deque-demo-library.yaml`) if we ever need to revisit.

## Architecture

```
                                  (developer push / PR open)
                                              │
                                              ▼
                              ┌─────────────────────────────┐
                              │  GitHub: deque-asset-demo-  │
                              │  library                    │
                              └─────────────────────────────┘
                                              │ webhook
                                              ▼
                ┌────────────────────────────────────────────────────────┐
                │  AWS Amplify App  (CloudFormation: AWS::Amplify::App)  │
                │  ├─ BuildSpec: npm ci → npm run build → publish dist/  │
                │  ├─ CustomRules: SPA fallback to /index.html           │
                │  └─ IAM service role (amplify.amazonaws.com)           │
                └────────────────────────────────────────────────────────┘
                                              │
                       ┌──────────────────────┼──────────────────────┐
                       ▼                      ▼                      ▼
                ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
                │ main branch  │      │ PR previews  │      │ AmplifyDomain│
                │ (PRODUCTION) │      │ (per-PR URL) │      │  ACM + DNS   │
                └──────────────┘      └──────────────┘      └──────────────┘
                       │                      │                      │
                       └──────────────────────┴──────────────────────┘
                                              ▼
                          https://demo-library[-dev|-qa].dequelabs.com
                          https://main.<appid>.amplifyapp.com  (default)
                          https://pr-<n>.<appid>.amplifyapp.com  (per PR)
```

### Resources the stack creates

| Resource | Purpose |
| --- | --- |
| `AWS::IAM::Role` | Service role assumed by Amplify during builds (scoped to `amplify:*`). Same shape as the Workshop2 template. |
| `AWS::Amplify::App` | The umbrella app: GitHub repo URL + OAuth token + build spec (Vite → `dist/`) + SPA-fallback rewrite rule + tags. |
| `AWS::Amplify::Branch` | The production branch. `EnableAutoBuild: true` + `EnablePullRequestPreview: true` so pushes auto-deploy and PRs get preview URLs. |
| `AWS::Amplify::Domain` | Subdomain → branch mapping. Provisions the ACM cert and Route53 records automatically — no manual DNS validation. |

Notably **absent** compared to the S3+CloudFront approach: no S3 bucket, no bucket policy, no OAC, no CloudFront distribution, no cache policies, no response-headers policy, no Route53 record set, no CircleCI deploy role, no ACM cert parameter. Amplify subsumes all of it. The template is ~190 lines versus the S3+CloudFront version's ~410.

## Prerequisites — get these before deploying

The template needs three real-world inputs. Two come from Deque IT/cloud-platform; one you create yourself.

1. **AWS account access.** Confirm with cloud-platform which Deque AWS account owns SE demo infrastructure (likely the same one that hosts `workshop2.dequelabs.com`). You'll need `~/.aws/credentials` set up with the `dequedev` profile (see "AWS credentials setup" below).
2. **Route53 hosted zone for `dequelabs.com`.** The `AmplifyDomain` resource attaches to this zone. You don't need to pass the zone ID as a parameter — Amplify looks it up by name — but the zone must exist in the same AWS account you're deploying into. Verify with `aws route53 list-hosted-zones-by-name --dns-name dequelabs.com`.
3. **GitHub Personal Access Token.** This is the one new prereq vs the S3+CloudFront design. Create at [github.com/settings/tokens](https://github.com/settings/tokens) (classic): `repo` scope, no expiration or 1-year. Store in 1Password (or wherever Deque keeps shared secrets) and export as `DEMO_LIBRARY_GITHUB_TOKEN` when running the script.

**What's no longer needed** (compared to the original S3+CloudFront plan): the ACM cert ARN (Amplify provisions one), the CircleCI OIDC provider (no CircleCI), the CircleCI project UUID, and the hosted-zone ID as an explicit parameter.

### AWS credentials setup — `dequedev` profile

```bash
brew install awscli                       # if not already installed
aws configure sso --profile dequedev      # interactive: takes you through SSO

# After the SSO wizard completes:
AWS_PROFILE=dequedev aws sts get-caller-identity   # should print your IAM identity

# SSO sessions expire (typically 8h). Refresh with:
aws sso login --profile dequedev
```

When the wizard asks for the **SSO start URL**, this is Deque's AWS access portal — get it from your IT onboarding email, a teammate who's already deployed to AWS, or `#it-help`. It's an `https://<something>.awsapps.com/start/` URL.

## First deploy — local, from a workstation

Sanity-test the template before any CI integration.

```bash
# from inside the repo
cd "/Users/patlouis/DemoSites/Deque Asset Demo Library"

# Required: GitHub PAT (see prereqs above)
export DEMO_LIBRARY_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Defaults work for most cases; override if needed:
# export DEMO_LIBRARY_DOMAIN=dequelabs.com
# export DEMO_LIBRARY_SUBDOMAIN=demo-library
# export DEMO_LIBRARY_REPO=https://github.com/dequelabs/deque-demo-library
# export DEMO_LIBRARY_PROD_BRANCH=main

# Deploy stack + trigger the very first build
TRIGGER_BUILD=1 ./scripts/deploy-cfn.sh dev
```

The script:

1. Validates the template (`aws cloudformation validate-template`).
2. Applies the stack (`aws cloudformation deploy --capabilities CAPABILITY_NAMED_IAM`).
3. Reads the outputs to discover the Amplify App ID and URLs.
4. If `TRIGGER_BUILD=1`: kicks off the first build via `aws amplify start-job`.

Subsequent deploys: just push to the production branch on GitHub. Amplify's webhook fires automatically — no script needed.

Total time on first deploy:
- Stack create: ~2 minutes.
- ACM cert provisioning + DNS validation: ~5-15 minutes (Amplify does both automatically once the `AmplifyDomain` resource is in place).
- First build: ~3-5 minutes (mostly `npm ci` + `npm run build`).

Worth knowing: the `https://main.<appid>.amplifyapp.com` default URL is reachable as soon as the first build finishes, even before the custom subdomain's DNS propagates. Use that for the smoke test.

## QA + Prod

```bash
# QA
./scripts/deploy-cfn.sh qa
# → stack name: deque-demo-library-qa
# → URL:        https://demo-library-qa.dequelabs.com

# Prod
./scripts/deploy-cfn.sh prod
# → stack name: deque-demo-library-prod
# → URL:        https://demo-library.dequelabs.com
```

Each environment is its own fully-isolated stack — separate Amplify App, separate ACM cert, separate IAM service role, separate webhook. No shared resources, no cross-environment blast radius.

`dev` and `qa` deploys land in the `dequedev` AWS profile by default; `prod` switches to `dequeprod` automatically. Override by exporting `AWS_PROFILE` before calling the script.

If you want all three environments to track different branches (e.g. `dev` follows `develop`, `prod` follows `main`), set `DEMO_LIBRARY_PROD_BRANCH` per call:

```bash
DEMO_LIBRARY_PROD_BRANCH=develop ./scripts/deploy-cfn.sh dev
DEMO_LIBRARY_PROD_BRANCH=main    ./scripts/deploy-cfn.sh prod
```

## CI/CD — there's nothing to wire up

Amplify's GitHub webhook **is** the CI/CD. When you push to the production branch, Amplify:

1. Sees the webhook
2. Clones the repo
3. Runs the BuildSpec (`npm ci` → `npm run build`)
4. Publishes `dist/` to its hosted CDN
5. Invalidates cache automatically

There is no `.circleci/config.yml` to write, no IAM role to trust, no OIDC provider to register. The only thing CircleCI would still be useful for here is **pre-merge validation** — running `npm run build`, `cfn-lint`, axe-core scans on PR branches before they're merged. That's a CI concern, not a deploy concern, and orthogonal to this migration.

### Per-PR preview URLs

`EnablePullRequestPreview: true` on the production branch gives you a deploy preview at `https://pr-<n>.<appid>.amplifyapp.com` for every open PR against that branch. This is the Vercel feature we'd worried about losing — Amplify gives it back for free.

Caveat: Amplify uses the same BuildSpec for previews as for the production branch, so any environment variables that differ between prod and preview need to be set in the Amplify console (or added as `EnvironmentVariables` properties in the template).

## Migration sequence — from Vercel to AWS, low risk

1. **Procure prereqs.** AWS account access + `dequedev` SSO profile + GitHub PAT. The biggest calendar-time item is usually #1.

2. **Land the CloudFormation template upstream (optional).** Open a PR in `dequelabs/infrastructure` adding `cloudformation/deque-demo-library.yaml`, mirroring how `axe-reports` / `axe-net-web` / etc. are tracked there. If the SE team prefers to keep this template in the demo-library repo instead, that's also fine — Workshop2's template lives in `axe-devtools-demos`, not `infrastructure`.

3. **First deploy to dev.** `TRIGGER_BUILD=1 ./scripts/deploy-cfn.sh dev` from a workstation with `dequedev` AWS profile. Verify the build succeeds (Amplify console), then verify `https://main.<appid>.amplifyapp.com` loads. Once ACM + DNS propagate, verify `https://demo-library-dev.dequelabs.com` works too — all 14 Northbrook pages + 9 DQBC pages render, sign-in works, scans cleanly in axe DevTools®.

4. **Open a test PR to confirm preview URLs work.** Push a tiny change on a branch, open a PR, watch Amplify spin up a `pr-N.<appid>.amplifyapp.com` URL. This validates the EnablePullRequestPreview setting end-to-end.

5. **Deploy to prod.** `./scripts/deploy-cfn.sh prod` (manually for the first cutover; subsequent deploys come from pushes to `main`).

6. **DNS cutover.** Once the prod Amplify URL is verified, the `AmplifyDomain` resource has already created the Route53 records for `demo-library.dequelabs.com`. If Vercel was previously serving this domain via a CNAME you control elsewhere, remove that record. If `dequelabs.com` is hosted in the same Route53 zone, there's nothing to do — Amplify wrote the right records directly.

7. **Verification window.** Leave the Vercel deployment running for 24-48 hours so we can roll back instantly by reverting the DNS record if anything regresses (Pro extension comparison, broken hashes, content mismatch).

8. **Tear down Vercel.** Remove the Vercel project and `vercel.json` from this repo. Update the root README's Deploy section to reference this doc instead of Vercel.

## Trade-offs vs Vercel — honest accounting

**What we lose**

- **Vercel's specific UI/UX.** Build logs live in the Amplify console now. Different shape, same information.
- **Edge functions / middleware.** Not used today; not relevant.

**What we keep**

- **Push-to-deploy.** Amplify webhook on push.
- **Per-PR preview URLs.** `EnablePullRequestPreview: true` on the production branch.
- **Automatic SSL.** Amplify provisions ACM certs.

**What we gain**

- **Lives in Deque's AWS org.** No third-party tenancy, no legal/security exception for customer-facing demo content.
- **Consistency.** Same deploy pattern as `workshop2.dequelabs.com`. Same IAM model, same observability stack (CloudWatch) as other Deque products.
- **Cost.** Roughly $5-15/month for low-traffic demo traffic. Not material either way.
- **Branch-staged URLs.** Easy to mirror Workshop2's pattern of `broken-` vs `fixed-` subdomains later if SE wants a side-by-side before/after demo (add a second `AWS::Amplify::Branch` + a second `SubDomainSettings` entry).

## Open questions / parking lot

- **Which AWS account?** Probably the same one that hosts `workshop2.dequelabs.com`. Cloud-platform owns the answer.
- **Team tag value.** The Workshop2 template uses `Team=sax-team`. We've defaulted to `Team=se-team`; confirm whether SE has its own tag or should share with SA.
- **Production branch.** Default is `main`. The repo's current default branch is `develop` per the `dequelabs/infrastructure` convention — pick one. Easy to override per deploy with `DEMO_LIBRARY_PROD_BRANCH`.
- **Broken-vs-fixed dual deploys.** Workshop2 mirrors this as a demo device (broken on one URL, fixed on another). Worth considering for the demo library once Phase 2 is fully stabilized.
- **Pre-merge CI.** Amplify handles deploys, but we should still run `npm run build` + `cfn-lint` + axe-core scans on PRs. That's a separate `.circleci/config.yml` or `.github/workflows/` concern.
- **Secrets rotation.** The `GithubOAuthToken` parameter goes into the CloudFormation stack as `NoEcho` — readable from `describe-stacks` only by IAM principals with explicit permission. Rotate annually; rotation requires a stack update with the new token value.
- **Analytics.** The current site has nothing. If Deque uses an org-standard analytics path (Cloudflare Web Analytics, GA4, internal), add it after cutover.

## File reference

- `cloudformation/deque-demo-library.yaml` — the Amplify stack
- `scripts/deploy-cfn.sh` — validate + deploy + optional first build trigger
- `docs/aws-migration.md` — this document
- Precedent reference: [`dequelabs/axe-devtools-demos`](https://github.com/dequelabs/axe-devtools-demos) `Workshop2` template
