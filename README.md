# Consultant & Services Platform Frontend

[![Frontend CI/CD](https://github.com/mkatolika/consultant-platform/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/mkatolika/consultant-platform/actions/workflows/ci-cd.yml)

React frontend for the Consultant & Services Platform. It provides authentication, role-based dashboards, consultant and service discovery, bookings, appointment management, and reporting against the ASP.NET Core API.

## Local development

Requirements: Node.js 20 or newer and npm.

```bash
npm ci
npm start
```

Run the smoke tests and production build with:

```bash
CI=true npm test -- --watchAll=false
npm run build
```

## Docker

The production image uses a Node 20 build stage and serves the compiled SPA with Nginx. Nginx falls back to `index.html` for React Router routes and exposes port 80.

```bash
docker build --build-arg REACT_APP_API_BASE_URL=https://api.example.com -t consultant-services-frontend .
docker run --rm -p 8080:80 consultant-services-frontend
```

## CI/CD

The workflow at `.github/workflows/ci-cd.yml` runs on pull requests and pushes to `main`, with manual dispatch support.

Pipeline stages:

```text
BUILD                         SANITY CHECKS                    ARTIFACT PUBLISH            DEPLOY
npm-install ----------------+ frontend-unit-test -----------+ frontend-version-bump ---+
                            + frontend-lint                  |                           + deploy-dev
frontend-docker-candidate --+ frontend-sast                  | frontend-docker-publish --+
                            + frontend-secret-detection      |
                            + frontend-dependency-scanning   |
                            + frontend-container-scanning    |
                            + frontend-dast -----------------+
```

Both build jobs start in parallel. Every sanity check waits for both build jobs. Version bump and Docker publishing wait for every sanity check and then run in parallel. Deployment, including image and endpoint verification, waits for both artifact-publish jobs.

Pull requests stop after the tests and security scans. They never version, push, or deploy images. Main-branch deployments use the protected `production` GitHub Environment.

### Artifact promotion

The Docker image is built exactly once per workflow run:

```text
Docker build (candidate:<git-sha>)
  -> docker save + GitHub artifact
  -> load and scan exact candidate
  -> all required tests and scans pass
  -> load and retag exact candidate
  -> Docker Hub version/SHA/latest tags
  -> Azure deploy exact version tag
```

No downstream job runs `docker build`. Dependency restore and the candidate build start in parallel; after all checks pass, deterministic versioning and Docker Hub promotion also run in parallel. The version is derived from the `major.minor` portion of `package.json` plus `GITHUB_RUN_NUMBER`; for example, package version `0.1.0` at run 42 produces `0.1.42`. It does not modify or commit `package.json`, avoiding CI loops and branch-protection conflicts.

### Required GitHub secrets

Configure these repository or production-environment secrets:

- `DOCKERHUB_USER_NAME`: Docker Hub username, consistent with the backend convention.
- `DOCKERHUB_TOKEN`: Docker Hub access token with permission to push the frontend image.
- `AZURE_CLIENT_ID`: client ID of the Azure federated identity.
- `AZURE_TENANT_ID`: Azure tenant ID.
- `AZURE_SUBSCRIPTION_ID`: Azure subscription ID.

The Azure identity needs permission to update and read the target Container App. Configure its federated credential for this repository and the `production` GitHub Environment.

### Required GitHub variables

- `AZURE_RESOURCE_GROUP`: resource group containing the frontend Container App.
- `AZURE_CONTAINER_APP_NAME`: name of the frontend Azure Container App.

Optional variables:

- `DOCKER_IMAGE_NAME`: Docker Hub repository name. Defaults to `consultant-services-frontend`.
- `REACT_APP_API_BASE_URL`: API origin embedded in the production build. Defaults to the development Azure API.

The resulting default image name is:

```text
docker.io/<DOCKERHUB_USER_NAME>/consultant-services-frontend:<version>
```

The Azure resource group and Container App name are variables because the backend repository does not currently define an Azure deployment convention to reuse.

### Security behavior

- CodeQL analyzes JavaScript and TypeScript source.
- Gitleaks scans full Git history for secrets.
- Trivy reports fixed HIGH and CRITICAL dependency and image vulnerabilities. These two scan jobs are temporarily non-blocking while the existing vulnerability backlog is remediated.
- OWASP ZAP scans the running candidate. Informational and warning-level baseline findings are reported; confirmed failure-level findings fail the job.
- Unit-test coverage and the ZAP HTML report are retained as workflow artifacts.
- Deployment credentials are unavailable to pull-request jobs.

Current ESLint warnings are allowed up to the explicit threshold of 20, while lint errors still fail CI. This threshold should be reduced to zero after the existing warnings are corrected.
