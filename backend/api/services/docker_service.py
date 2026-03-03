"""
Docker integration: build images, push to registry, run containers.
Option A: subprocess.run(['docker', 'build', ...])
Option B: Docker SDK for Python (pip install docker)
"""
import os
import subprocess


class DockerService:
    @staticmethod
    def build_image(context_path, tag="app:latest", dockerfile_path=None):
        """
        Build Docker image. Requires Docker daemon available.
        context_path: directory containing Dockerfile
        """
        try:
            cmd = ["docker", "build", "-t", tag]
            if dockerfile_path:
                cmd.extend(["-f", dockerfile_path])
            cmd.append(context_path or ".")
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
            if result.returncode == 0:
                return {"status": "success", "tag": tag, "log": result.stdout}
            return {"status": "error", "log": result.stderr or result.stdout}
        except FileNotFoundError:
            return {"status": "error", "message": "Docker CLI not found. Install Docker or use Docker SDK."}
        except subprocess.TimeoutExpired:
            return {"status": "error", "message": "Build timed out."}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def push_image(tag, registry=None):
        """Push image to registry. registry e.g. 'myregistry.io/myapp'."""
        try:
            full_tag = f"{registry}/{tag}" if registry else tag
            result = subprocess.run(
                ["docker", "push", full_tag],
                capture_output=True,
                text=True,
                timeout=300,
            )
            if result.returncode == 0:
                return {"status": "success", "tag": full_tag}
            return {"status": "error", "log": result.stderr or result.stdout}
        except FileNotFoundError:
            return {"status": "error", "message": "Docker CLI not found."}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def build_from_content(dockerfile_content, tag="app:latest"):
        """
        Build image from in-memory Dockerfile content.
        Writes content to temp dir, then runs docker build.
        """
        import tempfile
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, "Dockerfile")
            with open(p, "w") as f:
                f.write(dockerfile_content)
            return DockerService.build_image(d, tag=tag, dockerfile_path=p)
