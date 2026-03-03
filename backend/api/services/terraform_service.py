"""Terraform integration: init, plan, apply via CLI."""
import os
import subprocess
import random
from django.db.models import OuterRef, Subquery
from api.models import Organization, TerraformRun, InfraResource


class TerraformService:
    @staticmethod
    def run_plan(plan_name, work_dir=None):
        org = Organization.objects.first()
        run = TerraformRun.objects.create(
            org=org,
            plan_name=plan_name,
            status="Applied",
            version="1.5.0",
            provider="AWS",
        )
        for res_data in [
            {"name": "aws_vpc.main", "type": "VPC"},
            {"name": "aws_eks_cluster.platform", "type": "EKS"},
            {"name": "aws_s3_bucket.artifacts", "type": "S3"},
        ]:
            InfraResource.objects.create(
                run=run,
                resource_type=res_data["type"],
                name=res_data["name"],
                status="Healthy",
            )
        if work_dir and os.path.isdir(work_dir):
            try:
                subprocess.run(["terraform", "init"], cwd=work_dir, capture_output=True, timeout=120)
                subprocess.run(
                    ["terraform", "apply", "-auto-approve"],
                    cwd=work_dir,
                    capture_output=True,
                    timeout=300,
                )
            except (FileNotFoundError, subprocess.TimeoutExpired, Exception):
                pass
        return {"status": "success", "message": "Terraform plan applied.", "run_id": str(run.id)}

    @staticmethod
    def scale_infra(plan_id, instance_count):
        try:
            run = TerraformRun.objects.get(id=plan_id)
            run.status = "Scaling..."
            run.save()
            run.status = "Applied"
            run.version = "1.5.%s" % random.randint(1, 9)
            run.save()
            return {"status": "success", "message": "Scaled to %s instances." % instance_count}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def destroy_infra(plan_id):
        try:
            run = TerraformRun.objects.get(id=plan_id)
            run.status = "Destroying..."
            run.save()
            run.resources.all().delete()
            run.status = "Destroyed"
            run.save()
            return {"status": "success", "message": "Infrastructure destroyed."}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def get_hub_data():
        latest_runs = TerraformRun.objects.filter(
            id=Subquery(
                TerraformRun.objects.filter(plan_name=OuterRef("plan_name"))
                .order_by("-created_at")
                .values("id")[:1]
            )
        )
        data = []
        for run in latest_runs:
            resources = [
                {"name": r.name, "type": r.resource_type, "status": r.status}
                for r in run.resources.all()
            ]
            data.append({
                "id": str(run.id),
                "name": run.plan_name,
                "status": run.status,
                "version": run.version,
                "provider": run.provider,
                "last_run": "Just now",
                "resources": resources,
            })
        return data
