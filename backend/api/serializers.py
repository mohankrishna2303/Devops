from rest_framework import serializers
from .models import (
    Project, Deployment, DevOpsConfig, Organization, CIFailure, DORAMetrics,
    Pipeline, Failure, K8sCluster, CloudIntegration, GitIntegration,
    DatabaseConnection, DiscoveredResource, CostRecommendation, TerraformRun, InfraResource
)

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'plan', 'created_at']

class PipelineSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    project_repo_name = serializers.CharField(source='project.repo_name', read_only=True)
    class Meta:
        model = Pipeline
        fields = ['id', 'project', 'project_name', 'project_repo_name', 'build_number', 'status', 'branch', 'triggered_by', 'created_at']

class FailureSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='pipeline.project.name', read_only=True)
    build_number = serializers.CharField(source='pipeline.build_number', read_only=True)
    build_info = serializers.SerializerMethodField()

    class Meta:
        model = Failure
        fields = '__all__'

    def get_build_info(self, obj):
        return {
            'repo': obj.pipeline.project.repo_name,
            'build': obj.pipeline.build_number
        }

class K8sClusterSerializer(serializers.ModelSerializer):
    class Meta:
        model = K8sCluster
        fields = '__all__'

class CloudIntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CloudIntegration
        fields = '__all__'

class GitIntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GitIntegration
        fields = '__all__'

class DatabaseConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatabaseConnection
        fields = '__all__'

class DiscoveredResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscoveredResource
        fields = '__all__'

class CostRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CostRecommendation
        fields = '__all__'

class InfraResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfraResource
        fields = '__all__'

class TerraformRunSerializer(serializers.ModelSerializer):
    resources = InfraResourceSerializer(many=True, read_only=True)
    class Meta:
        model = TerraformRun
        fields = ['id', 'plan_name', 'status', 'version', 'provider', 'resources', 'created_at']

class DORAMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DORAMetrics
        fields = ['id', 'deployment_frequency', 'lead_time_for_changes', 'mean_time_to_recovery', 'change_failure_rate', 'date']

class CIFailureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CIFailure
        fields = ['id', 'project', 'failure_log', 'ai_analysis', 'status', 'created_at']

class DevOpsConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = DevOpsConfig
        fields = ['id', 'dockerfile', 'kubernetes_yaml', 'terraform_config', 'created_at', 'updated_at']

class ProjectBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name']

class DeploymentSerializer(serializers.ModelSerializer):
    project_details = ProjectBriefSerializer(source='project', read_only=True)
    class Meta:
        model = Deployment
        fields = ['id', 'project', 'project_details', 'status', 'logs', 'created_at', 'completed_at']

class ProjectSerializer(serializers.ModelSerializer):
    devops_config = DevOpsConfigSerializer(read_only=True)
    deployments = DeploymentSerializer(many=True, read_only=True)
    pipelines = PipelineSerializer(many=True, read_only=True)
    success_rate = serializers.SerializerMethodField()
    last_deploy = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'repo_name', 'provider', 'language', 'framework', 'cloud_provider',
            'description', 'github_url', 'devops_config', 'deployments', 'pipelines',
            'success_rate', 'last_deploy', 'status',
            'created_at', 'updated_at'
        ]
        
    def get_success_rate(self, obj):
        runs = obj.pipelines.all()
        if not runs: return 0
        successes = runs.filter(status='success').count()
        return round((successes / runs.count()) * 100)
    
    def get_last_deploy(self, obj):
        last = obj.pipelines.order_by('-created_at').first()
        return last.created_at if last else obj.created_at
        
    def get_status(self, obj):
        return 'active'

