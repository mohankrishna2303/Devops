from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Organization, Project, Pipeline, Failure, CIFailure
from django.utils import timezone
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seeds the database with demo data for the DevOps dashboard'

    def handle(self, *args, **kwargs):
        # 1. Create User
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@braindevops.com'}
        )
        if created:
            user.set_password('admin123')
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Created user: {user.username}'))
        else:
            self.stdout.write(f'Using existing user: {user.username}')

        # 2. Create Organization
        org, created = Organization.objects.get_or_create(
            name='Global Tech Corp',
            owner=user,
            defaults={'plan': 'Enterprise'}
        )
        self.stdout.write(f'Using organization: {org.name}')

        # 3. Create Projects
        projects_data = [
            {'name': 'Auth Service', 'lang': 'nodejs', 'framework': 'express', 'repo': 'global-tech/auth-service', 'branch': 'main'},
            {'name': 'Payment Gateway', 'lang': 'python', 'framework': 'django', 'repo': 'global-tech/payments', 'branch': 'production'},
            {'name': 'Inventory API', 'lang': 'go', 'framework': 'gin', 'repo': 'global-tech/inventory', 'branch': 'main'},
            {'name': 'Mobile App BFF', 'lang': 'typescript', 'framework': 'nest', 'repo': 'global-tech/mobile-bff', 'branch': 'develop'},
        ]

        projects = []
        for p_data in projects_data:
            project, created = Project.objects.get_or_create(
                name=p_data['name'],
                organization=org,
                defaults={
                    'repo_name': p_data['repo'],
                    'language': p_data['lang'],
                    'framework': p_data['framework'],
                    'cloud_provider': random.choice(['aws', 'azure', 'gcp']),
                }
            )
            projects.append(project)
            if created:
                self.stdout.write(f'Created project: {project.name}')

        # 4. Create Pipelines
        statuses = ['success', 'success', 'success', 'failure', 'failure'] # 40% failure rate for demo
        triggers = ['GitHook', 'Manual', 'Schedule', 'Dave Harrison']
        
        # Clear existing data to avoid duplicates
        Pipeline.objects.filter(project__organization=org).delete()
        CIFailure.objects.filter(project__organization=org).delete()

        now = timezone.now()
        
        for project in projects:
            # Create 5-8 runs per project
            for i in range(random.randint(5, 8)):
                run_time = now - timedelta(days=random.randint(0, 7), hours=random.randint(0, 23))
                status = random.choice(statuses)
                pipeline = Pipeline.objects.create(
                    project=project,
                    build_number=f"B-{random.randint(1000, 9999)}",
                    status=status,
                    branch=project.name.lower().replace(' ', '-') + '-ref', # randomish branch
                    triggered_by=random.choice(triggers)
                )
                # Overwrite auto_now_add creation time to spread data
                Pipeline.objects.filter(id=pipeline.id).update(created_at=run_time)
                
                # If failure, add a Failure record
                if status == 'failure':
                    error_details = [
                        ('Dependency Error', 'Version mismatch @babel/core. Expected 7.x, found 6.x', 'High', 'The project depends on @babel/core v7.x features, but the CI environment only has v6.x installed. Update your package-lock.json to force v7.1.0 or higher.'),
                        ('Timeout Error', 'Unit tests exceeded 300s limit in test_auth_flow.js', 'Medium', 'The authentication flow tests are taking too long due to a circular retry loop in the login controller. Check test_auth_flow.js for proper mock resetting.'),
                        ('Linting Error', 'Trailing whitespaces and missing semicolons in utils.js', 'Low', 'Your code style checks failed due to minor syntax issues. I recommend running "npm run lint -- --fix" locally before pushing again.'),
                        ('Security Error', 'Sensitive AWS_SECRET_KEY found in build logs', 'High', 'CRITICAL: The build environment exposed a secret key in plain text. Please rotate your AWS credentials immediately and update the GitHub Actions secrets configuration.'),
                        ('Database Error', 'Connection refused on port 5432: Role "postgres" does not exist', 'High', 'The database migration failed because the "postgres" role is missing in the CI database container. Ensure your docker-compose.yml defines the correct PGUSER environment variable.')
                    ]
                    err_type, err_msg, severity, explanation = random.choice(error_details)
                    Failure.objects.create(
                        pipeline=pipeline,
                        error_type=err_type,
                        error_message=err_msg,
                        severity=severity,
                        ai_explanation=explanation,
                        suggested_fix="Run 'npm run fix' or update config.",
                        is_resolved=False
                    )
                    
                    # Also create a CIFailure for compatibility with various components
                    CIFailure.objects.get_or_create(
                        project=project,
                        failure_log=err_msg,
                        defaults={
                            'ai_analysis': f'This looks like a {err_type}. You should check your configuration.',
                            'status': 'open'
                        }
                    )

        self.stdout.write(self.style.SUCCESS('Successfully seeded demo data!'))
