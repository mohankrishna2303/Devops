from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        self.client = None
        if self.api_key and self.api_key != "your_real_key_here" and len(self.api_key) > 10:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                print(f"Failed to initialize OpenAI client: {e}")
                self.client = None
    
    def generate_devops_configs(self, language, framework, provider):
        """Generate Dockerfile, K8s YAML, and Terraform using OpenAI"""
        if not self.client or not self.api_key or self.api_key == "YOUR_OPENAI_API_KEY" or self.api_key == "your_real_key_here":
            print("[WARNING] OpenAI client not ready or key missing. Using default templates.")
            return self._default_configs(language, framework, provider)
            
        prompt = f"""
        Generate production-ready DevOps configurations for:
        - Language: {language}
        - Framework: {framework}
        - Cloud Provider: {provider}
        
        Return ONLY valid JSON with three keys: 'dockerfile', 'kubernetes', 'terraform'
        Each should contain the complete, production-ready configuration.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                timeout=10
            )
            configs = json.loads(response.choices[0].message.content)
            return configs
        except Exception as e:
            print(f"[ERROR] AI Generation failed: {e}. Falling back to defaults.")
            return self._default_configs(language, framework, provider)
    
    def analyze_failure(self, failure_log):
        """Analyze CI/CD failure logs and provide insights"""
        if not self.client or not self.api_key or self.api_key == "YOUR_OPENAI_API_KEY" or self.api_key == "your_real_key_here":
            return "Analysis unavailable: OpenAI API key missing or invalid. Please check your .env file."
        
        prompt = f"""
        Analyze this CI/CD failure log and provide:
        1. Root cause
        2. Affected services
        3. Recommended fixes
        4. Prevention strategy
        
        Log:
        {failure_log}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                timeout=10
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"AI Analysis failed: {str(e)}"

    def chat(self, message):
        """General DevOps chat — uses OpenAI if available, smart fallback otherwise."""
        if self.client and self.api_key and self.api_key not in ("YOUR_OPENAI_API_KEY", "your_real_key_here"):
            try:
                response = self.client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a senior DevOps engineer with deep expertise in Kubernetes, Terraform, Jenkins, Docker, AWS, and site reliability."},
                        {"role": "user", "content": message}
                    ],
                    max_tokens=800,
                    temperature=0.6,
                    timeout=15,
                )
                return response.choices[0].message.content
            except Exception:
                return self._smart_fallback(message)
        return self._smart_fallback(message)

    def _smart_fallback(self, message):
        """Keyword-based smart DevOps responses when no OpenAI key is configured."""
        m = message.lower()
        if any(k in m for k in ["pipeline", "jenkins", "failed", "build", "ci"]):
            return ("Pipeline Failure Analysis\n\nCommon causes:\n1. Dependency conflicts\n2. Test failures\n3. Timeout issues\n\nQuick fix: Add retry(2) around the failing stage to handle transient errors.")
        if any(k in m for k in ["kubernetes", "k8s", "pod", "kubectl", "crashloop"]):
            return ("Kubernetes Troubleshooting\n\n1. kubectl describe pod <name>\n2. kubectl logs <name> --previous\n3. CrashLoopBackOff: check env vars\n4. OOMKilled: increase memory limit\n5. Pending: scale node group")
        if any(k in m for k in ["terraform", "infra", "provision"]):
            return ("Terraform Best Practices\n\n1. Always run terraform plan before apply\n2. Use remote S3 state for teams\n3. Pin provider versions\n4. Use terraform validate in CI/CD")
        if any(k in m for k in ["docker", "container", "image", "dockerfile"]):
            return ("Docker Optimization Tips\n\n1. Use multi-stage builds\n2. Add .dockerignore\n3. Never run as root\n4. Scan with docker scout cves <image>\n5. Use Alpine base images")
        if any(k in m for k in ["security", "cve", "vulnerable", "secret", "audit"]):
            return ("Security Hardening Checklist\n\n1. Run npm audit fix / pip-audit\n2. Use env vars for secrets\n3. Enable MFA for all IAM users\n4. Scan containers with trivy image <name>\n5. Use RBAC in Kubernetes")
        return ("I can help with: Pipeline failures, Kubernetes issues, Terraform, Docker, and Security. Ask something specific for detailed guidance!")
    
    def _default_configs(self, language, framework, provider):
        """Return sensible defaults if AI generation fails"""
        
        dockerfiles = {
            'python-django': '''FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]''',
            'nodejs-express': '''FROM node:18-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]''',
            'java-spring': '''# Build stage
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]''',
        }
        
        key = f"{language}-{framework}"
        dockerfile = dockerfiles.get(key, 'FROM alpine:latest\nRUN echo "Custom Dockerfile"')
        
        return {
            'dockerfile': dockerfile,
            'kubernetes': self._get_k8s_yaml(provider),
            'terraform': self._get_terraform_config(provider),
        }
    
    def _get_k8s_yaml(self, provider):
        return '''apiVersion: apps/v1
kind: Deployment
metadata:
  name: devops-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: devops-app
  template:
    metadata:
      labels:
        app: devops-app
    spec:
      containers:
      - name: devops-app
        image: devops-app:latest
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: devops-app-service
spec:
  selector:
    app: devops-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer'''
    
    def _get_terraform_config(self, provider):
        if provider == 'aws':
            return '''terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_eks_cluster" "devops" {
  name            = "devops-cluster"
  version         = "1.27"
  role_arn        = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = var.subnet_ids
  }
}

resource "aws_eks_node_group" "devops" {
  cluster_name    = aws_eks_cluster.devops.name
  node_group_name = "devops-nodes"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = var.subnet_ids
  scaling_config {
    desired_size = 3
    max_size     = 5
    min_size     = 1
  }
}'''
        return '# Terraform config for ' + provider