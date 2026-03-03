# DevOps Dashboard - Complete AI-Powered Platform

A comprehensive DevOps dashboard with ChatGPT integration for automated validation, pipeline analysis, and intelligent insights.

## 🚀 Features

### Core Dashboard
- **Real-time Metrics** - DORA metrics, deployment frequency, failure rates
- **Project Management** - Create, monitor, and manage DevOps projects
- **Pipeline Monitoring** - CI/CD pipeline status, execution history, and analytics
- **Failure Analysis** - AI-powered root cause analysis and automated fixes
- **Intelligence Analytics** - Predictive performance analysis and optimization

### AI-Powered Features (ChatGPT Integration)
- **🤖 Code Validation** - Automated code quality analysis and best practices
- **🔍 Pipeline Analysis** - AI-driven failure analysis and fix recommendations
- **🏗️ Infrastructure Generation** - Auto-generate Docker, Kubernetes, and CI/CD configs
- **🔒 Security Audits** - Comprehensive vulnerability scanning and remediation
- **📊 Performance Optimization** - AI-driven performance tuning recommendations
- **📚 Documentation Generation** - Auto-generate technical documentation

### Platform Integrations
- **GitHub** - Repository sync, webhook integration, commit tracking
- **Jenkins** - Build pipeline integration, job monitoring
- **Docker** - Container management and registry integration
- **Kubernetes** - Cluster monitoring and deployment management
- **AWS** - Cloud resource management and cost optimization
- **Azure** - Microsoft Azure cloud services integration
- **GCP** - Google Cloud Platform services integration
- **Terraform** - Infrastructure as code management
- **Snyk** - Security vulnerability scanning
- **Splunk** - Log aggregation and analysis
- **Slack** - Team collaboration and notifications

### Database & Auto-Integration
- **SQLite Database** - Local database for project data, pipelines, and configurations
- **Auto-Integration Hub** - Step-by-step automated DevOps setup
- **Terraform Integration** - Generate and deploy infrastructure as code
- **Cloud Provider Auto-Setup** - Automated AWS, Azure, and GCP configuration
- **CI/CD Pipeline Generation** - Automated build, test, and deployment pipelines
- **Environment Provisioning** - Automated development, staging, and production setup

### Navigation & Sections
- **Dashboard** - Overview with key metrics and quick actions
- **Projects** - Project management with AI insights
- **Pipelines** - CI/CD pipeline monitoring and management
- **Failures** - AI-clustered failure analysis and resolution
- **Analytics** - DORA metrics and performance analytics
- **Ecosystem** - System integrations overview
- **Kubernetes** - Container orchestration management
- **Observability** - Monitoring, logging, and tracing
- **Environments** - Environment management and configuration
- **Toolbox** - DevOps tools and utilities
- **Registry** - Container registry management
- **Alerts** - Intelligent alerting and notifications
- **AI Assistant** - ChatGPT-powered DevOps assistant
- **Auto Integration** - Complete automated DevOps setup with database and cloud providers
- **Settings** - Configuration and preferences
- **Billing** - Subscription and usage management

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend Integration**: RESTful APIs with comprehensive error handling
- **Database**: SQLite for local data storage and management
- **AI Integration**: OpenAI ChatGPT API for intelligent automation
- **Infrastructure as Code**: Terraform for automated provisioning
- **Cloud Providers**: AWS, Azure, Google Cloud Platform integration
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Hooks and Context API

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd my-devops
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Configure your environment**
Edit `.env` file:
```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api

# OpenAI API Key (Get from https://platform.openai.com/api-keys)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# AWS Credentials (Get from https://console.aws.amazon.com/iam/home)
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-west-2

# Azure Credentials (Get from Azure Portal)
AZURE_SUBSCRIPTION_ID=your_azure_subscription_id_here
AZURE_CLIENT_ID=your_azure_client_id_here
AZURE_CLIENT_SECRET=your_azure_client_secret_here
AZURE_TENANT_ID=your_azure_tenant_id_here

# GCP Credentials (Get from https://console.cloud.google.com)
GCP_PROJECT_ID=your_gcp_project_id_here
GCP_CREDENTIALS=path/to/your/service-account-key.json
GCP_REGION=us-central1

# Database Configuration
DATABASE_TYPE=sqlite
DATABASE_URL=./database/devops.db

# App Configuration
VITE_APP_NAME=DevOps Dashboard
VITE_APP_VERSION=1.0.0
```

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5173`

## 🔧 Configuration

### OpenAI API Setup
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an API key
3. Add it to your `.env` file as `VITE_OPENAI_API_KEY`
4. The AI Assistant will automatically use the key for intelligent features

### Cloud Provider Setup
1. **AWS**: Create IAM user with programmatic access
2. **Azure**: Register application in Azure AD
3. **GCP**: Create service account and download JSON key
4. Add credentials to your `.env` file
5. Use Auto Integration Hub for automated setup

### Database Setup
The dashboard automatically initializes SQLite database on first run:
- Projects, pipelines, and deployments data
- Integration configurations
- Audit logs and system metrics
- No manual setup required

### Backend API Integration
The dashboard connects to a backend API for:
- Project data management
- Pipeline execution and monitoring
- Metrics and analytics
- User authentication and settings
- Cloud provider integrations

## 🎯 Usage

### Getting Started
1. **Navigate to Dashboard** - Click "Start Free Trial" on landing page
2. **Configure AI Assistant** - Click AI Assistant tab and set up your OpenAI API key
3. **Set up Cloud Providers** - Configure AWS, Azure, and GCP credentials
4. **Use Auto Integration** - Click "Auto Integration" for complete automated setup
5. **Explore Features** - Use the sidebar to navigate between different sections
6. **Integrate Platforms** - Click tool icons in the sidebar to connect external platforms

### AI-Powered Features
- **Code Validation**: Click "AI Validation" button for automated code analysis
- **Pipeline Analysis**: Use AI Assistant to analyze pipeline failures
- **Security Audits**: Run comprehensive security scans with AI recommendations
- **Documentation**: Auto-generate technical documentation

### Auto Integration Features
- **Step-by-Step Setup**: 8-step automated DevOps environment setup
- **Database Initialization**: Automatic SQLite database setup
- **Terraform Generation**: Generate infrastructure as code automatically
- **Cloud Provider Connection**: Automated AWS, Azure, and GCP setup
- **CI/CD Pipeline**: Automated build, test, and deployment pipeline creation
- **Monitoring Setup**: Automated monitoring, logging, and alerting configuration
- **Import/Export**: Save and share integration configurations

### Platform Integrations
- **GitHub Sync**: Enter repository name to sync GitHub projects
- **Jenkins Integration**: Connect Jenkins for build pipeline monitoring
- **Cloud Integration**: Automatic connection to AWS, Azure, and GCP services
- **Tool Integration**: Click any tool icon in the sidebar to open the platform

## 🤖 AI Assistant Features

The ChatGPT-powered AI Assistant provides:

### Quick Actions
- **Validate Code** - Analyze code quality and security
- **Analyze Pipeline** - Debug pipeline failures and suggest fixes
- **Generate Infrastructure** - Auto-create Docker, K8s, and CI/CD configs
- **Security Audit** - Comprehensive vulnerability assessment
- **Optimize Performance** - AI-driven performance recommendations
- **Generate Docs** - Auto-create README and API documentation

### Chat Interface
- Natural language conversation about DevOps topics
- Context-aware assistance based on your current dashboard state
- Real-time AI responses with actionable recommendations

## 📊 API Integration

### Available Endpoints
- **Projects API** - CRUD operations, pipeline management
- **Metrics API** - DORA metrics, performance analytics
- **Pipelines API** - Execution, monitoring, logs
- **Failures API** - Tracking, resolution, analytics
- **Environments API** - Configuration and management
- **Auth API** - User authentication and profiles
- **Settings API** - Configuration and preferences

### Error Handling
- Comprehensive error handling with user-friendly messages
- Automatic retry mechanisms for failed requests
- Graceful degradation when services are unavailable

## 🎨 Customization

### Theming
The dashboard uses CSS custom properties for easy theming:
```css
:root {
  --primary: #FF3D00;
  --secondary: #03DAC6;
  --glass-border: rgba(255, 255, 255, 0.1);
  --text-muted: rgba(255, 255, 255, 0.6);
}
```

### Component Customization
- Modular component architecture
- Reusable UI components
- Configurable dashboard widgets
- Customizable metrics and KPIs

## 🔒 Security

### API Key Management
- Environment variable storage for API keys
- Secure transmission to backend services
- No client-side storage of sensitive credentials

### Data Protection
- HTTPS communication for all API calls
- Input validation and sanitization
- Secure error message handling

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Environment Variables for Production
Ensure all required environment variables are set in your production environment:
- `VITE_API_URL`
- `VITE_OPENAI_API_KEY`
- `VITE_APP_NAME`
- `VITE_APP_VERSION`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the AI Assistant in the dashboard for instant help
- Review the documentation in each section
- Create an issue in the repository for bugs or feature requests

## 🔄 Updates

The dashboard continuously improves with:
- Regular AI model updates
- New platform integrations
- Enhanced analytics and metrics
- Improved user experience and interface

---

**Built with ❤️ using React, Vite, and ChatGPT**
