from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    api_health,
    OrganizationViewSet, 
    ProjectViewSet, 
    PipelineViewSet, 
    FailureViewSet,
    github_webhook,
    dashboard_stats,
    RegisterView,
    profile,
    export_failures_csv,
    import_failures_csv,
    sync_github_runs,
    dora_metrics,
    resolve_failure,
    generate_report,
    get_terraform_data,
    apply_terraform_plan,
    sync_jenkins_job,
    get_k8s_fleet,
    get_k8s_namespaces,
    get_k8s_workloads,
    get_k8s_pods,
    get_k8s_pod_logs,
    scale_k8s_workload,
    deploy_k8s_workload,
    delete_k8s_workload,
    apply_k8s_yaml,
    get_k8s_events,
    get_observability_telemetry,
    get_integrations,
    get_databases,
    connect_local_db,
    scan_cloud_resources,
    get_untracked_resources,
    get_cost_recommendations,
    apply_cost_recommendation,
    scale_terraform,
    destroy_terraform,
    get_ai_patch,
    run_devops_stress,
    run_security_audit,
    generate_config,
    deploy_project,
    DeploymentViewSet
)
from . import social_auth_views
from . import missing_endpoints
from . import cloud_endpoints

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'pipelines', PipelineViewSet, basename='pipeline')
router.register(r'failures', FailureViewSet, basename='failure')
router.register(r'deployments', DeploymentViewSet, basename='deployment')

urlpatterns = [
    path('', api_health, name='api_health'),
    path('health/', api_health, name='api_health_alt'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', profile, name='profile'),
    # Cloud provider endpoints
    path('terraform/init/', missing_endpoints.terraform_init, name='terraform_init'),
    path('terraform/plan/', missing_endpoints.terraform_plan, name='terraform_plan'),
    path('terraform/apply/', missing_endpoints.terraform_apply, name='terraform_apply'),
    path('terraform/destroy/', missing_endpoints.terraform_destroy, name='terraform_destroy'),
    path('cloud/aws/test/', cloud_endpoints.test_aws_connection, name='test_aws_connection'),
    path('cloud/azure/test/', cloud_endpoints.test_azure_connection, name='test_azure_connection'),
    path('cloud/gcp/test/', cloud_endpoints.test_gcp_connection, name='test_gcp_connection'),
    path('cloud/providers/', cloud_endpoints.list_cloud_providers, name='list_cloud_providers'),
    path('auth/social/<str:provider>/', social_auth_views.social_login_redirect, name='social_login_redirect'),
    path('auth/social/<str:provider>/callback/', social_auth_views.social_login_callback, name='social_login_callback'),
    path('auth/social/providers/', social_auth_views.social_providers, name='social_providers'),
    path('devops/generate/', generate_config, name='generate_config'),
    path('devops/deploy/', deploy_project, name='deploy_project'),
    path('webhooks/github/', github_webhook, name='github_webhook'),
    path('analytics/dashboard/', dashboard_stats, name='dashboard_stats'),
    path('analytics/dora/', dora_metrics, name='dora_metrics'),
    path('metrics/', dora_metrics, name='metrics_alt'),  # Add metrics endpoint
    path('metrics/dora', dora_metrics, name='metrics_dora'),  # Add metrics/dora endpoint
    path('analytics/report/', generate_report, name='generate_report'),
    path('export/failures/', export_failures_csv, name='export_failures_csv'),
    path('import/failures/', import_failures_csv, name='import_failures_csv'),
    path('failures/<int:pk>/resolve/', resolve_failure, name='resolve_failure'),
    path('sync/github/', sync_github_runs, name='sync_github_runs'),
    path('terraform/hub/', get_terraform_data, name='get_terraform_hub'),
    path('terraform/apply/', apply_terraform_plan, name='apply_terraform_plan'),
    path('sync/jenkins/', sync_jenkins_job, name='sync_jenkins_job'),
    path('k8s/fleet/', get_k8s_fleet, name='get_k8s_fleet'),
    path('k8s/namespaces/', get_k8s_namespaces, name='get_k8s_namespaces'),
    path('k8s/workloads/', get_k8s_workloads, name='get_k8s_workloads'),
    path('k8s/pods/', get_k8s_pods, name='get_k8s_pods'),
    path('k8s/pods/<int:pod_id>/logs/', get_k8s_pod_logs, name='get_k8s_pod_logs'),
    path('k8s/workloads/scale/', scale_k8s_workload, name='scale_k8s_workload'),
    path('k8s/workloads/deploy/', deploy_k8s_workload, name='deploy_k8s_workload'),
    path('k8s/workloads/<int:workload_id>/delete/', delete_k8s_workload, name='delete_k8s_workload'),
    path('k8s/apply/', apply_k8s_yaml, name='apply_k8s_yaml'),
    path('k8s/events/', get_k8s_events, name='get_k8s_events'),
    path('observability/telemetry/', get_observability_telemetry, name='get_telemetry'),
    path('integrations/all/', get_integrations, name='get_integrations'),
    path('databases/all/', get_databases, name='get_databases'),
    path('databases/connect-local/', connect_local_db, name='connect_local_db'),
    path('cloud/scan/', scan_cloud_resources, name='scan_cloud'),
    path('cloud/untracked/', get_untracked_resources, name='get_untracked'),
    path('cost/recommendations/', get_cost_recommendations, name='get_cost_recs'),
    path('cost/recommendations/<int:pk>/apply/', apply_cost_recommendation, name='apply_cost_rec'),
    path('terraform/scale/', scale_terraform, name='scale_terraform'),
    path('terraform/destroy/', destroy_terraform, name='destroy_terraform'),
    path('failures/<int:pk>/ai-patch/', get_ai_patch, name='get_ai_patch'),
    path('devops/stress-test/', run_devops_stress, name='stress_test'),
    path('devops/security-audit/', run_security_audit, name='security_audit'),
    
    # Router routes last
    path('', include(router.urls)),
]
