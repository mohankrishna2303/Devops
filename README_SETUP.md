# DevOps Platform - Complete Setup Guide

## 🚀 Overview

This is a comprehensive AI-powered DevOps platform that integrates all major DevOps tools and services into a single dashboard. It provides real-time monitoring, automated deployments, infrastructure management, and AI-powered troubleshooting.

## 📋 Features

### Core DevOps Modules
- **Dashboard** - Real-time system overview and metrics
- **Projects** - GitHub repository management
- **Pipelines** - CI/CD pipeline automation (Jenkins)
- **Terraform** - Infrastructure as Code management
- **Kubernetes** - Container orchestration
- **Observability** - Monitoring and metrics (Grafana/Prometheus)
- **Security** - Vulnerability scanning and DevSecOps
- **AI Assistant** - Intelligent troubleshooting and automation

### Advanced Features
- **Multi-Environment Support** - Dev, Test, Staging, Production
- **Container Registry** - Docker image management
- **Log Analysis** - Splunk integration
- **Alert Management** - Real-time notifications
- **User Management** - Role-based access control
- **Analytics** - DORA metrics and performance insights
- **Integrations** - Connect with external tools

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Django** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Primary database
- **SQLite** - Development database
- **JWT** - Authentication
- **Docker** - Containerization

### DevOps Tools
- **GitHub** - Source code management
- **Jenkins** - CI/CD pipelines
- **Terraform** - Infrastructure as Code
- **Kubernetes** - Container orchestration
- **Docker** - Containerization
- **Grafana** - Monitoring dashboards
- **Splunk** - Log analysis
- **AWS/Azure/GCP** - Cloud providers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Docker & Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd devops
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### 4. Full Stack with Docker
```bash
# From project root
docker-compose up

# This will start:
# - PostgreSQL database
# - Django backend (port 8000)
# - React frontend (port 5173)
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DEBUG=True
SECRET_KEY=your-secret-key-here
USE_POSTGRES=False

# Optional: PostgreSQL (if USE_POSTGRES=True)
PG_NAME=devops_db
PG_USER=postgres
PG_PASSWORD=your-password
PG_HOST=localhost
PG_PORT=5432

# AI Integration
OPENAI_API_KEY=your-openai-key

# Integrations
GITHUB_OAUTH_CLIENT_ID=your-github-client-id
GITHUB_OAUTH_CLIENT_SECRET=your-github-client-secret
SLACK_WEBHOOK_URL=your-slack-webhook-url

# Cloud Providers
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_DEFAULT_REGION=us-east-1
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📱 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

Default credentials (if using superuser):
- Username: admin
- Password: admin

## 🔌 Integrations Setup

### GitHub Integration
1. Create a GitHub OAuth App
2. Set redirect URL to: `http://localhost:8000/api/auth/social/github/callback/`
3. Add Client ID and Secret to backend .env

### Jenkins Integration
1. Enable Jenkins API
2. Generate API token
3. Configure Jenkins URL in settings

### Terraform Integration
1. Configure cloud provider credentials
2. Set up Terraform state backend
3. Add Terraform files to `terraform/` directory

### Kubernetes Integration
1. Configure kubeconfig file
2. Set up cluster access
3. Deploy Kubernetes resources

## 📊 Monitoring Setup

### Grafana Dashboards
1. Install Grafana
2. Configure Prometheus data source
3. Import pre-built dashboards

### Splunk Integration
1. Set up Splunk HTTP Event Collector
2. Configure index for DevOps logs
3. Add Splunk credentials to settings

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- API rate limiting
- CORS protection
- Security scanning (SAST/DAST)
- Vulnerability detection
- Secret scanning

## 📈 Analytics & Metrics

### DORA Metrics
- Deployment Frequency
- Lead Time for Changes
- Change Failure Rate
- Mean Time to Recovery

### Custom Metrics
- Build success rate
- Test coverage
- Infrastructure costs
- Performance metrics

## 🤖 AI Assistant

The AI assistant provides:
- Automated troubleshooting
- Log analysis
- Performance optimization suggestions
- Security recommendations
- Deployment guidance

## 🚀 Deployment

### Production Deployment
```bash
# Build Docker images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment
```bash
# Apply Kubernetes manifests
kubectl apply -f kubernetes/

# Check deployment status
kubectl get pods -n devops-platform
```

## 📚 API Documentation

### Authentication
```bash
# Login
POST /api/auth/login/
{
  "username": "your-username",
  "password": "your-password"
}

# Get dashboard stats
GET /api/analytics/dashboard/
Authorization: Bearer <token>
```

### Key Endpoints
- `/api/projects/` - Project management
- `/api/pipelines/` - CI/CD pipelines
- `/api/terraform/` - Infrastructure management
- `/api/k8s/` - Kubernetes operations
- `/api/observability/` - Monitoring data
- `/api/ai/chat/` - AI assistant

## 🛠️ Development

### Adding New Features
1. Create frontend components in `src/components/`
2. Add pages in `src/pages/`
3. Create API endpoints in `backend/api/`
4. Update routing in `App.jsx`

### Testing
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test
```

### Code Quality
```bash
# Backend linting
cd backend
flake8 .

# Frontend linting
cd frontend
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Join our community Discord

## 🗺️ Roadmap

- [ ] Multi-cloud support
- [ ] Advanced AI automation
- [ ] Mobile app
- [ ] Enterprise SSO
- [ ] Advanced analytics
- [ ] Custom integrations marketplace

---

**Built with ❤️ for DevOps teams worldwide**
