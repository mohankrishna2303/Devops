# AI-Powered DevOps Automation Platform

End-to-end flow aligned with your spec: **User → React → Django REST API → AI (OpenAI) → DevOps integrations (GitHub, Docker, K8s, Terraform) → PostgreSQL**.

## Architecture

```
User → React Frontend → Django REST API → AI Service (OpenAI)
                    ↓
         DevOps Integrations (GitHub, Docker, K8s, Terraform)
                    ↓
         Database (PostgreSQL or SQLite)
```

## Backend (Django)

- **Location:** `backend/`
- **Apps:** `api` (users/auth, projects, deployments, services)
- **Auth:** JWT via `djangorestframework-simplejwt` (register, login, profile)
- **DB:** SQLite by default. For PostgreSQL set env: `USE_POSTGRES=True`, `PG_NAME`, `PG_USER`, `PG_PASSWORD`, `PG_HOST`, `PG_PORT`
- **Services:** Under `api/services/`:
  - `github_service.py` – GitHub API, webhooks, create repo
  - `docker_service.py` – Docker build/push (CLI or SDK)
  - `k8s_service.py` – Kubernetes metrics and apply YAML
  - `terraform_service.py` – Terraform plan/apply via CLI
  - `deployment_engine.py` – Orchestrator for full deploy pipeline
  - `legacy_services.py` – Notifications, Jenkins, DB, cost, etc.

### API (main)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register/` | Register |
| POST | `/api/auth/login/` | Login (returns JWT access/refresh) |
| GET | `/api/auth/profile/` | Current user (JWT) |
| POST | `/api/projects/` | Create project |
| GET | `/api/projects/` | List projects (scoped to user) |
| GET | `/api/projects/:id/` | Project detail |
| POST | `/api/devops/generate/` | Generate Dockerfile + K8s YAML + Terraform (body: `project_id`) |
| POST | `/api/devops/deploy/` | Deploy (body: `project_id`) |
| GET | `/api/deployments/` | List deployments |

### Run backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # or source venv/bin/activate
pip install django djangorestframework djangorestframework-simplejwt psycopg2-binary corsheaders openai python-dotenv requests
python manage.py migrate
# Optional: set OPENAI_API_KEY for AI generation
python manage.py runserver
```

## Frontend (React)

- **Location:** `my-devops/` (Vite + React)
- **Auth:** Token in localStorage; sent as `Authorization: Bearer <token>`; `AuthContext` + `authService`
- **Pages:** Landing (`/`), Login (`/login`), Register (`/register`), Dashboard (`/dashboard`), Project details (`/projects/:id`)
- **Components:** Navbar, Sidebar (in DashboardLayout), ProjectCard, FileViewer, DeploymentStatus, ProtectedRoute

### Run frontend

```bash
cd my-devops
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:8000/api` if the API is on another host.

## MVP flow

1. User registers / logs in.
2. User creates a project (name, language, framework, cloud provider).
3. User opens project → clicks **Generate DevOps Config** → AI produces Dockerfile, K8s YAML, Terraform.
4. User views and downloads the generated files.
5. (Optional) User clicks Deploy → deployment record is created; advanced flow can use `DeploymentEngine` with GitHub/Docker/K8s/Terraform.

## Implementation order (as per your plan)

1. **Done:** AI generator only (MVP)
2. **Done:** Backend services split (GitHub, Docker, K8s, Terraform) + orchestrator
3. Next: GitHub repo creation + push from UI
4. Next: Docker build automation
5. Next: Kubernetes deployment automation
6. Next: Terraform execution + monitoring

Build and run the backend and frontend as above to test the full flow.
