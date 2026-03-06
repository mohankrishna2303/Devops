"""
Orchestrator: coordinates AI generator, GitHub, Docker, K8s, Terraform
for full deploy flow. Call from deploy_project view when moving to advanced stage.
"""
from api.models import Project, Deployment
from api.ai_service import ai_service
from .github_service import GitHubService
from .docker_service import DockerService
from .k8s_service import K8sService
from .terraform_service import TerraformService


class DeploymentEngine:
    @staticmethod
    def run_full_deploy(project_id, options=None):
        """
        Full pipeline: generate config -> (optional) GitHub repo -> Docker build -> Push -> K8s apply -> Terraform.
        options: { "create_github": True, "build_docker": True, "apply_k8s": True, "apply_terraform": False }
        """
        options = options or {}
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return {"status": "error", "message": "Project not found."}

        deployment = Deployment.objects.create(
            project=project,
            status="Pending",
            logs="Starting deployment pipeline...\n",
        )

        lang = project.language or "Node.js"
        framework = project.framework or "Express"
        cloud = project.cloud_provider or "AWS"

        # 1. Ensure AI config exists
        if not project.generated_dockerfile:
            config = ai_service.generate_devops_config(lang, framework, cloud)
            project.generated_dockerfile = config.get("dockerfile")
            project.generated_k8s_yaml = config.get("k8s_yaml")
            project.generated_terraform = config.get("terraform")
            project.save()
        deployment.logs += "DevOps config ready.\n"

        # 2. Optional: create GitHub repo and push
        if options.get("create_github") and options.get("github_token"):
            r = GitHubService.create_repo(options["github_token"], project.name or "app")
            deployment.logs += f"GitHub: {r.get('status', 'skip')}\n"

        # 3. Optional: Docker build from generated Dockerfile
        if options.get("build_docker"):
            r = DockerService.build_from_content(
                project.generated_dockerfile or "",
                tag=f"{project.name or 'app'}:latest",
            )
            deployment.logs += f"Docker build: {r.get('status', 'skip')}\n"

        # 4. Optional: apply K8s YAML
        if options.get("apply_k8s") and project.generated_k8s_yaml:
            r = K8sService.apply_deployment(project.generated_k8s_yaml)
            deployment.logs += f"K8s apply: {r.get('status', 'skip')}\n"

        # 5. Optional: Terraform (would need work_dir with .tf files)
        if options.get("apply_terraform"):
            r = TerraformService.run_plan(project.name or "main")
            deployment.logs += f"Terraform: {r.get('status', 'skip')}\n"

        deployment.status = "Success"
        deployment.save()
        return {"status": "success", "deployment_id": str(deployment.id), "logs": deployment.logs}
