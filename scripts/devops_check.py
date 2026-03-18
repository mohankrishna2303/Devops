import os
import sys
import platform
import subprocess
import time

def check_python():
    print(f"Python Version: {sys.version}")

def check_os():
    print(f"OS: {platform.system()} {platform.release()}")

def check_git():
    try:
        git_ver = subprocess.check_output(["git", "--version"], text=True)
        print(f"Git: {git_ver.strip()}")
    except:
        print("Git: Not Found")

def check_docker():
    try:
        docker_ver = subprocess.check_output(["docker", "--version"], text=True)
        print(f"Docker: {docker_ver.strip()}")
    except:
        print("Docker: Not Found")

def check_terraform():
    try:
        tf_ver = subprocess.check_output(["terraform", "--version"], text=True)
        print(f"Terraform: {tf_ver.splitlines()[0]}")
    except:
        print("Terraform: Not Found")

def check_k8s():
    try:
        k8s_ver = subprocess.check_output(["kubectl", "version", "--client"], text=True)
        print(f"Kubernetes CLI: {k8s_ver.splitlines()[0]}")
    except:
        print("Kubernetes CLI: Not Found")

print("🚀 BRAIN DEVOPS - SYSTEM HEALTH CHECK")
print("-" * 50)
check_python()
check_os()
check_git()
check_docker()
check_terraform()
check_k8s()
print("-" * 50)
print(f"Check completed at {time.strftime('%Y-%m-%d %H:%M:%S')}")
