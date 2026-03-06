from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes([AllowAny])
def test_aws_connection(request):
    """Test AWS connection"""
    try:
        # Mock AWS connection test
        return JsonResponse({
            'success': True,
            'message': 'AWS connection successful',
            'region': request.data.get('region', 'us-east-1'),
            'services': ['EC2', 'S3', 'RDS', 'Lambda']
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def test_azure_connection(request):
    """Test Azure connection"""
    try:
        # Mock Azure connection test
        return JsonResponse({
            'success': True,
            'message': 'Azure connection successful',
            'subscription': request.data.get('subscription', 'default-subscription'),
            'resource_groups': ['devops-rg', 'production-rg']
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def test_gcp_connection(request):
    """Test GCP connection"""
    try:
        # Mock GCP connection test
        return JsonResponse({
            'success': True,
            'message': 'GCP connection successful',
            'project': request.data.get('project', 'my-project'),
            'services': ['Compute Engine', 'Cloud Storage', 'Cloud SQL']
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_cloud_providers(request):
    """List available cloud providers"""
    try:
        return JsonResponse({
            'providers': [
                {
                    'name': 'AWS',
                    'status': 'connected',
                    'region': 'us-east-1',
                    'last_sync': '2024-03-06T14:00:00Z'
                },
                {
                    'name': 'Azure',
                    'status': 'disconnected',
                    'region': None,
                    'last_sync': None
                },
                {
                    'name': 'GCP',
                    'status': 'connected',
                    'project': 'my-project',
                    'last_sync': '2024-03-06T13:30:00Z'
                }
            ]
        })
    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=500)
