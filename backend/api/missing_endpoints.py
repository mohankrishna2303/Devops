from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def terraform_init(request):
    """Initialize Terraform"""
    try:
        # Mock terraform initialization
        return Response({
            'success': True,
            'message': 'Terraform initialized successfully',
            'workspace': 'default'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def terraform_plan(request):
    """Create Terraform plan"""
    try:
        # Mock terraform plan creation
        return Response({
            'success': True,
            'message': 'Terraform plan created',
            'plan_id': 'plan_123',
            'changes': {
                'add': 5,
                'change': 2,
                'destroy': 1
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def terraform_apply(request):
    """Apply Terraform plan"""
    try:
        data = getattr(request, 'data', {})
        plan_id = data.get('plan_id', 'unknown')
        # Mock terraform apply
        return Response({
            'success': True,
            'message': 'Terraform plan applied successfully',
            'plan_id': plan_id,
            'resources_created': 5,
            'resources_updated': 2,
            'resources_destroyed': 1
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def terraform_destroy(request):
    """Destroy Terraform resources"""
    try:
        # Mock terraform destroy
        return Response({
            'success': True,
            'message': 'Terraform resources destroyed successfully',
            'resources_destroyed': 8
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)
