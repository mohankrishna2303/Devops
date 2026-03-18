// Terraform Integration Service for DevOps Dashboard

class TerraformService {
  constructor() {
    this.apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    this.isInitialized = false;
  }

  // Initialize Terraform service
  async initialize() {
    try {
      const response = await fetch(`${this.apiURL}/terraform/init`, { method: 'POST' });
      if (response.ok) {
        this.isInitialized = true;
        console.log('Terraform service initialized');
        return true;
      }
      throw new Error('Terraform initialization failed');
    } catch (error) {
      console.error('Terraform init error:', error);
      throw error;
    }
  }

  // Generate Terraform configuration
  async generateConfig(projectData, cloudProvider) {
    try {
      const response = await fetch(`${this.apiURL}/terraform/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: projectData,
          provider: cloudProvider,
          resources: this.getResourcesForProvider(cloudProvider, projectData)
        })
      });

      if (!response.ok) throw new Error('Failed to generate Terraform config');

      const config = await response.json();
      return config;
    } catch (error) {
      console.error('Generate Terraform config error:', error);
      throw error;
    }
  }

  // Get resources based on cloud provider
  getResourcesForProvider(provider, projectData) {
    const baseResources = {
      vpc: {
        cidr_block: '10.0.0.0/16',
        enable_dns_hostnames: true,
        enable_dns_support: true
      },
      subnet: {
        cidr_block: '10.0.1.0/24',
        availability_zone: 'us-west-2a'
      },
      security_group: {
        description: `${projectData.name} security group`,
        ingress: [
          { protocol: 'tcp', from_port: 80, to_port: 80, cidr_blocks: ['0.0.0.0/0'] },
          { protocol: 'tcp', from_port: 443, to_port: 443, cidr_blocks: ['0.0.0.0/0'] },
          { protocol: 'tcp', from_port: 22, to_port: 22, cidr_blocks: ['0.0.0.0/0'] }
        ]
      }
    };

    switch (provider) {
      case 'aws':
        return {
          ...baseResources,
          ec2_instance: {
            ami: 'ami-0c55b159cbfafe1f0',
            instance_type: 't3.micro',
            key_name: `${projectData.name}-key`,
            user_data: this.generateUserData(projectData)
          },
          rds_instance: {
            engine: 'postgres',
            engine_version: '13.7',
            instance_class: 'db.t3.micro',
            allocated_storage: 20,
            username: 'admin',
            password: 'changeme123'
          },
          s3_bucket: {
            bucket: `${projectData.name.toLowerCase().replace(/\s+/g, '-')}-storage`,
            acl: 'private'
          }
        };

      case 'azure':
        return {
          resource_group: {
            name: `${projectData.name}-rg`,
            location: 'East US'
          },
          virtual_network: {
            name: `${projectData.name}-vnet`,
            address_space: ['10.0.0.0/16']
          },
          subnet: {
            name: `${projectData.name}-subnet`,
            virtual_network_name: `${projectData.name}-vnet`,
            address_prefixes: ['10.0.1.0/24']
          },
          linux_virtual_machine: {
            name: `${projectData.name}-vm`,
            size: 'Standard_B1s',
            admin_username: 'adminuser',
            admin_password: 'Password123!'
          },
          sql_database: {
            name: `${projectData.name}-db`,
            sku_name: 'Basic'
          }
        };

      case 'gcp':
        return {
          compute_instance: {
            name: `${projectData.name}-instance`,
            machine_type: 'e2-micro',
            zone: 'us-central1-a',
            boot_disk: {
              initialize_params: {
                image: 'debian-cloud/debian-11'
              }
            },
            network_interface: {
              network: 'default'
            }
          },
          sql_database_instance: {
            name: `${projectData.name}-db`,
            database_version: 'POSTGRES_13',
            region: 'us-central1',
            settings: {
              tier: 'db-f1-micro'
            }
          },
          storage_bucket: {
            name: `${projectData.name.toLowerCase().replace(/\s+/g, '-')}-storage`,
            location: 'US'
          }
        };

      default:
        return baseResources;
    }
  }

  // Generate user data for cloud instances
  generateUserData(projectData) {
    return `#!/bin/bash
# Auto-configuration for ${projectData.name}
yum update -y
yum install -y docker git nginx

# Start Docker
systemctl start docker
systemctl enable docker

# Clone repository
git clone ${projectData.repositoryUrl || 'https://github.com/example/app.git'} /opt/app
cd /opt/app

# Build and run application
docker build -t ${projectData.name} .
docker run -d -p 80:3000 --name ${projectData.name} ${projectData.name}

# Configure nginx
cat > /etc/nginx/conf.d/${projectData.name}.conf << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

systemctl restart nginx
systemctl enable nginx
`;
  }

  // Validate Terraform configuration
  async validateConfig(config) {
    try {
      const response = await fetch(`${this.apiURL}/terraform/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config })
      });

      if (!response.ok) throw new Error('Failed to validate Terraform config');

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Validate Terraform config error:', error);
      throw error;
    }
  }

  // Plan Terraform deployment
  async planDeployment(config, workspace = 'default') {
    try {
      const response = await fetch(`${this.apiURL}/terraform/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          workspace,
          variables: this.extractVariables(config)
        })
      });

      if (!response.ok) throw new Error('Failed to create Terraform plan');

      const plan = await response.json();
      return plan;
    } catch (error) {
      console.error('Terraform plan error:', error);
      throw error;
    }
  }

  // Apply Terraform configuration
  async applyConfig(config, workspace = 'default') {
    try {
      const response = await fetch(`${this.apiURL}/terraform/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          workspace,
          auto_approve: true
        })
      });

      if (!response.ok) throw new Error('Failed to apply Terraform config');

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Terraform apply error:', error);
      throw error;
    }
  }

  // Destroy infrastructure
  async destroyInfrastructure(config, workspace = 'default') {
    try {
      const response = await fetch(`${this.apiURL}/terraform/destroy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          workspace,
          auto_approve: true
        })
      });

      if (!response.ok) throw new Error('Failed to destroy infrastructure');

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Terraform destroy error:', error);
      throw error;
    }
  }

  // Get Terraform state
  async getState(workspace = 'default') {
    try {
      const response = await fetch(`${this.apiURL}/terraform/state/${workspace}`);
      if (!response.ok) throw new Error('Failed to get Terraform state');
      return await response.json();
    } catch (error) {
      console.error('Get Terraform state error:', error);
      throw error;
    }
  }

  // Import existing infrastructure
  async importInfrastructure(resources) {
    try {
      const response = await fetch(`${this.apiURL}/terraform/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resources })
      });

      if (!response.ok) throw new Error('Failed to import infrastructure');

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Import infrastructure error:', error);
      throw error;
    }
  }

  // Extract variables from Terraform config
  extractVariables(config) {
    const variables = {};

    // Extract AWS variables
    if (config.includes('aws')) {
      variables.aws_region = 'us-west-2';
      variables.aws_access_key = process.env.AWS_ACCESS_KEY_ID;
      variables.aws_secret_key = process.env.AWS_SECRET_ACCESS_KEY;
    }

    // Extract Azure variables
    if (config.includes('azurerm')) {
      variables.azure_subscription_id = process.env.AZURE_SUBSCRIPTION_ID;
      variables.azure_client_id = process.env.AZURE_CLIENT_ID;
      variables.azure_client_secret = process.env.AZURE_CLIENT_SECRET;
      variables.azure_tenant_id = process.env.AZURE_TENANT_ID;
    }

    // Extract GCP variables
    if (config.includes('google')) {
      variables.gcp_project = process.env.GCP_PROJECT_ID;
      variables.gcp_credentials = process.env.GCP_CREDENTIALS;
      variables.gcp_region = 'us-central1';
    }

    return variables;
  }

  // Generate complete Terraform files
  async generateTerraformFiles(projectData, cloudProvider) {
    try {
      const config = await this.generateConfig(projectData, cloudProvider);

      const files = {
        'main.tf': this.generateMainTf(config, cloudProvider),
        'variables.tf': this.generateVariablesTf(cloudProvider),
        'outputs.tf': this.generateOutputsTf(cloudProvider),
        'provider.tf': this.generateProviderTf(cloudProvider),
        'README.md': this.generateTerraformReadme(projectData, cloudProvider)
      };

      return files;
    } catch (error) {
      console.error('Generate Terraform files error:', error);
      throw error;
    }
  }

  // Generate main.tf content
  generateMainTf(config, provider) {
    switch (provider) {
      case 'aws':
        return `
# AWS Resources for ${config.project.name}

resource "aws_vpc" "main" {
  cidr_block           = "${config.resources.vpc.cidr_block}"
  enable_dns_hostnames = ${config.resources.vpc.enable_dns_hostnames}
  enable_dns_support   = ${config.resources.vpc.enable_dns_support}

  tags = {
    Name = "${config.project.name}-vpc"
  }
}

resource "aws_subnet" "main" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "${config.resources.subnet.cidr_block}"
  availability_zone       = "${config.resources.subnet.availability_zone}"
  map_public_ip_on_launch = true

  tags = {
    Name = "${config.project.name}-subnet"
  }
}

resource "aws_security_group" "main" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${config.project.name}-sg"
  }
}

resource "aws_instance" "main" {
  ami                    = "${config.resources.ec2_instance.ami}"
  instance_type          = "${config.resources.ec2_instance.instance_type}"
  key_name               = "${config.resources.ec2_instance.key_name}"
  vpc_security_group_ids = [aws_security_group.main.id]
  subnet_id              = aws_subnet.main.id
  user_data              = <<-EOF
${config.resources.ec2_instance.user_data}
  EOF

  tags = {
    Name = "${config.project.name}-instance"
  }
}

resource "aws_db_instance" "main" {
  engine                 = "${config.resources.rds_instance.engine}"
  engine_version         = "${config.resources.rds_instance.engine_version}"
  instance_class         = "${config.resources.rds_instance.instance_class}"
  allocated_storage      = "${config.resources.rds_instance.allocated_storage}"
  username               = "${config.resources.rds_instance.username}"
  password               = "${config.resources.rds_instance.password}"
  vpc_security_group_ids = [aws_security_group.main.id]
  skip_final_snapshot    = true

  tags = {
    Name = "${config.project.name}-db"
  }
}

resource "aws_s3_bucket" "main" {
  bucket = "${config.resources.s3_bucket.bucket}"
  acl    = "${config.resources.s3_bucket.acl}"

  tags = {
    Name = "${config.project.name}-storage"
  }
}
`;

      case 'azure':
        return `
# Azure Resources for ${config.project.name}

resource "azurerm_resource_group" "main" {
  name     = "${config.resources.resource_group.name}"
  location = "${config.resources.resource_group.location}"
}

resource "azurerm_virtual_network" "main" {
  name                = "${config.resources.virtual_network.name}"
  address_space       = ${JSON.stringify(config.resources.virtual_network.address_space)}
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "main" {
  name                 = "${config.resources.subnet.name}"
  resource_group_name = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ${JSON.stringify(config.resources.subnet.address_prefixes)}
}

resource "azurerm_network_security_group" "main" {
  name                = "${config.project.name}-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  security_rule {
    name                       = "HTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTPS"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_linux_virtual_machine" "main" {
  name                  = "${config.resources.linux_virtual_machine.name}"
  resource_group_name   = azurerm_resource_group.main.name
  location              = azurerm_resource_group.main.location
  size                  = "${config.resources.linux_virtual_machine.size}"
  admin_username        = "${config.resources.linux_virtual_machine.admin_username}"
  admin_password        = "${config.resources.linux_virtual_machine.admin_password}"
  disable_password_authentication = false

  network_interface_ids = [
    azurerm_network_interface.main.id,
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
}
`;

      case 'gcp':
        return `
# GCP Resources for ${config.project.name}

resource "google_compute_instance" "main" {
  name         = "${config.resources.compute_instance.name}"
  machine_type = "${config.resources.compute_instance.machine_type}"
  zone         = "${config.resources.compute_instance.zone}"

  boot_disk {
    initialize_params {
      image = "${config.resources.compute_instance.boot_disk.initialize_params.image}"
    }
  }

  network_interface {
    network = "default"
  }

  metadata = {
    ssh-keys = "user:${file("~/.ssh/id_rsa.pub")}"
  }
}

resource "google_sql_database_instance" "main" {
  name             = "${config.resources.sql_database_instance.name}"
  database_version = "${config.resources.sql_database_instance.database_version}"
  region           = "${config.resources.sql_database_instance.region}"

  settings {
    tier = "${config.resources.sql_database_instance.settings.tier}"
  }
}

resource "google_storage_bucket" "main" {
  name          = "${config.resources.storage_bucket.name}"
  location      = "${config.resources.storage_bucket.location}"
  force_destroy = true
}
`;

      default:
        return '# No provider specified';
    }
  }

  // Generate variables.tf content
  generateVariablesTf(provider) {
    return `
# Variables for ${provider.toUpperCase()} deployment

variable "region" {
  description = "The region where resources will be deployed"
  type        = string
  default     = "${this.getDefaultRegion(provider)}"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}
`;
  }

  // Generate outputs.tf content
  generateOutputsTf(provider) {
    return `
# Outputs for ${provider.toUpperCase()} deployment

output "instance_public_ip" {
  description = "Public IP address of the main instance"
  value       = ${this.getInstanceOutput(provider)}
}

output "database_endpoint" {
  description = "Database connection endpoint"
  value       = ${this.getDatabaseOutput(provider)}
}

output "storage_bucket_name" {
  description = "Name of the storage bucket"
  value       = ${this.getStorageOutput(provider)}
}
`;
  }

  // Generate provider.tf content
  generateProviderTf(provider) {
    switch (provider) {
      case 'aws':
        return `
# AWS Provider

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}
`;
      case 'azure':
        return `
# Azure Provider

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}
`;
      case 'gcp':
        return `
# GCP Provider

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
`;
      default:
        return '# No provider specified';
    }
  }

  // Generate Terraform README
  generateTerraformReadme(projectData, provider) {
    return `# ${projectData.name} - Terraform Configuration

This Terraform configuration deploys a complete ${provider.toUpperCase()} infrastructure for ${projectData.name}.

## Infrastructure Components

- **VPC/Virtual Network**: Isolated network environment
- **Subnet**: Public subnet for application servers
- **Security Group/NSG**: Firewall rules for network security
- **Compute Instance**: Application server with auto-configuration
- **Database**: Managed database service
- **Storage**: Object storage for assets and backups

## Quick Start

1. Initialize Terraform:
   \`\`\`bash
   terraform init
   \`\`\`

2. Plan the deployment:
   \`\`\`bash
   terraform plan
   \`\`\`

3. Apply the configuration:
   \`\`\`bash
   terraform apply
   \`\`\`

## Variables

- \`region\`: Deployment region
- \`project_name\`: Name of the project
- \`environment\`: Deployment environment

## Outputs

- \`instance_public_ip\`: Public IP of the application server
- \`database_endpoint\`: Database connection endpoint
- \`storage_bucket_name\`: Name of the storage bucket

## Provider Configuration

Make sure you have configured your ${provider.toUpperCase()} credentials:

### AWS
\`\`\`bash
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
\`\`\`

### Azure
\`\`\`bash
export ARM_CLIENT_ID="your_client_id"
export ARM_CLIENT_SECRET="your_client_secret"
export ARM_SUBSCRIPTION_ID="your_subscription_id"
export ARM_TENANT_ID="your_tenant_id"
\`\`\`

### GCP
\`\`\`bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"
\`\`\`

## Auto-Integration

This configuration includes:
- Automatic application deployment
- Database initialization
- Security group configuration
- Monitoring and logging setup

## Support

For issues or questions, please check the DevOps Dashboard or contact your infrastructure team.
`;
  }

  // Helper methods
  getDefaultRegion(provider) {
    const regions = {
      aws: 'us-west-2',
      azure: 'East US',
      gcp: 'us-central1'
    };
    return regions[provider] || 'us-west-2';
  }

  getInstanceOutput(provider) {
    switch (provider) {
      case 'aws':
        return 'aws_instance.main.public_ip';
      case 'azure':
        return 'azurerm_linux_virtual_machine.main.public_ip_address';
      case 'gcp':
        return 'google_compute_instance.main.network_interface[0].access_config[0].nat_ip';
      default:
        return 'null';
    }
  }

  getDatabaseOutput(provider) {
    switch (provider) {
      case 'aws':
        return 'aws_db_instance.main.endpoint';
      case 'azure':
        return 'azurerm_sql_database.main.fully_qualified_domain_name';
      case 'gcp':
        return 'google_sql_database_instance.main.public_ip_address';
      default:
        return 'null';
    }
  }

  getStorageOutput(provider) {
    switch (provider) {
      case 'aws':
        return 'aws_s3_bucket.main.bucket';
      case 'azure':
        return 'azurerm_storage_account.main.name';
      case 'gcp':
        return 'google_storage_bucket.main.name';
      default:
        return 'null';
    }
  }
}

export const terraformService = new TerraformService();
export default terraformService;
