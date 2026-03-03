from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Organization, Project, Pipeline, Failure

class APITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser' + str(timezone.now().timestamp()), password='password123')
        self.client.force_authenticate(user=self.user)
        self.org = Organization.objects.create(name="Test Org", owner=self.user)
        self.project = Project.objects.create(name="Test Project", repo_name="test/repo", organization=self.org, provider="GitHub")

    def test_api_index(self):
        print("DEBUG: Calling api_health")
        response = self.client.get(reverse('api_health'))
        print(f"DEBUG: Status code: {response.status_code}")
        print(f"DEBUG: Data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')

    def test_dashboard_stats(self):
        # Create a mock pipeline
        now = timezone.now()
        Pipeline.objects.create(project=self.project, build_number="1", status="success", branch="main", created_at=now)
        Pipeline.objects.create(project=self.project, build_number="2", status="failure", branch="main", created_at=now)
        
        response = self.client.get('/api/analytics/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_pipelines'], 2)
        self.assertEqual(response.data['failure_rate'], 50.0)

    def test_github_webhook_processing(self):
        payload = {
            "workflow_run": {
                "run_number": 123,
                "conclusion": "failure",
                "status": "completed",
                "head_branch": "main",
                "actor": {"login": "test-actor"},
                "created_at": "2023-10-27T10:00:00Z"
            },
            "repository": {
                "full_name": "test/repo"
            }
        }
        # Note: We bypass signature in DEBUG mode
        response = self.client.post('/api/webhooks/github/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Pipeline.objects.filter(build_number="123").exists())
        self.assertTrue(Failure.objects.count() > 0)

    def test_resolve_failure(self):
        now = timezone.now()
        pipeline = Pipeline.objects.create(project=self.project, build_number="1", status="failure", branch="main", created_at=now)
        failure = Failure.objects.create(pipeline=pipeline, error_type="TestError")
        
        response = self.client.post(f'/api/failures/{failure.id}/resolve/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        failure.refresh_from_db()
        self.assertTrue(failure.is_resolved)
