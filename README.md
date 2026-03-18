# DevOps Dashboard Platform

A comprehensive DevOps dashboard with AI-powered automation, real-time metrics, and integrated toolchain management.

## 📁 Project Structure

```
devops/
├── README.md                    # This file
├── docker-compose.yml          # Main orchestration
├── .gitignore                  # Global gitignore
├── backend/                    # Django backend API
│   ├── manage.py
│   ├── db.sqlite3
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   ├── api/                    # API endpoints
│   └── core/                   # Core Django settings
├── frontend/                   # React frontend dashboard
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/                    # React components
│   ├── public/                 # Static assets
│   ├── node_modules/           # Dependencies
│   ├── Dockerfile
│   └── .env.example
├── terraform/                  # Infrastructure as code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── docs/                       # Documentation
│   ├── README_AI_DEVOPS.md     # AI features documentation
│   ├── RUN.md                  # Setup and run instructions
│   └── WALKTHROUGH.md          # Feature walkthrough
└── .github/                    # CI/CD workflows
    └── workflows/
```

## 🚀 Quick Start

### Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### Full Stack with Docker
```bash
docker-compose up
```

## 📖 Documentation

- **[AI Features](docs/README_AI_DEVOPS.md)** - Complete AI-powered automation features
- **[Setup Guide](docs/RUN.md)** - Detailed installation and configuration
- **[Feature Walkthrough](docs/WALKTHROUGH.md)** - Step-by-step feature guide

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Django, SQLite
- **AI Integration**: OpenAI ChatGPT API
- **Infrastructure**: Terraform, Docker
- **CI/CD**: GitHub Actions

## 🔧 Environment Setup

1. Copy environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Configure your API keys and credentials in the `.env` files

3. Run the development servers as shown above

## 📊 Features

- **Real-time Dashboard** - DORA metrics, deployment monitoring
- **AI Assistant** - ChatGPT-powered DevOps automation
- **Pipeline Management** - CI/CD pipeline monitoring and analysis
- **Multi-Cloud Support** - AWS, Azure, GCP integration
- **Infrastructure as Code** - Terraform automation
- **Security Scanning** - Automated vulnerability assessment

---

**Built with ❤️ for DevOps teams**
