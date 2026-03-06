from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
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
            print(f"Failed to auto-generate configs: {e}")

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

@api_view(['POST'])
@permission_classes([AllowAny])
def sync_github_runs(request):
    return Response({'message': 'GitHub sync initiated'})

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
