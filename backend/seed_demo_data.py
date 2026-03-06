import os
import django
import random
import uuid
from datetime import datetime, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import (
    Organization, Project, Pipeline, Failure, FailureCluster,
    TerraformRun, InfraResource, K8sCluster, CloudIntegration,
    GitIntegration, DatabaseConnection, DiscoveredResource,
    CostRecommendation
)

def seed_data():
    print("Starting INVESTOR-READY Demo Data Population...")
    
    # 1. Clear existing demo data
    print("Cleaning up old demo data...")
    User.objects.filter(username='admin').delete()
    Organization.objects.filter(name='Aether DevOps Inc.').delete()
    
    # 2. Setup User & Organization
    user = User.objects.create_superuser('admin', 'admin@aether.ai', 'admin123')
    org = Organization.objects.create(
        name='Aether DevOps Inc.',
        owner=user,
        plan='Enterprise PRO'
    )
    print(f"Created Org: {org.name}")

    # 3. Create Cloud & Git Integrations
    CloudIntegration.objects.create(org=org, provider='AWS', account_id='987654321012', region='us-east-1', status='Connected')
    CloudIntegration.objects.create(org=org, provider='Azure', account_id='sub-882-def-001', region='West US 2', status='Syncing')
    GitIntegration.objects.create(org=org, provider='GitHub', username='aether-ops-team', status='Active')
    print("Created Cloud & Git Integrations")

    # 4. Create Databases
    DatabaseConnection.objects.create(org=org, name='Primary RDS (Postgres)', engine='Postgres', host='db.prod.aether.ai', port=5432, status='Online')
    DatabaseConnection.objects.create(org=org, name='Cache Layer (Redis)', engine='Local', host='localhost', port=6379, status='Online', is_local=True)
    DatabaseConnection.objects.create(org=org, name='Log Analytics DB', engine='MySQL', host='logs.us-west.cloud', port=3306, status='Maintenance')
    print("Created Database Connections")

    # 5. Create K8s Clusters
    K8sCluster.objects.create(org=org, name='Prod-EKS-Cluster-01', region='us-east-1', nodes=12, pods=145, health_score=98, status='Healthy', workload_count=15, namespace_count=5, cpu_usage=45, mem_usage=60)
    K8sCluster.objects.create(org=org, name='Staging-AKS-Node', region='West US 2', nodes=3, pods=42, health_score=85, status='Updating', workload_count=4, namespace_count=2, cpu_usage=20, mem_usage=30)
    print("Created K8s Clusters")

    # 6. Create Projects & Pipelines
    project_configs = [
        {'name': 'aether-frontend-micro', 'lang': 'React', 'branches': ['main', 'develop', 'release/v1.2']},
        {'name': 'core-auth-service', 'lang': 'Go', 'branches': ['main', 'fix/security-patch']},
        {'name': 'ai-inference-engine', 'lang': 'Python', 'branches': ['master', 'research/v3.0']},
        {'name': 'infrastructure-iac', 'lang': 'Terraform', 'branches': ['main']},
    ]

    error_library = [
        ('DependencyConflict', "Version mismatch in 'requests' library. Found 2.25, expected 2.31"),
        ('MockTimeout', "External API 'stripe-api-mock' timed out after 5000ms"),
        ('LintFailure', "ESLint error: 'useState' is defined but never used in Projects.jsx:42"),
        ('DatabaseRefused', "Could not connect to PostgreSQL at db.prod:5432. Connection refused."),
    ]

    users = ['Dave (Lead)', 'Sarah (Architect)', 'Alex (DevOps)', 'GitHub Bot']

    for p_cfg in project_configs:
        proj = Project.objects.create(organization=org, repo_name=p_cfg['name'], provider='GitHub', name=p_cfg['name'], language=p_cfg['lang'])
        
        # Create 20 runs per project
        for i in range(20):
            status = random.choices(['success', 'failure'], weights=[75, 25])[0]
            days_ago = random.randint(0, 30)
            created_at = datetime.now() - timedelta(days=days_ago)
            
            pipe = Pipeline.objects.create(
                project=proj,
                build_number=f"B-{random.randint(4000, 9999)}",
                status=status,
                branch=random.choice(p_cfg['branches']),
                triggered_by=random.choice(users),
                created_at=created_at
            )

            if status == 'failure':
                err_type, msg = random.choice(error_library)
                Failure.objects.create(
                    pipeline=pipe,
                    error_type=err_type,
                    error_message=msg,
                    severity=random.choice(['High', 'Medium', 'Low']),
                    ai_explanation=f"AI identified a {err_type} affecting the {p_cfg['name']} pipeline. This pattern correlates with recent updates to the provider configuration.",
                    suggested_fix=f"Revert the last dependency version bump and verify the environment variable '{err_type.upper()}_ENDPOINT' is correctly set.",
                    is_resolved=random.choice([True, False])
                )
    print("Successfully seeded Projects & Pipeline History")

    # 7. Create Terraform Runs
    tf_run = TerraformRun.objects.create(org=org, plan_name='Prod-VPC-Networking', status='Applied', version='1.5.7', provider='AWS')
    InfraResource.objects.create(run=tf_run, resource_type='aws_vpc', name='main-vpc', provider_id='vpc-0a1b2c3d', status='Healthy')
    InfraResource.objects.create(run=tf_run, resource_type='aws_subnet', name='public-a', provider_id='subnet-112233', status='Healthy')
    
    TerraformRun.objects.create(org=org, plan_name='Core-DB-Cluster', status='Failed', version='1.5.7', provider='AWS')
    print("Created Terraform History")

    # 8. Create Discovered Resources (Shadow IT)
    DiscoveredResource.objects.create(org=org, provider='AWS', resource_type='S3 Bucket', name='legacy-backup-dump', location='us-west-2', is_managed=False)
    DiscoveredResource.objects.create(org=org, provider='Azure', resource_type='Virtual Machine', name='temp-test-vm-04', location='East US', is_managed=False)
    DiscoveredResource.objects.create(org=org, provider='GCP', resource_type='Cloud Run', name='experimental-api-v1', location='europe-west1', is_managed=False)
    print("Created Untracked Resource Discovery data")

    # 9. Create Cost Recommendations
    CostRecommendation.objects.create(org=org, title='Idle RDS Instance', description='The instance "staging-mysql" has had 0 connections in 14 days. Suggest Deletion.', potential_savings=145.50, severity='High')
    CostRecommendation.objects.create(org=org, title='Unattached EBS Volumes', description='Found 12 unattached volumes in us-east-1. Suggest deletion or snapshot.', potential_savings=42.00, severity='Medium')
    CostRecommendation.objects.create(org=org, title='Rightsizing: ec2-web-04', description='Instance is consistently under 5% CPU. Downgrade from t3.large to t3.small.', potential_savings=22.00, severity='Low')
    print("Created AI Cost Savings intel")

    print("\nPROJECT SEEDED SUCCESSFULLY FOR DEMO")
    print(f"Log in with: admin / admin123")

if __name__ == "__main__":
    seed_data()
