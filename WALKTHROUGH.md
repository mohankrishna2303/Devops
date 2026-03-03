# AI CI/CD Failure Intelligence Platform - Walkthrough

Welcome to the **AI CI/CD Failure Intelligence Platform**, a comprehensive solution for monitoring, analyzing, and resolving CI/CD pipeline failures using AI-driven insights. This document provides an overview of the platform's architecture, features, and how to get started.

## 🚀 Vision
Turn your CI/CD failures into actionable knowledge. Stop the "Trial and Error" debugging cycle with real-time root cause analysis and automated fix suggestions.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Framer Motion, Recharts, Lucide Icons.
- **Backend**: Django, Django REST Framework.
- **AI Engine**: OpenAI GPT-4 for log analysis and clustering.
- **Database**: PostgreSQL (or SQLite for local dev).

## 🌟 Key Features
1.  **Direct-Open Dashboard**: Immediate access to your DevOps metrics without an authentication wall (perfect for status monitors).
2.  **AI Failure Clustering**: Hundreds of failures are grouped into intelligent "Intelligence Hub" cards.
3.  **DORA Metrics**: Native tracking of MTTR, Deployment Frequency, and Change Failure Rate.
4.  **Omni-Import**: Data ingestion via Webhooks, API Pull (Scheduled Sync), and Legacy CSV upload.
5.  **Infrastructure as Code (IaC)**: Integrated **Terraform** hub to manage AWS/Azure resources directly from the UI.
6.  **Smart Alerting**: Ready for Slack, Email, and PagerDuty notifications.
7.  **Full Data Lifecycle**: Automated data seeding for demo environments, CSV Export, and Full Analytics Reporting.
8.  **Container Registry**: Private Docker-hub simulation for verified image management.
9.  **AI Auto-Fix**: One-click code patch generation and Pull Request simulation for failed builds.
10. **Cloud Auto-Discovery**: Automated scanning of AWS/Azure accounts to discover and track "Shadow IT" resources.
11. **Cost Optimization Hub**: AI-driven analysis of cloud waste with "Optimize Now" financial remediation.
12. **Production CI/CD**: Fully automated GitHub Actions pipeline for building, testing, and deploying Docker images to AWS.

## 📂 Project Structure
```text
/backend
  /api              # Django App for the API
    /models.py      # Org, Project, Pipeline, Failure, FailureCluster
    /views.py       # Webhooks, Analytics, Imports, Exports
    /ai_service.py  # OpenAI integration logic
  /core             # Project settings & URL routing
  seed_demo_data.py # Data population script
/my-devops
  /src
    /components     # Dashboard modules (Overview, Projects, etc.)
    /api.js         # Centralized API client (Axios)
    /index.css      # Custom Glassmorphism design system
/terraform
  main.tf           # AWS/Azure Infrastructure resources
  variables.tf      # Environment configuration
  outputs.tf        # Resource IDs and Endpoints
```

## 🚦 Getting Started (Local)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python seed_demo_data.py  # Populates your dashboard with 50 runs
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd my-devops
npm install
npm run dev
```

### 🐳 3. Dockerized Setup (One-Click)
If you have Docker and Docker Compose installed, you can skip the manual setup and run everything (including a PostgreSQL database) with one command:
```bash
# In the project root
docker-compose up --build
```
This will start:
- **Backend API**: `http://localhost:8000`
- **Frontend App**: `http://localhost:5173`
- **Database**: PostgreSQL on port `5432`

## 🧪 Testing the Lifecycle
- **View Insights**: Navigate to the "Failures" tab to see real AI explanations for your recent failures.
- **Sync Repository**: Click "Sync GitHub" in the Overview and input a repo (e.g., `facebook/react`) to pull real data.
- **Mark Resolved**: Use the "Mark as Resolved" button in the Intelligence Hub to track your bug-squashing progress.
- **Download Report**: Use the "Full Report" button to get a text-based summary of your organization's health.

---
*Created by the BrainDevOps AI Team - Helping you build faster, one failure at a time.*
