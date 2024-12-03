# CI/CD Project

## Introduction

This project is an effort to automate a complete CI/CD pipeline from the infrastructure to the configuration using Terraform, Ansible, and GitHub Actions. Currently there is one github action which deploys an AWS EC2 instance, configures it to run Docker, and launches an NGINX server in a container. I intend to keep iterating and improving upon this project.

## Project Structure

```bash
.github/
  └── workflows/
      └── deploy.yml           # Deploys and configures the EC2 machine
ansible/
  ├── install_docker.yml       # Install and configure docker
  ├── run_apache.yml           # Deploy and run nginx in a container
  └── ansible.cfg              # Configuration file
terraform/
  ├── infrastructure/
  │   ├── main.tf              # Provision machine and security groups + rules
  │   ├── outputs.tf           # Outputs the IP of the machine
  ├── backend/
      └── main.tf              # Deploys backend used by the infrastructure (RUN SEPARATELY)
```

## Requirements

1. **AWS Account**

   - Full Access to EC2, S3 buckets and DynamoDB.
   - The security credentials of the account needed by terraform.
   - EC2 security key pair private key.

2. **GitHub Secrets**

   - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` which are part of the account security credentials.
   - `RSA_SECRET_KEY` which is the private key of the EC2 security key pair.

3. **GitHub Variables**

   - `WHITELIST_IP`, this can be either `0.0.0.0/0` (**_ALL_** IPs) or your home/personal IP.

## Workflow Overview

1. **Terraform**

   - Deploys an AWS EC2 instance.
   - Configures a security group for SSH (port 22) and HTTP (port 80) traffic.
   - Outputs the public IP of the instance.

2. **Ansible**

   - Installs Docker and its dependencies.
   - Configures the machine to run NGINX as a Docker container.

3. **GitHub Actions**

   - Automates the workflow, integrating Terraform and Ansible steps.

## How to Use

1. **Fork or Clone the repository**

   - Fork it directly from GitHub.
   - Clone the repository and push it to your own.

2. **Set up the Terraform Backend**

   - Navigate to the `terraform/backend` directory.
   - Initialize Terraform and apply the backend configuration:
     ```bash
     terraform init
     terraform apply --auto-approve
     ```
   - This step sets up the S3 bucket and DynamoDB table for state management.

3. **Set up GitHub Secrets and Variables**

   - Add GitHub action secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `RSA_SECRET_KEY`.
   - Add GitHub variables: `WHITELIST_IP`.

4. **Trigger the Action**

   - Navigate to the Actions tab in your repository on GitHub.
   - Manually dispatch the `Deploy the infrastructure` workflow.

5. **Access the deployed server**
   - Use the public IP outputted by terraform to verify the nginx server.
