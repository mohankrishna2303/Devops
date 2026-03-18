from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import subprocess
import os
import platform
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    Project, Deployment, DevOpsConfig, DORAMetrics, Organization, 
    Pipeline, Failure, K8sCluster, CloudIntegration, GitIntegration,
    DatabaseConnection, DiscoveredResource, CostRecommendation, TerraformRun, InfraResource, CIFailure
)
from .serializers import (
    ProjectSerializer, DeploymentSerializer, DevOpsConfigSerializer,
    OrganizationSerializer, CIFailureSerializer, DORAMetricsSerializer,
    PipelineSerializer, FailureSerializer, K8sClusterSerializer,
    CloudIntegrationSerializer, GitIntegrationSerializer,
    DatabaseConnectionSerializer, DiscoveredResourceSerializer,
    CostRecommendationSerializer, TerraformRunSerializer, InfraResourceSerializer
)
import json
import uuid
import random
from datetime import datetime, timedelta
from .ai_service import AIService

# Health Check
@api_view(['GET'])
@permission_classes([AllowAny])
def api_health(request):
    return Response({'status': 'healthy', 'message': 'DevOps API is running'})

# Authentication Views
class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email or ''
        )
        
        return Response({'message': 'User created successfully'})

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def profile(request):
    return Response({
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email
        }
    })

# Project ViewSet
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
        return Project.objects.filter(organization__owner=user)
    
    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
        org = Organization.objects.filter(owner=user).first()
        if not org:
            org = Organization.objects.create(name=f"{user.username}'s Org", owner=user)
        
        project = serializer.save(organization=org)
        
        # Auto-generate configs
        try:
            ai = AIService()
            configs = ai.generate_devops_configs(
                language=project.language or 'nodejs',
                framework=project.framework or 'express',
                provider=project.cloud_provider or 'aws'
            )
            DevOpsConfig.objects.create(
                project=project,
                dockerfile=configs.get('dockerfile', ''),
                kubernetes_yaml=configs.get('kubernetes', ''),
                terraform_config=configs.get('terraform', '')
            )
        except Exception as e:
            print(f"Failed to auto-generate configs: {str(e)}")

    @action(detail=True, methods=['post'])
    def generate_devops(self, request, pk=None):
        """Generate Dockerfile, K8s YAML, and Terraform configs"""
        project = self.get_object()
        
        try:
            ai = AIService()
            configs = ai.generate_devops_configs(
                language=project.language or 'nodejs',
                framework=project.framework or 'express',
                provider=project.cloud_provider or 'aws'
            )
            
            devops_config, created = DevOpsConfig.objects.get_or_create(project=project)
            devops_config.dockerfile = configs.get('dockerfile', '')
            devops_config.kubernetes_yaml = configs.get('kubernetes', '')
            devops_config.terraform_config = configs.get('terraform', '')
            devops_config.save()
            
            return Response(DevOpsConfigSerializer(devops_config).data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def deploy(self, request, pk=None):
        """Deploy project"""
        project = self.get_object()
        
        try:
            deployment = Deployment.objects.create(
                project=project,
                status='in_progress'
            )
            
            return Response(
                DeploymentSerializer(deployment).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Pipeline ViewSet
class PipelineViewSet(viewsets.ModelViewSet):
    serializer_class = PipelineSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
        return Pipeline.objects.filter(
            project__organization__owner=user
        ).order_by('-created_at')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Insert mock data if empty
        if not queryset.exists():
            user = self.request.user if self.request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
            org = Organization.objects.filter(owner=user).first()
            if org:
                project, _ = Project.objects.get_or_create(name='auth-service', organization=org, defaults={'repo_url': 'https://github.com/org/auth-service', 'language': 'nodejs'})
                Pipeline.objects.create(project=project, build_number='1045', status='success', branch='main', triggered_by='Alice')
                Pipeline.objects.create(project=project, build_number='1046', status='running', branch='feature/jwt-auth', triggered_by='Bob')
                Pipeline.objects.create(project=project, build_number='1047', status='failure', branch='hotfix/login-bug', triggered_by='Charlie')
            queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
        return Response({'pipeline': {}})

# Deployment ViewSet
class DeploymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DeploymentSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
        return Deployment.objects.filter(
            project__organization__owner=user
        ).order_by('-created_at')

# Organization ViewSet
class OrganizationViewSet(viewsets.ModelViewSet):
    serializer_class = OrganizationSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
        return Organization.objects.filter(owner=user)
    
    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
        serializer.save(owner=user)

# Failure ViewSet
class FailureViewSet(viewsets.ModelViewSet):
    serializer_class = FailureSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
        return Failure.objects.filter(
            pipeline__project__organization__owner=user
        ).order_by('-created_at')

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    # If not authenticated, use first user's data for demo
    user = request.user if request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
    pipelines = Pipeline.objects.filter(project__organization__owner=user)
    total_pipelines = pipelines.count()
    failures = pipelines.filter(status='failure').count()
    
    failure_rate = 0
    if total_pipelines > 0:
        failure_rate = round((failures / total_pipelines) * 100, 1)
        
    # Generate mock chart data based on real counts
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    chart_data = []
    for day in days:
        chart_data.append({
            'name': day,
            'success': random.randint(10, 50),
            'fail': random.randint(0, 15)
        })

    return Response({
        'total_pipelines': total_pipelines,
        'failure_rate': failure_rate,
        'avg_fix_time': '24m',
        'common_error': 'Dependency Conflict' if failures > 0 else 'None',
        'chart_data': chart_data,
        'common_errors': [
            {'type': 'Dependency Conflict', 'count': random.randint(5, 15), 'color': 'var(--primary)'},
            {'type': 'Timeout Error', 'count': random.randint(3, 10), 'color': '#FFB74D'},
            {'type': 'Linting Error', 'count': random.randint(2, 8), 'color': 'var(--secondary)'},
            {'type': 'Security Error', 'count': random.randint(1, 5), 'color': '#9C27B0'}
        ]
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def dora_metrics(request):
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    data = []
    for day in days:
        data.append({
            'name': day,
            'mttr': random.randint(15, 60),
            'deployment': random.randint(2, 10)
        })
        
    return Response({
        'deployment_frequency': 2.5,
        'lead_time_for_changes': 3.2,
        'mean_time_to_recovery': 1.8,
        'change_failure_rate': 0.15,
        'data': data
    })

# Export/Import Failures
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def export_failures_csv(request):
    if request.method == 'GET':
        # Export logic here
        return Response({'message': 'CSV export functionality'})
    else:
        # Import logic here
        return Response({'message': 'CSV import functionality'})

@api_view(['POST'])
@permission_classes([AllowAny])
def import_failures_csv(request):
    # Simulated validation logic
    try:
        data = request.data
        # In a real app, we'd parse request.FILES['file']
        # For this demo, we'll simulate processing some 'data' field
        return Response({
            'status': 'success',
            'message': 'Data imported and AI-validated successfully!',
            'validated_items': 12,
            'errors_corrected': 4,
            'suggestions': [
                'Updated Dockerfile for optimized caching',
                'Fixed 3 linting errors in main.py',
                'Security vulnerability in requirements.txt resolved'
            ]
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def resolve_failure(request, pk):
    user = request.user if request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
    try:
        try:
            failure = Failure.objects.get(pk=pk, pipeline__project__organization__owner=user)
            failure.is_resolved = True
            failure.save()
            return Response({'message': 'Failure resolved'})
        except Failure.DoesNotExist:
            failure = CIFailure.objects.get(pk=pk, project__organization__owner=user)
            failure.status = 'resolved'
            failure.save()
            return Response({'message': 'CIFailure resolved'})
    except (Failure.DoesNotExist, CIFailure.DoesNotExist):
        return Response({'error': 'Failure not found'}, status=404)

# GitHub Integration
@api_view(['POST'])
@permission_classes([AllowAny])
def github_webhook(request):
    data = request.data
    if 'workflow_run' in data:
        run = data['workflow_run']
        repo_full_name = data.get('repository', {}).get('full_name', '')
        
        try:
            project = Project.objects.filter(repo_name=repo_full_name).first()
            if project:
                pipeline = Pipeline.objects.create(
                    project=project,
                    build_number=str(run.get('run_number')),
                    status=run.get('conclusion', run.get('status')),
                    branch=run.get('head_branch', 'main'),
                    triggered_by=run.get('actor', {}).get('login', 'github')
                )
                
                if pipeline.status == 'failure':
                    Failure.objects.create(
                        pipeline=pipeline,
                        error_type="Workflow Failure",
                        error_message=f"GitHub Actions run {pipeline.build_number} failed",
                        severity="high"
                    )
                
                return Response({'message': 'Sync successful', 'pipeline_id': pipeline.id})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
            
    return Response({'message': 'GitHub webhook received'})

# First (stub) get_terraform_data removed – see line ~387 for the real one


@api_view(['POST'])
@permission_classes([AllowAny])
def apply_terraform_plan(request):
    return Response({'message': 'Terraform plan applied'})

# Jenkins Integration
@api_view(['POST'])
@permission_classes([AllowAny])
def sync_jenkins_job(request):
    job_name = request.data.get('job_name', 'unknown-job')
    return Response({
        'status': 'success',
        'message': f'Jenkins job "{job_name}" synced successfully',
        'new_runs': [
            {'id': 1001, 'status': 'success', 'duration': '4m 12s'},
            {'id': 1002, 'status': 'failure', 'duration': '1m 05s'}
        ]
    })

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def sync_github_runs(request):
    repo_name = request.data.get('repo_name', 'unknown/repo')
    return Response({
        'status': 'success',
        'message': f'GitHub Actions for "{repo_name}" synced successfully',
        'synced_repos': [repo_name, 'aether-backend']
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_terraform_data(request):
    user = request.user if request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
    org = Organization.objects.filter(owner=user).first()
    runs = TerraformRun.objects.filter(org=org)
    
    if not runs.exists():
        # Create some demo runs
        TerraformRun.objects.create(org=org, plan_name='Prod Infrastructure', status='Applied', version='1.5.0', provider='AWS')
        TerraformRun.objects.create(org=org, plan_name='Staging VPC', status='Applied', version='1.4.2', provider='AWS')
        runs = TerraformRun.objects.filter(org=org)
        
    return Response(TerraformRunSerializer(runs, many=True).data)

# Kubernetes Integration
@api_view(['GET'])
@permission_classes([AllowAny])
def get_k8s_fleet(request):
    user = request.user if request.user.is_authenticated else User.objects.filter(username='admin').first() or User.objects.first()
    org = Organization.objects.filter(owner=user).first()
    clusters = K8sCluster.objects.filter(org=org)
    if not clusters.exists():
        # Create some demo clusters if none exist
        K8sCluster.objects.get_or_create(
            org=org, name='Prod-EKS-01', region='us-east-1', 
            nodes=12, pods=145, workload_count=24, namespace_count=8,
            cpu_usage=45, mem_usage=62, status='Running', provider='EKS'
        )
        K8sCluster.objects.get_or_create(
            org=org, name='Staging-GKE-01', region='europe-west1', 
            nodes=3, pods=42, workload_count=12, namespace_count=5,
            cpu_usage=12, mem_usage=28, status='Running', provider='GKE'
        )
        clusters = K8sCluster.objects.filter(org=org)
    return Response(K8sClusterSerializer(clusters, many=True).data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_k8s_namespaces(request):
    # In a real app, this would query the specific cluster
    return Response([{'name': 'default'}, {'name': 'kube-system'}, {'name': 'production'}])

@api_view(['GET'])
@permission_classes([AllowAny])
def get_k8s_workloads(request):
    return Response([
        {'id': 1, 'name': 'api-gateway', 'kind': 'Deployment', 'namespace': 'default', 'image': 'nginx:1.24', 'replicas': 3, 'ready_replicas': 3, 'status': 'Running', 'cpu_request': '500m', 'mem_request': '1Gi'},
        {'id': 2, 'name': 'auth-service', 'kind': 'Deployment', 'namespace': 'default', 'image': 'node:18', 'replicas': 2, 'ready_replicas': 2, 'status': 'Running', 'cpu_request': '250m', 'mem_request': '512Mi'},
        {'id': 3, 'name': 'payment-worker', 'kind': 'Deployment', 'namespace': 'production', 'image': 'python:3.11', 'replicas': 5, 'ready_replicas': 4, 'status': 'Pending', 'cpu_request': '1000m', 'mem_request': '2Gi'}
    ])

@api_view(['GET'])
@permission_classes([AllowAny])
def get_k8s_pods(request):
    return Response([
        {'id': 1, 'name': 'api-gateway-7f8d9b-abc', 'namespace': 'default', 'node': 'worker-1', 'workload': 'api-gateway', 'status': 'Running', 'restarts': 0, 'cpu_usage': '24m', 'mem_usage': '128Mi'},
        {'id': 2, 'name': 'api-gateway-7f8d9b-def', 'namespace': 'default', 'node': 'worker-2', 'workload': 'api-gateway', 'status': 'Running', 'restarts': 1, 'cpu_usage': '32m', 'mem_usage': '132Mi'},
        {'id': 3, 'name': 'auth-service-5d4c3b-xyz', 'namespace': 'default', 'node': 'worker-1', 'workload': 'auth-service', 'status': 'Running', 'restarts': 0, 'cpu_usage': '12m', 'mem_usage': '64Mi'}
    ])

@api_view(['GET'])
@permission_classes([AllowAny])
def get_k8s_events(request):
    return Response([
        {'type': 'Normal', 'reason': 'Scheduled', 'object': 'Pod/api-gateway-7f8d9b-abc', 'message': 'Successfully assigned default/api-gateway-7f8d9b-abc to worker-1', 'age': '12m'},
        {'type': 'Warning', 'reason': 'FailedScheduling', 'object': 'Pod/payment-worker-9a8b7c-123', 'message': '0/3 nodes are available: 3 Insufficient cpu.', 'age': '2m'},
        {'type': 'Normal', 'reason': 'Started', 'object': 'Pod/auth-service-5d4c3b-xyz', 'message': 'Started container auth-service', 'age': '45m'}
    ])

@api_view(['GET'])
@permission_classes([AllowAny])
def get_k8s_pod_logs(request, pod_id):
    return Response({'logs': f'Logs for pod {pod_id}'})

@api_view(['POST'])
@permission_classes([AllowAny])
def scale_k8s_workload(request):
    return Response({'message': 'Workload scaled'})

@api_view(['POST'])
@permission_classes([AllowAny])
def deploy_k8s_workload(request):
    return Response({'message': 'Workload deployed'})

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_k8s_workload(request, workload_id):
    return Response({'message': 'Workload deleted'})

@api_view(['POST'])
@permission_classes([AllowAny])
def apply_k8s_yaml(request):
    return Response({'message': 'K8s YAML applied'})


# Observability
@api_view(['GET'])
@permission_classes([AllowAny])
def get_observability_telemetry(request):
    return Response({
        'metrics': {'cpu': 45, 'memory': 60, 'disk': 30},
        'logs': [],
        'traces': []
    })

# Integrations
@api_view(['GET'])
@permission_classes([AllowAny])
def get_integrations(request):
    return Response({
        'integrations': [
            {'name': 'GitHub', 'status': 'connected'},
            {'name': 'Jenkins', 'status': 'disconnected'},
            {'name': 'Docker', 'status': 'connected'}
        ]
    })

# Database
@api_view(['GET'])
@permission_classes([AllowAny])
def get_databases(request):
    return Response([
        {'id': 1, 'name': 'Prod-PostgreSQL', 'engine': 'PostgreSQL 15', 'host': 'db.prod.internal', 'status': 'Online'},
        {'id': 2, 'name': 'Staging-Redis', 'engine': 'Redis 7.0', 'host': 'redis.staging.internal', 'status': 'Online'},
        {'id': 3, 'name': 'Analytics-MongoDB', 'engine': 'MongoDB 6.0', 'host': 'mongo.analytics.internal', 'status': 'Maintenance'}
    ])

@api_view(['POST'])
@permission_classes([AllowAny])
def connect_local_db(request):
    return Response({'message': 'Local database connected successfully'})

# Cloud Resources
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def scan_cloud_resources(request):
    return Response({
        'discovered': 4,
        'scanned_regions': ['us-east-1', 'eu-west-1'],
        'status': 'success',
        'data': { 'discovered': 4 }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_untracked_resources(request):
    return Response([
        {'id': 1, 'name': 'temp-test-instance', 'type': 'EC2 Instance', 'provider': 'AWS'},
        {'id': 2, 'name': 'unused-volume-01', 'type': 'EBS Volume', 'provider': 'AWS'},
        {'id': 3, 'name': 'old-demo-bucket', 'type': 'S3 Bucket', 'provider': 'AWS'},
        {'id': 4, 'name': 'dev-snapshot-final', 'type': 'RDS Snapshot', 'provider': 'AWS'}
    ])

# Cost Management
@api_view(['GET'])
@permission_classes([AllowAny])
def get_cost_recommendations(request):
    return Response({'recommendations': []})

@api_view(['POST'])
@permission_classes([AllowAny])
def apply_cost_recommendation(request, pk):
    return Response({'message': 'Cost recommendation applied'})

# AI Integration
@api_view(['POST'])
@permission_classes([AllowAny])
def get_ai_patch(request, pk):
    return Response({'patch': 'AI-generated patch'})

@api_view(['POST'])
@permission_classes([AllowAny])
def run_devops_stress(request):
    return Response({'message': 'Stress test initiated'})

@api_view(['POST'])
@permission_classes([AllowAny])
def run_security_audit(request):
    return Response({
        'status': 'success',
        'score': 88,
        'findings': [
            {'severity': 'High', 'issue': 'S3 Bucket with public access', 'fix': 'Enable block public access'},
            {'severity': 'Medium', 'issue': 'Outdated Django version', 'fix': 'Update to 6.0.2'},
            {'severity': 'Low', 'issue': 'Unused IAM roles', 'fix': 'Delete idle roles'}
        ],
        'report_url': '/api/analytics/report/'
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_config(request):
    return Response({'message': 'Configuration generated'})

@api_view(['POST'])
@permission_classes([AllowAny])
def deploy_project(request):
    return Response({'message': 'Project deployed'})

# Terraform Scaling
@api_view(['POST'])
@permission_classes([AllowAny])
def scale_terraform(request):
    return Response({'message': 'Terraform resources scaled'})

@api_view(['POST'])
@permission_classes([AllowAny])
def destroy_terraform(request):
    return Response({'message': 'Terraform resources destroyed successfully'})

# Report Generation
@api_view(['GET'])
@permission_classes([AllowAny])
def generate_report(request):
    return Response({'report': 'Generated report'})

# Terminal Execution
@api_view(['POST'])
@permission_classes([AllowAny])
def terminal_execute(request):
    command = request.data.get('command', '').strip()
    cwd = request.data.get('cwd', os.getcwd())
    
    if not command:
        return Response({'error': 'Command is required'}, status=400)
    
    # Handle 'cd' command
    if command.startswith('cd '):
        target_dir = command[3:].strip()
        new_path = os.path.abspath(os.path.join(cwd, target_dir))
        if os.path.isdir(new_path):
            return Response({
                'stdout': f'Changed directory to {new_path}\n',
                'stderr': '',
                'exit_code': 0,
                'cwd': new_path
            })
        else:
            return Response({
                'stdout': '',
                'stderr': f'The system cannot find the path specified: {target_dir}\n',
                'exit_code': 1,
                'cwd': cwd
            })

    try:
        process = subprocess.Popen(
            command,
            cwd=cwd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate(timeout=30)
        
        return Response({
            'stdout': stdout,
            'stderr': stderr,
            'exit_code': process.returncode,
            'cwd': cwd
        })
    except subprocess.TimeoutExpired:
        process.kill()
        return Response({'error': 'Command timed out'}, status=408)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# File Management
@api_view(['GET'])
@permission_classes([AllowAny])
def file_read(request):
    file_path = request.query_params.get('path')
    if not file_path:
        return Response({'error': 'Path is required'}, status=400)
    
    # Security check: only allow reading from the project directory
    project_root = "D:\\devops"
    
    abs_path = os.path.abspath(os.path.join(project_root, file_path))
    
    if not abs_path.startswith(project_root):
        return Response({'error': 'Access denied'}, status=403)
    
    if not os.path.exists(abs_path):
        return Response({'error': 'File not found'}, status=404)
    
    try:
        with open(abs_path, 'r') as f:
            content = f.read()
        return Response({'content': content, 'path': file_path})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_splunk_logs(request):
    """Mock Splunk Logs"""
    logs = [
        { 'id': 1, 'timestamp': '2026-03-07 16:10:45', 'level': 'ERROR', 'service': 'auth-service', 'message': 'Failed password attempt for user admin', 'source': '/var/log/auth.log' },
        { 'id': 2, 'timestamp': '2026-03-07 16:11:02', 'level': 'INFO', 'service': 'k8s-cluster', 'message': 'Pod payment-gateway-55f8 scaled to 5 replicas', 'source': 'kube-audit' },
        { 'id': 3, 'timestamp': '2026-03-07 16:12:15', 'level': 'WARNING', 'service': 'db-proxy', 'message': 'Connection pool reaching 85% capacity', 'source': '/var/log/mysql/slow.log' },
        { 'id': 4, 'timestamp': '2026-03-07 16:13:00', 'level': 'INFO', 'service': 'frontend', 'message': '200 OK /dashboard - user_id=4521', 'source': 'nginx-access' },
        { 'id': 5, 'timestamp': '2026-03-07 16:14:22', 'level': 'ERROR', 'service': 'payment-gateway', 'message': 'Connection timeout to external provider Stripe', 'source': 'application-trace' },
    ]
    return Response({'logs': logs})

@api_view(['GET'])
@permission_classes([AllowAny])
def get_registry_images(request):
    """Mock Registry Images"""
    images = [
        { 'name': 'braindevops-backend', 'tag': 'v1.4.2', 'size': '245MB', 'status': 'Scanned', 'vulnerabilities': 0, 'pulled': '12m ago' },
        { 'name': 'braindevops-frontend', 'tag': 'v1.4.1', 'size': '182MB', 'status': 'Scanned', 'vulnerabilities': 0, 'pulled': '45m ago' },
        { 'name': 'api-gateway-service', 'tag': 'latest', 'size': '120MB', 'status': 'Warning', 'vulnerabilities': 2, 'pulled': '2h ago' },
        { 'name': 'postgres-custom-db', 'tag': '15-alpine', 'size': '89MB', 'status': 'Scanned', 'vulnerabilities': 0, 'pulled': '1d ago' },
    ]
    return Response({'images': images})

@api_view(['GET'])
@permission_classes([AllowAny])
def get_alerts(request):
    """Mock System Alerts"""
    alerts = [
        { 'id': 1, 'type': 'error', 'title': 'Deployment Failed', 'message': 'Production deployment for aether-api failed due to timeout.', 'time': '2m ago', 'service': 'Jenkins' },
        { 'id': 2, 'type': 'warning', 'title': 'High CPU Usage', 'message': 'EKS Node Group "dev-nodes" is at 88% CPU capacity.', 'time': '15m ago', 'service': 'EKS' },
        { 'id': 3, 'type': 'info', 'title': 'Terraform Applied', 'message': 'Infrastructure changes applied successfully to us-east-1.', 'time': '1h ago', 'service': 'Terraform' },
        { 'id': 4, 'type': 'security', 'title': 'Vulnerability Detected', 'message': 'Critical CVE found in package "requests" in project core-app.', 'time': '3h ago', 'service': 'Snyk' },
    ]
    return Response({'alerts': alerts})

@api_view(['GET'])
@permission_classes([AllowAny])
def get_security_stats(request):
    """Mock Security Stats"""
    return Response({
        'score': 85,
        'vulnerabilities': {
            'critical': 0,
            'high': 2,
            'medium': 5,
            'low': 12
        },
        'scans': [
            {'name': 'SAST Scan', 'status': 'Passed', 'date': '2026-03-07'},
            {'name': 'Dependency Scan', 'status': 'Warning', 'date': '2026-03-07'},
            {'name': 'Container Scan', 'status': 'Passed', 'date': '2026-03-06'},
            {'name': 'Secret Detection', 'status': 'Passed', 'date': '2026-03-07'}
        ]
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def ai_chat(request):
    """AI Chat Proxy"""
    message = request.data.get('message', '')
    if not message:
        return Response({'error': 'Message is required'}, status=400)
    
    try:
        ai = AIService()
        response = ai.chat(message)
        return Response({'response': response})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# New API endpoints for additional DevOps modules

@api_view(['GET'])
@permission_classes([AllowAny])
def get_environments(request):
    """Get deployment environments"""
    environments = [
        {
            'id': 1,
            'name': 'Development',
            'type': 'development',
            'status': 'active',
            'url': 'dev.example.com',
            'lastDeployed': '2 hours ago',
            'deployedBy': 'Alice',
            'version': 'v2.1.0-dev',
            'services': 8,
            'health': 'healthy',
            'resources': {'cpu': '45%', 'memory': '60%', 'storage': '30%'}
        },
        {
            'id': 2,
            'name': 'Testing',
            'type': 'testing',
            'status': 'active',
            'url': 'test.example.com',
            'lastDeployed': '6 hours ago',
            'deployedBy': 'Bob',
            'version': 'v2.0.5',
            'services': 6,
            'health': 'healthy',
            'resources': {'cpu': '35%', 'memory': '45%', 'storage': '25%'}
        },
        {
            'id': 3,
            'name': 'Staging',
            'type': 'staging',
            'status': 'active',
            'url': 'staging.example.com',
            'lastDeployed': '1 day ago',
            'deployedBy': 'Charlie',
            'version': 'v2.0.4',
            'services': 7,
            'health': 'warning',
            'resources': {'cpu': '78%', 'memory': '82%', 'storage': '45%'}
        },
        {
            'id': 4,
            'name': 'Production',
            'type': 'production',
            'status': 'active',
            'url': 'app.example.com',
            'lastDeployed': '3 days ago',
            'deployedBy': 'David',
            'version': 'v2.0.3',
            'services': 12,
            'health': 'healthy',
            'resources': {'cpu': '65%', 'memory': '70%', 'storage': '55%'}
        }
    ]
    return Response({'environments': environments})

@api_view(['GET'])
@permission_classes([AllowAny])
def get_registry_details(request):
    """Get container registry details"""
    images = [
        {
            'id': 1,
            'name': 'web-app',
            'tags': ['v2.1.0', 'v2.0.3', 'latest'],
            'size': '245 MB',
            'lastModified': '2 hours ago',
            'downloads': 1234,
            'status': 'active',
            'layers': 8,
            'vulnerabilities': {'critical': 0, 'high': 1, 'medium': 3, 'low': 7}
        },
        {
            'id': 2,
            'name': 'api-server',
            'tags': ['v1.8.2', 'v1.8.1', 'latest'],
            'size': '189 MB',
            'lastModified': '6 hours ago',
            'downloads': 892,
            'status': 'active',
            'layers': 6,
            'vulnerabilities': {'critical': 0, 'high': 0, 'medium': 1, 'low': 2}
        },
        {
            'id': 3,
            'name': 'database-migrator',
            'tags': ['v1.2.0', 'latest'],
            'size': '156 MB',
            'lastModified': '1 day ago',
            'downloads': 456,
            'status': 'active',
            'layers': 5,
            'vulnerabilities': {'critical': 0, 'high': 0, 'medium': 0, 'low': 1}
        }
    ]
    return Response({'images': images})

@api_view(['GET'])
@permission_classes([AllowAny])
def get_analytics_data(request):
    """Get analytics and DORA metrics"""
    return Response({
        'metrics': [
            {
                'title': 'Deployment Frequency',
                'value': '12.5',
                'unit': 'per week',
                'change': 15.2,
                'trend': 'up'
            },
            {
                'title': 'Lead Time for Changes',
                'value': '2.4',
                'unit': 'hours',
                'change': -8.5,
                'trend': 'down'
            },
            {
                'title': 'Change Failure Rate',
                'value': '3.2',
                'unit': '%',
                'change': -2.1,
                'trend': 'down'
            },
            {
                'title': 'Mean Time to Recovery',
                'value': '45',
                'unit': 'minutes',
                'change': -12.3,
                'trend': 'down'
            }
        ],
        'deploymentData': [
            {'date': '2024-01-08', 'successful': 8, 'failed': 1, 'total': 9},
            {'date': '2024-01-09', 'successful': 12, 'failed': 2, 'total': 14},
            {'date': '2024-01-10', 'successful': 10, 'failed': 0, 'total': 10},
            {'date': '2024-01-11', 'successful': 15, 'failed': 3, 'total': 18},
            {'date': '2024-01-12', 'successful': 9, 'failed': 1, 'total': 10},
            {'date': '2024-01-13', 'successful': 14, 'failed': 2, 'total': 16},
            {'date': '2024-01-14', 'successful': 11, 'failed': 1, 'total': 12}
        ]
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_devops_roles(request):
    """Get DevOps roles and users"""
    roles = [
        {
            'id': 1,
            'name': 'Admin',
            'description': 'Full system access and configuration',
            'permissions': ['read', 'write', 'delete', 'manage_users', 'manage_integrations', 'deploy'],
            'userCount': 2
        },
        {
            'id': 2,
            'name': 'DevOps Engineer',
            'description': 'Manage infrastructure and deployments',
            'permissions': ['read', 'write', 'deploy', 'manage_infrastructure'],
            'userCount': 5
        },
        {
            'id': 3,
            'name': 'Developer',
            'description': 'Deploy and monitor applications',
            'permissions': ['read', 'write', 'deploy'],
            'userCount': 12
        },
        {
            'id': 4,
            'name': 'Viewer',
            'description': 'Read-only access to dashboards',
            'permissions': ['read'],
            'userCount': 8
        }
    ]
    
    users = [
        {
            'id': 1,
            'name': 'Alice Johnson',
            'email': 'alice@company.com',
            'role': 'Admin',
            'status': 'active',
            'lastLogin': '2 hours ago',
            'avatar': 'AJ'
        },
        {
            'id': 2,
            'name': 'Bob Smith',
            'email': 'bob@company.com',
            'role': 'DevOps Engineer',
            'status': 'active',
            'lastLogin': '1 day ago',
            'avatar': 'BS'
        },
        {
            'id': 3,
            'name': 'Charlie Brown',
            'email': 'charlie@company.com',
            'role': 'Developer',
            'status': 'active',
            'lastLogin': '3 hours ago',
            'avatar': 'CB'
        }
    ]
    
    return Response({'roles': roles, 'users': users})

@api_view(['POST'])
@permission_classes([AllowAny])
def update_settings(request):
    """Update platform settings"""
    category = request.data.get('category')
    settings = request.data.get('settings', {})
    
    # Here you would typically save to database
    # For now, just return success
    return Response({
        'message': f'Settings updated successfully for {category}',
        'saved_settings': settings
    })
