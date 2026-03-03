# BrainDevOps Terraform Configuration
# Infrastructure as Code for the CI/CD Platform

terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC for the Platform
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  
  tags = {
    Name = "braindevops-vpc"
    Env  = var.environment
  }
}

# EKS Cluster for Hosting Services
resource "aws_eks_cluster" "platform" {
  name     = "braindevops-cluster-${var.environment}"
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    subnet_ids = aws_subnet.private[*].id
  }
}

# S3 Bucket for Storing Pipeline Artifacts
resource "aws_s3_bucket" "artifacts" {
  bucket = "braindevops-artifacts-${var.environment}-${random_id.suffix.hex}"
  
  tags = {
    Name        = "Pipeline Artifacts"
    Environment = var.environment
  }
}

resource "random_id" "suffix" {
  byte_length = 4
}
