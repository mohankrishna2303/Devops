import requests
import base64
from typing import Optional

class GitHubService:
    def __init__(self, token: str):
        self.token = token
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json"
        }
    
    def create_repository(self, repo_name: str, description: str = "") -> dict:
        """Create a new GitHub repository"""
        url = f"{self.base_url}/user/repos"
        payload = {
            "name": repo_name,
            "description": description,
            "private": False,
            "auto_init": True
        }
        
        response = requests.post(url, json=payload, headers=self.headers)
        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Failed to create repo: {response.text}")
    
    def push_file(self, owner: str, repo: str, file_path: str, content: str, commit_message: str):
        """Push a file to GitHub repository"""
        url = f"{self.base_url}/repos/{owner}/{repo}/contents/{file_path}"
        
        file_content = base64.b64encode(content.encode()).decode()
        payload = {
            "message": commit_message,
            "content": file_content
        }
        
        response = requests.put(url, json=payload, headers=self.headers)
        if response.status_code in [201, 200]:
            return response.json()
        else:
            raise Exception(f"Failed to push file: {response.text}")
    
    def create_pull_request(self, owner: str, repo: str, title: str, body: str, head: str, base: str = "main"):
        """Create a pull request"""
        url = f"{self.base_url}/repos/{owner}/{repo}/pulls"
        payload = {
            "title": title,
            "body": body,
            "head": head,
            "base": base
        }
        
        response = requests.post(url, json=payload, headers=self.headers)
        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Failed to create PR: {response.text}")
    
    def get_repository(self, owner: str, repo: str) -> dict:
        """Get repository information"""
        url = f"{self.base_url}/repos/{owner}/{repo}"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to get repo: {response.text}")