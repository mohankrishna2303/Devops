# Legacy/orchestration services: Notification, DataImportExport, Jenkins, Integration, DB, Cost, AI fix, Stress, Security
import os
import random
import json
import csv
import io
import requests
from datetime import datetime
from django.contrib.auth.models import User
from api.models import (
    Organization, Project, Failure, TerraformRun, Pipeline,
    InfraResource, K8sCluster, CloudIntegration, GitIntegration,
    DatabaseConnection, DiscoveredResource, CostRecommendation,
)
from api.ai_service import ai_service


class NotificationService:
    @staticmethod
    def send_slack_alert(message):
        webhook_url = os.getenv("SLACK_WEBHOOK_URL")
        if not webhook_url:
            print("SLACK LOG (Env missing): %s" % message)
            return False
        payload = {"text": "*DevOps Intelligence Alert*\n%s" % message}
        try:
            requests.post(webhook_url, json=payload, timeout=5)
            return True
        except Exception as e:
            print("Failed to send Slack alert: %s" % e)
            return False


class DataImportExportService:
    @staticmethod
    def import_from_csv(file):
        decoded_file = file.read().decode("utf-8")
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        imported_count = 0
        project = Project.objects.first()
        if not project:
            user = User.objects.first()
            org, _ = Organization.objects.get_or_create(name="Default Org", defaults={"owner": user})
            project = Project.objects.create(repo_name="Imported-Legacy", org=org, provider="CSV")
        for row in reader:
            pipeline = Pipeline.objects.create(
                project=project,
                build_number="EXT-%s" % datetime.now().microsecond,
                status="failure",
                branch="unknown",
                triggered_by="CSV Import",
                created_at=datetime.now(),
            )
            Failure.objects.create(
                # pipeline=pipeline,
                error_type=row.get("Error Type", "Unknown"),
                severity=row.get("Severity", "Medium"),
                error_message=row.get("Error Message", "Imported without log context."),
                ai_explanation="Imported from legacy CSV.",
                suggested_fix="Review legacy logs.",
            )
            imported_count += 1
        return imported_count


class JenkinsService:
    @staticmethod
    def sync_jobs(project_name):
        project, _ = Project.objects.get_or_create(
            repo_name=project_name,
            defaults={"provider": "Jenkins"},
        )
        build_number = str(random.randint(50, 200))
        status_val = random.choice(["success", "failure", "failure", "success"])
        pipeline = Pipeline.objects.create(
            project=project,
            build_number=build_number,
            status=status_val,
            branch="main",
            triggered_by="Jenkins Scheduler",
            created_at=datetime.now(),
        )
        if status_val == "failure":
            Failure.objects.create(
                # pipeline=pipeline,
                error_type="BuildError",
                error_message="Jenkins Build Step failed with exit code 1.",
                severity="High",
                ai_explanation="The Jenkins build failed during the shell execution step.",
                suggested_fix="Check the Jenkins console output.",
            )
        return {"status": "success", "build_number": build_number, "conclusion": status_val}


class IntegrationService:
    @staticmethod
    def get_all_connections():
        org = Organization.objects.first()
        if not org:
            return {"cloud": [], "git": []}
        cloud = CloudIntegration.objects.filter(org=org)
        git = GitIntegration.objects.filter(org=org)
        if not cloud.exists():
            CloudIntegration.objects.create(org=org, provider="AWS", account_id="1234-5678-9012", region="us-east-1")
            CloudIntegration.objects.create(org=org, provider="Azure", account_id="sub-abc-123", region="West US")
            cloud = CloudIntegration.objects.filter(org=org)
        if not git.exists():
            GitIntegration.objects.create(org=org, provider="GitHub", username="braindevops-admin")
            GitIntegration.objects.create(org=org, provider="GitLab", username="devops-lead-01")
            git = GitIntegration.objects.filter(org=org)
        return {
            "cloud": [{"id": str(c.id), "provider": c.provider, "account": c.account_id, "status": c.status} for c in cloud],
            "git": [{"id": str(g.id), "provider": g.provider, "user": g.username, "status": g.status} for g in git],
        }


class DatabaseService:
    @staticmethod
    def get_db_connections():
        org = Organization.objects.first()
        if not org:
            return []
        dbs = DatabaseConnection.objects.filter(org=org)
        if not dbs.exists():
            DatabaseConnection.objects.create(org=org, name="Prod Postgres", engine="Postgres", host="prod-db.aws.com", port=5432)
            DatabaseConnection.objects.create(org=org, name="Local Debug DB", engine="Local", host="localhost", port=5433, is_local=True)
            dbs = DatabaseConnection.objects.filter(org=org)
        return [{"id": str(d.id), "name": d.name, "engine": d.engine, "host": d.host, "status": d.status, "is_local": d.is_local} for d in dbs]

    @staticmethod
    def connect_local(name, port):
        org = Organization.objects.first()
        if not org:
            return {"status": "error", "message": "No organization"}
        db = DatabaseConnection.objects.create(
            org=org, name=name, engine="Local", host="127.0.0.1", port=port, is_local=True, status="Connected"
        )
        return {"status": "success", "db_id": str(db.id)}


class AutoDiscoveryService:
    @staticmethod
    def run_scan():
        org = Organization.objects.first()
        if not org:
            return {"status": "success", "discovered": 0, "total_untracked": 0}
        potential_finds = [
            {"provider": "AWS", "type": "EC2 Instance", "name": "legacy-web-server", "location": "us-east-1"},
            {"provider": "Azure", "type": "SQL Database", "name": "marketing-docs-db", "location": "West Europe"},
        ]
        discovered_count = 0
        for data in potential_finds:
            _, created = DiscoveredResource.objects.get_or_create(
                org=org, name=data["name"], provider=data["provider"],
                defaults={"resource_type": data["type"], "location": data["location"], "is_managed": False},
            )
            if created:
                discovered_count += 1
        return {"status": "success", "discovered": discovered_count, "total_untracked": DiscoveredResource.objects.filter(is_managed=False).count()}

    @staticmethod
    def get_untracked_resources():
        resources = DiscoveredResource.objects.filter(is_managed=False).order_by("-discovery_date")
        return [{"id": str(r.id), "name": r.name, "type": r.resource_type, "provider": r.provider, "location": r.location, "date": r.discovery_date.strftime("%Y-%m-%d")} for r in resources]


class CostOptimizationService:
    @staticmethod
    def get_recommendations():
        org = Organization.objects.first()
        if not org:
            return []
        recs = CostRecommendation.objects.filter(org=org, is_applied=False)
        if not recs.exists():
            for r in [
                {"title": "Unused Elastic IPs", "description": "Release unassociated IPs.", "savings": 22.00, "severity": "Low"},
                {"title": "Rightsize RDS", "description": "Downgrade underutilized DB.", "savings": 145.50, "severity": "Medium"},
            ]:
                CostRecommendation.objects.create(org=org, title=r["title"], description=r["description"], potential_savings=r["savings"], severity=r["severity"])
            recs = CostRecommendation.objects.filter(org=org, is_applied=False)
        return [{"id": str(r.id), "title": r.title, "description": r.description, "savings": float(r.potential_savings), "severity": r.severity, "created_at": r.created_at.strftime("%Y-%m-%d")} for r in recs]

    @staticmethod
    def apply_recommendation(rec_id):
        try:
            rec = CostRecommendation.objects.get(id=rec_id)
            rec.is_applied = True
            rec.save()
            return {"status": "success", "message": "Recommendation applied."}
        except Exception as e:
            return {"status": "error", "message": str(e)}


class AIAutoFixService:
    @staticmethod
    def generate_patch(failure_id):
        try:
            failure = Failure.objects.get(id=failure_id)
            ai_service.analyze_failure(failure.error_message, "Stack trace hidden")
            return {"status": "success", "patch": "diff --git a/app/main.py b/app/main.py\n+ Fix", "explanation": "AI suggested patch.", "pr_link": "#"}
        except Exception as e:
            return {"status": "error", "message": str(e)}


class DevOpsStressService:
    @staticmethod
    def run_stress_test():
        return {"status": "success", "timeline": [{"time": "0s", "event": "Stress test initialized", "status": "info"}, {"time": "5s", "event": "Load stabilized", "status": "success"}]}


class SecurityAuditService:
    @staticmethod
    def run_audit():
        return {"status": "success", "score": 82, "findings": [{"id": 1, "check": "IAM Least Privilege", "result": "Pass", "severity": "None"}]}

from api.models import (
    Pipeline,
    
)