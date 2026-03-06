# Run the AI DevOps Website (Frontend + Backend Connected)

## 1. Backend (Django API)

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install django djangorestframework djangorestframework-simplejwt corsheaders openai python-dotenv requests
python manage.py migrate
python manage.py runserver
```

API runs at **http://localhost:8000**. Endpoints are under **http://localhost:8000/api/**.

Optional: set `OPENAI_API_KEY` in env (or `.env` in `backend/`) for real AI-generated Dockerfile/K8s/Terraform.

## 2. Frontend (React / Vite)

```bash
cd my-devops
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** (or the port Vite prints).

### Connect to backend

- By default the app uses **http://localhost:8000/api** as the API base.
- To override, create a file `my-devops/.env` with:
  ```
  VITE_API_URL=http://localhost:8000/api
  ```
  (Use your backend URL if different, e.g. `http://127.0.0.1:8000/api`.)

Restart `npm run dev` after changing `.env`.

## 3. Quick test

1. Open **http://localhost:5173** in the browser.
2. You should see the Dashboard (no login required).
3. Go to **Projects** (sidebar) → **Add New Project** → fill name, language, framework, cloud → **Create**.
4. Open the new project → click **Generate DevOps Config** → wait a few seconds.
5. Check the **Dockerfile / K8s YAML / Terraform** tabs and **Download**.
6. Click **Deploy** to create a deployment record.

If the backend is not running, creating a project or generating config will fail; start the backend first.

## 4. API health

- **GET http://localhost:8000/api/** returns `{"ok": true, "status": "running"}` when the API is up.
