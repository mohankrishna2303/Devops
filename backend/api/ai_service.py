from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        self.client = OpenAI(api_key=self.api_key)
    
    def generate_devops_configs(self, language, framework, provider):
        """Generate Dockerfile, K8s YAML, and Terraform using OpenAI"""
        
        prompt = f"""
        Generate production-ready DevOps configurations for:
        - Language: {language}
        - Framework: {framework}
        - Cloud Provider: {provider}
        
        Return ONLY valid JSON with three keys: 'dockerfile', 'kubernetes', 'terraform'
        Each should contain the complete, production-ready configuration.
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        
        try:
            configs = json.loads(response.choices[0].message.content)
            return configs
        except json.JSONDecodeError:
            return self._default_configs(language, framework, provider)
    
    def analyze_failure(self, failure_log):
        """Analyze CI/CD failure logs and provide insights"""
        
        prompt = f"""
        Analyze this CI/CD failure log and provide:
        1. Root cause
        2. Affected services
        3. Recommended fixes
        4. Prevention strategy
        
        Log:
        {failure_log}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
        )
        
        return response.choices[0].message.content
    
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