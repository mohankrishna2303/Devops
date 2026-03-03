output "vpc_id" {
  value = aws_vpc.main.id
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.platform.endpoint
}

output "artifact_bucket_name" {
  value = aws_s3_bucket.artifacts.id
}
