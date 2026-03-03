"""
Kubernetes integration service — covers cluster fleet, workloads, pods,
namespaces, scaling, YAML apply, and log retrieval.

Real operations require the `kubernetes` Python package and a valid kubeconfig.
All methods gracefully fall back to simulated DB-backed data when no real
cluster is reachable.
"""
import os
import random
import uuid as _uuid
from datetime import datetime, timedelta


class K8sService:
    # ── Low-level client helpers ──────────────────────────────────────────────

    @staticmethod
    def get_client():
        """Return (AppsV1Api, CoreV1Api) or (None, None) when unavailable."""
        try:
            from kubernetes import client, config
            try:
                config.load_kube_config()
            except Exception:
                config.load_incluster_config()
            return client.AppsV1Api(), client.CoreV1Api()
        except Exception:
            return None, None

    # ── Seed demo data ────────────────────────────────────────────────────────

    @staticmethod
    def _seed_demo_data(org):
        """Populate demo clusters, namespaces, workloads and pods if empty."""
        from api.models import K8sCluster, K8sNamespace, K8sWorkload, K8sPod

        clusters_data = [
            {"name": "prod-cluster-eks", "region": "us-east-1", "provider": "EKS",
             "version": "1.29", "nodes": 8, "pods": 142, "health_score": 98,
             "cpu_usage": 64.5, "mem_usage": 71.2, "status": "Healthy"},
            {"name": "staging-cluster-gke", "region": "eu-central-1", "provider": "GKE",
             "version": "1.28", "nodes": 3, "pods": 45, "health_score": 100,
             "cpu_usage": 38.1, "mem_usage": 44.7, "status": "Healthy"},
            {"name": "dev-cluster-local", "region": "local", "provider": "minikube",
             "version": "1.29", "nodes": 1, "pods": 12, "health_score": 87,
             "cpu_usage": 82.3, "mem_usage": 55.0, "status": "Warning"},
        ]

        namespaces_data = ["default", "kube-system", "monitoring", "staging", "production", "logging"]

        workloads_data = [
            {"name": "api-server", "kind": "Deployment", "ns": "production",
             "image": "myapp/api:v2.4.1", "replicas": 3, "ready": 3, "status": "Running",
             "cpu": "500m", "mem": "512Mi"},
            {"name": "frontend-app", "kind": "Deployment", "ns": "production",
             "image": "myapp/frontend:v1.8.0", "replicas": 2, "ready": 2, "status": "Running",
             "cpu": "250m", "mem": "256Mi"},
            {"name": "worker-queue", "kind": "Deployment", "ns": "production",
             "image": "myapp/worker:v1.2.3", "replicas": 5, "ready": 4, "status": "Running",
             "cpu": "200m", "mem": "384Mi"},
            {"name": "postgres-db", "kind": "StatefulSet", "ns": "default",
             "image": "postgres:15.2", "replicas": 1, "ready": 1, "status": "Running",
             "cpu": "1000m", "mem": "1Gi"},
            {"name": "redis-cache", "kind": "StatefulSet", "ns": "default",
             "image": "redis:7.2", "replicas": 1, "ready": 1, "status": "Running",
             "cpu": "200m", "mem": "256Mi"},
            {"name": "log-collector", "kind": "DaemonSet", "ns": "logging",
             "image": "fluent/fluentd:v1.16", "replicas": 8, "ready": 8, "status": "Running",
             "cpu": "100m", "mem": "128Mi"},
            {"name": "prometheus", "kind": "Deployment", "ns": "monitoring",
             "image": "prom/prometheus:v2.49", "replicas": 1, "ready": 1, "status": "Running",
             "cpu": "300m", "mem": "512Mi"},
            {"name": "grafana", "kind": "Deployment", "ns": "monitoring",
             "image": "grafana/grafana:10.3", "replicas": 1, "ready": 1, "status": "Running",
             "cpu": "200m", "mem": "256Mi"},
            {"name": "auth-service", "kind": "Deployment", "ns": "production",
             "image": "myapp/auth:v0.9.1", "replicas": 2, "ready": 1, "status": "Pending",
             "cpu": "300m", "mem": "256Mi"},
            {"name": "cronjob-backup", "kind": "CronJob", "ns": "default",
             "image": "myapp/backup:v1.0", "replicas": 1, "ready": 0, "status": "Running",
             "cpu": "100m", "mem": "64Mi"},
        ]

        created_clusters = []
        for cd in clusters_data:
            c, _ = K8sCluster.objects.get_or_create(
                org=org, name=cd["name"],
                defaults={
                    "region": cd["region"], "provider": cd["provider"],
                    "version": cd["version"], "nodes": cd["nodes"], "pods": cd["pods"],
                    "health_score": cd["health_score"], "cpu_usage": cd["cpu_usage"],
                    "mem_usage": cd["mem_usage"], "status": cd["status"],
                }
            )
            created_clusters.append(c)

        if not created_clusters:
            return

        prod_cluster = created_clusters[0]

        # Namespaces
        for ns_name in namespaces_data:
            K8sNamespace.objects.get_or_create(
                cluster=prod_cluster, name=ns_name,
                defaults={"status": "Active", "pod_count": random.randint(2, 30)}
            )

        # Workloads
        for wd in workloads_data:
            workload, _ = K8sWorkload.objects.get_or_create(
                cluster=prod_cluster, name=wd["name"], namespace=wd["ns"],
                defaults={
                    "kind": wd["kind"], "image": wd["image"],
                    "replicas": wd["replicas"], "ready_replicas": wd["ready"],
                    "status": wd["status"], "cpu_request": wd["cpu"], "mem_request": wd["mem"],
                }
            )
            # Seed pods per workload
            statuses = ["Running"] * wd["ready"] + ["Pending"] * (wd["replicas"] - wd["ready"])
            for i, pod_status in enumerate(statuses):
                K8sPod.objects.get_or_create(
                    cluster=prod_cluster,
                    name=f"{wd['name']}-{_uuid.uuid4().hex[:6]}",
                    defaults={
                        "workload": workload,
                        "namespace": wd["ns"],
                        "node": f"node-{random.randint(1, 8)}",
                        "status": pod_status,
                        "restarts": random.randint(0, 5),
                        "cpu_usage": f"{random.randint(10, 800)}m",
                        "mem_usage": f"{random.randint(64, 512)}Mi",
                        "age_seconds": random.randint(3600, 86400 * 30),
                        "logs": K8sService._generate_mock_logs(wd["name"]),
                    }
                )

    @staticmethod
    def _generate_mock_logs(name):
        ts = datetime.utcnow()
        lines = [
            f"[{(ts - timedelta(seconds=300)).strftime('%H:%M:%S')}] INFO  {name} - Application started successfully",
            f"[{(ts - timedelta(seconds=240)).strftime('%H:%M:%S')}] INFO  {name} - Listening on :8080",
            f"[{(ts - timedelta(seconds=180)).strftime('%H:%M:%S')}] INFO  {name} - Health check passed",
            f"[{(ts - timedelta(seconds=120)).strftime('%H:%M:%S')}] DEBUG {name} - Processing request from 10.0.0.{random.randint(1,255)}",
            f"[{(ts - timedelta(seconds=60)).strftime('%H:%M:%S')}]  INFO  {name} - Response: 200 OK in {random.randint(12,150)}ms",
            f"[{ts.strftime('%H:%M:%S')}] INFO  {name} - Metrics exported to /metrics",
        ]
        return "\n".join(lines)

    # ── Public API ────────────────────────────────────────────────────────────

    @staticmethod
    def get_cluster_metrics():
        """Return all clusters with full metrics."""
        from api.models import Organization, K8sCluster
        org = Organization.objects.first()
        if not org:
            return []
        if not K8sCluster.objects.filter(org=org).exists():
            K8sService._seed_demo_data(org)
        clusters = K8sCluster.objects.filter(org=org)
        return [
            {
                "id": str(c.id), "name": c.name, "region": c.region,
                "provider": c.provider, "version": c.version,
                "nodes": c.nodes, "pods": c.pods,
                "cpu_usage": c.cpu_usage, "mem_usage": c.mem_usage,
                "health": f"{c.health_score}%", "health_score": c.health_score,
                "status": c.status,
                "workload_count": c.workloads.count(),
                "namespace_count": c.namespaces.count(),
            }
            for c in clusters
        ]

    @staticmethod
    def get_namespaces(cluster_id=None):
        """Return namespaces for a cluster (or the first cluster)."""
        from api.models import K8sCluster, K8sNamespace
        if cluster_id:
            try:
                cluster = K8sCluster.objects.get(id=cluster_id)
            except K8sCluster.DoesNotExist:
                return []
        else:
            cluster = K8sCluster.objects.first()
        if not cluster:
            return []
        return [
            {
                "id": str(ns.id), "name": ns.name, "status": ns.status,
                "pod_count": ns.pod_count, "cluster": cluster.name,
            }
            for ns in cluster.namespaces.all()
        ]

    @staticmethod
    def get_workloads(cluster_id=None, namespace=None):
        """Return workloads filtered optionally by cluster and namespace."""
        from api.models import K8sCluster, K8sWorkload
        qs = K8sWorkload.objects.all()
        if cluster_id:
            qs = qs.filter(cluster_id=cluster_id)
        elif K8sCluster.objects.exists():
            qs = qs.filter(cluster=K8sCluster.objects.first())
        if namespace:
            qs = qs.filter(namespace=namespace)
        return [
            {
                "id": str(w.id), "name": w.name, "kind": w.kind,
                "namespace": w.namespace, "image": w.image,
                "replicas": w.replicas, "ready_replicas": w.ready_replicas,
                "status": w.status, "cpu_request": w.cpu_request,
                "mem_request": w.mem_request,
                "cluster": w.cluster.name,
            }
            for w in qs
        ]

    @staticmethod
    def get_pods(cluster_id=None, namespace=None, workload_id=None):
        """Return pods filtered by cluster/namespace/workload."""
        from api.models import K8sCluster, K8sPod
        qs = K8sPod.objects.all()
        if cluster_id:
            qs = qs.filter(cluster_id=cluster_id)
        elif K8sCluster.objects.exists():
            qs = qs.filter(cluster=K8sCluster.objects.first())
        if namespace:
            qs = qs.filter(namespace=namespace)
        if workload_id:
            qs = qs.filter(workload_id=workload_id)
        return [
            {
                "id": str(p.id), "name": p.name, "namespace": p.namespace,
                "node": p.node, "status": p.status, "restarts": p.restarts,
                "cpu_usage": p.cpu_usage, "mem_usage": p.mem_usage,
                "age_seconds": p.age_seconds,
                "workload": p.workload.name if p.workload else "—",
            }
            for p in qs
        ]

    @staticmethod
    def get_pod_logs(pod_id):
        """Return stored logs for a pod (or fetch from k8s API)."""
        from api.models import K8sPod
        try:
            pod = K8sPod.objects.get(id=pod_id)
            if pod.logs:
                return {"pod": pod.name, "logs": pod.logs}
            # Try real k8s
            _, v1 = K8sService.get_client()
            if v1:
                try:
                    log = v1.read_namespaced_pod_log(name=pod.name, namespace=pod.namespace, tail_lines=100)
                    return {"pod": pod.name, "logs": log}
                except Exception:
                    pass
            return {"pod": pod.name, "logs": K8sService._generate_mock_logs(pod.name)}
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def scale_workload(workload_id, replicas):
        """Scale a workload to the requested replica count."""
        from api.models import K8sWorkload
        try:
            workload = K8sWorkload.objects.get(id=workload_id)
            old = workload.replicas
            workload.replicas = replicas
            workload.ready_replicas = replicas  # Optimistic for demo
            workload.save()
            # Try real k8s scale
            apps_v1, _ = K8sService.get_client()
            if apps_v1:
                try:
                    apps_v1.patch_namespaced_deployment_scale(
                        name=workload.name, namespace=workload.namespace,
                        body={"spec": {"replicas": replicas}}
                    )
                except Exception:
                    pass
            return {
                "status": "scaled",
                "workload": workload.name,
                "old_replicas": old,
                "new_replicas": replicas,
            }
        except K8sWorkload.DoesNotExist:
            return {"error": "Workload not found"}

    @staticmethod
    def deploy_workload(payload):
        """Create or update a workload from a payload dict."""
        from api.models import K8sCluster, K8sWorkload
        cluster = K8sCluster.objects.first()
        if not cluster:
            return {"error": "No cluster available"}
        workload = K8sWorkload.objects.create(
            cluster=cluster,
            name=payload.get("name", "new-deployment"),
            kind=payload.get("kind", "Deployment"),
            namespace=payload.get("namespace", "default"),
            image=payload.get("image", "nginx:latest"),
            replicas=payload.get("replicas", 1),
            ready_replicas=0,
            status="Pending",
            cpu_request=payload.get("cpu_request", "100m"),
            mem_request=payload.get("mem_request", "128Mi"),
        )
        return {
            "status": "created",
            "id": str(workload.id),
            "name": workload.name,
            "namespace": workload.namespace,
        }

    @staticmethod
    def delete_workload(workload_id):
        """Delete a workload and its pods."""
        from api.models import K8sWorkload
        try:
            workload = K8sWorkload.objects.get(id=workload_id)
            name = workload.name
            workload.delete()
            return {"status": "deleted", "workload": name}
        except K8sWorkload.DoesNotExist:
            return {"error": "Workload not found"}

    @staticmethod
    def apply_deployment(yaml_content, namespace="default"):
        """Apply raw Kubernetes YAML."""
        apps_v1, _ = K8sService.get_client()
        if not apps_v1:
            return {"status": "simulated", "message": "K8s client not configured; YAML accepted for demo."}
        try:
            import yaml
            from kubernetes.utils import create_from_dict
            from kubernetes import client
            data = yaml.safe_load(yaml_content)
            create_from_dict(client.ApiClient(), data, namespace=namespace)
            return {"status": "success", "namespace": namespace}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    def get_live_telemetry():
        """Simulated live cluster observability metrics."""
        return {
            "avg_latency": f"{random.randint(80, 250)}ms",
            "cpu_usage": f"{random.randint(30, 88)}%",
            "mem_usage": f"{random.randint(40, 85)}%",
            "db_connections": f"{random.randint(10, 45)}/100",
            "error_rate": f"{round(random.uniform(0.01, 0.7), 2)}%",
            "network_in": f"{random.randint(50, 500)} Mbps",
            "network_out": f"{random.randint(20, 300)} Mbps",
            "pod_restarts_1h": random.randint(0, 15),
        }

    @staticmethod
    def get_events(cluster_id=None):
        """Return simulated Kubernetes cluster events."""
        events = [
            {"type": "Normal", "reason": "Pulled", "object": "pod/api-server-abc123",
             "message": "Successfully pulled image myapp/api:v2.4.1", "age": "2m"},
            {"type": "Normal", "reason": "Started", "object": "pod/api-server-abc123",
             "message": "Started container api-server", "age": "2m"},
            {"type": "Warning", "reason": "BackOff", "object": "pod/auth-service-xyz789",
             "message": "Back-off restarting failed container auth-service", "age": "5m"},
            {"type": "Normal", "reason": "Scaled", "object": "deployment/api-server",
             "message": "Scaled deployment api-server from 2 to 3", "age": "10m"},
            {"type": "Normal", "reason": "EnsuringLoadBalancer", "object": "service/api-server-svc",
             "message": "Ensuring load balancer for service", "age": "12m"},
            {"type": "Warning", "reason": "NodeUsage", "object": "node/node-3",
             "message": "CPU usage above 85% threshold", "age": "15m"},
            {"type": "Normal", "reason": "NodeReady", "object": "node/node-1",
             "message": "Node node-1 is ready", "age": "1h"},
        ]
        return events
