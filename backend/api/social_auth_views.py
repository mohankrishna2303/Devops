from django.contrib.auth import login
from django.shortcuts import redirect
from django.conf import settings
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.oauth2.views import OAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.gitlab.views import GitLabOAuth2Adapter
from allauth.socialaccount.providers.bitbucket_oauth2.views import BitbucketOAuth2Adapter
import requests
import json


@api_view(['GET'])
@permission_classes([AllowAny])
def social_login_redirect(request, provider):
    """Get the OAuth URL for social login"""
    base_urls = {
        'google': 'https://accounts.google.com/o/oauth2/v2/auth',
        'github': 'https://github.com/login/oauth/authorize',
        'gitlab': 'https://gitlab.com/oauth/authorize',
        'bitbucket': 'https://bitbucket.org/site/oauth2/authorize'
    }
    
    client_ids = {
        'google': getattr(settings, 'GOOGLE_OAUTH_CLIENT_ID', ''),
        'github': getattr(settings, 'GITHUB_OAUTH_CLIENT_ID', ''),
        'gitlab': getattr(settings, 'GITLAB_OAUTH_CLIENT_ID', ''),
        'bitbucket': getattr(settings, 'BITBUCKET_OAUTH_CLIENT_ID', '')
    }
    
    redirect_uri = f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5174')}/auth/callback/{provider}"
    
    params = {
        'client_id': client_ids.get(provider, ''),
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': get_provider_scope(provider)
    }
    
    auth_url = f"{base_urls.get(provider, '')}?{urlencode(params)}"
    
    return JsonResponse({
        'auth_url': auth_url,
        'provider': provider
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def social_login_callback(request, provider):
    """Handle OAuth callback and return JWT tokens"""
    code = request.data.get('code')
    if not code:
        return JsonResponse({'error': 'Authorization code required'}, status=400)
    
    try:
        # Exchange code for access token
        token_data = exchange_code_for_token(provider, code)
        access_token = token_data.get('access_token')
        
        # Get user info from provider
        user_info = get_user_info_from_provider(provider, access_token)
        
        # Create or get user and social account
        user, created = create_or_get_user_from_social(provider, user_info)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return JsonResponse({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'provider': provider,
            'created': created
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_provider_scope(provider):
    """Get OAuth scope for each provider"""
    scopes = {
        'google': 'profile email',
        'github': 'user:email',
        'gitlab': 'read_user',
        'bitbucket': 'email account'
    }
    return scopes.get(provider, '')


def exchange_code_for_token(provider, code):
    """Exchange authorization code for access token"""
    from urllib.parse import urlencode
    
    client_ids = {
        'google': getattr(settings, 'GOOGLE_OAUTH_CLIENT_ID', ''),
        'github': getattr(settings, 'GITHUB_OAUTH_CLIENT_ID', ''),
        'gitlab': getattr(settings, 'GITLAB_OAUTH_CLIENT_ID', ''),
        'bitbucket': getattr(settings, 'BITBUCKET_OAUTH_CLIENT_ID', '')
    }
    
    client_secrets = {
        'google': getattr(settings, 'GOOGLE_OAUTH_CLIENT_SECRET', ''),
        'github': getattr(settings, 'GITHUB_OAUTH_CLIENT_SECRET', ''),
        'gitlab': getattr(settings, 'GITLAB_OAUTH_CLIENT_SECRET', ''),
        'bitbucket': getattr(settings, 'BITBUCKET_OAUTH_CLIENT_SECRET', '')
    }
    
    token_urls = {
        'google': 'https://oauth2.googleapis.com/token',
        'github': 'https://github.com/login/oauth/access_token',
        'gitlab': 'https://gitlab.com/oauth/token',
        'bitbucket': 'https://bitbucket.org/site/oauth2/access_token'
    }
    
    redirect_uri = f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5174')}/auth/callback/{provider}"
    
    data = {
        'client_id': client_ids.get(provider, ''),
        'client_secret': client_secrets.get(provider, ''),
        'code': code,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code'
    }
    
    headers = {'Accept': 'application/json'}
    
    response = requests.post(token_urls.get(provider, ''), data=data, headers=headers)
    response.raise_for_status()
    
    return response.json()


def get_user_info_from_provider(provider, access_token):
    """Get user information from the provider using access token"""
    user_info_urls = {
        'google': 'https://www.googleapis.com/oauth2/v2/userinfo',
        'github': 'https://api.github.com/user',
        'gitlab': 'https://gitlab.com/api/v4/user',
        'bitbucket': 'https://api.bitbucket.org/2.0/user'
    }
    
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }
    
    response = requests.get(user_info_urls.get(provider, ''), headers=headers)
    response.raise_for_status()
    
    return response.json()


def create_or_get_user_from_social(provider, user_info):
    """Create or get user from social account information"""
    from django.contrib.auth import get_user_model
    from allauth.socialaccount.models import SocialAccount
    
    User = get_user_model()
    
    # Extract user data based on provider
    email = user_info.get('email', '')
    name = user_info.get('name', '') or user_info.get('login', '')
    username = user_info.get('login', '') or email.split('@')[0] if email else ''
    
    # Split name into first and last name
    if ' ' in name:
        first_name, last_name = name.split(' ', 1)
    else:
        first_name, last_name = name, ''
    
    # Get or create user
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'username': username,
            'first_name': first_name,
            'last_name': last_name,
            'is_active': True,
        }
    )
    
    # Create or update social account
    SocialAccount.objects.update_or_create(
        user=user,
        provider=provider,
        defaults={
            'uid': str(user_info.get('id', '')),
            'extra_data': user_info,
        }
    )
    
    return user, created


@api_view(['GET'])
@permission_classes([AllowAny])
def social_providers(request):
    """Get list of available social providers"""
    providers = [
        {
            'name': 'Google',
            'provider': 'google',
            'icon': 'google',
            'color': '#4285f4'
        },
        {
            'name': 'GitHub',
            'provider': 'github',
            'icon': 'github',
            'color': '#333333'
        },
        {
            'name': 'GitLab',
            'provider': 'gitlab',
            'icon': 'gitlab',
            'color': '#fc6d26'
        },
        {
            'name': 'Bitbucket',
            'provider': 'bitbucket',
            'icon': 'bitbucket',
            'color': '#0052cc'
        }
    ]
    
    return JsonResponse({'providers': providers})


from urllib.parse import urlencode
