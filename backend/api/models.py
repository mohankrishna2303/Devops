from django.db import models
from django.contrib.auth.models import User

class Organization(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.CharField(max_length=100, default='Free')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True, blank=True)
    repo_name = models.CharField(max_length=255, blank=True)
    provider = models.CharField(max_length=50, default='GitHub')
    language = models.CharField(max_length=50, blank=True)
    framework = models.CharField(max_length=50, blank=True)
    cloud_provider = models.CharField(max_length=50, default='aws')
    description = models.TextField(blank=True)
    github_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Pipeline(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='pipelines')
    build_number = models.CharField(max_length=50)
    status = models.CharField(max_length=20)  # success, failure, running
    branch = models.CharField(max_length=100)
    triggered_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class Failure(models.Model):
    pipeline = models.ForeignKey(Pipeline, on_delete=models.CASCADE, related_name='failures')
    error_type = models.CharField(max_length=100)
    error_message = models.TextField()
    severity = models.CharField(max_length=20)
    ai_explanation = models.TextField(blank=True)
    suggested_fix = models.TextField(blank=True)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class FailureCluster(models.Model):
    name = models.CharField(max_length=255)
    common_error = models.TextField()
    frequency = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

class Deployment(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='deployments')
    status = models.CharField(max_length=20, default='pending')
    logs = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

class DevOpsConfig(models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE, related_name='devops_config')
    dockerfile = models.TextField()
    kubernetes_yaml = models.TextField()
    terraform_config = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class DORAMetrics(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    deployment_frequency = models.FloatField(default=0)
    lead_time_for_changes = models.FloatField(default=0)
    mean_time_to_recovery = models.FloatField(default=0)
    change_failure_rate = models.FloatField(default=0)
    date = models.DateField(auto_now_add=True)

class K8sCluster(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    region = models.CharField(max_length=100)
    nodes = models.IntegerField(default=0)
    pods = models.IntegerField(default=0)
    workload_count = models.IntegerField(default=0)
    namespace_count = models.IntegerField(default=0)
    cpu_usage = models.IntegerField(default=0)
    mem_usage = models.IntegerField(default=0)
    health_score = models.IntegerField(default=100)
    status = models.CharField(max_length=50)
    version = models.CharField(max_length=20, default='1.27')
    provider = models.CharField(max_length=50, default='EKS')

class CloudIntegration(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    provider = models.CharField(max_length=50)
    account_id = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    status = models.CharField(max_length=50)

class GitIntegration(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    provider = models.CharField(max_length=50)
    username = models.CharField(max_length=100)
    status = models.CharField(max_length=50)

class DatabaseConnection(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    engine = models.CharField(max_length=50)
    host = models.CharField(max_length=255)
    port = models.IntegerField()
    status = models.CharField(max_length=50)
    is_local = models.BooleanField(default=False)

class DiscoveredResource(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    provider = models.CharField(max_length=50)
    resource_type = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=100)
    is_managed = models.BooleanField(default=True)

class CostRecommendation(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    potential_savings = models.FloatField()
    severity = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

class TerraformRun(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE)
    plan_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    version = models.CharField(max_length=20)
    provider = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class InfraResource(models.Model):
    run = models.ForeignKey(TerraformRun, on_delete=models.CASCADE, related_name='resources', null=True)
    name = models.CharField(max_length=255)
    resource_type = models.CharField(max_length=100)
    provider_id = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class CIFailure(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='ci_failures')
    failure_log = models.TextField()
    ai_analysis = models.TextField()
    status = models.CharField(max_length=20, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
