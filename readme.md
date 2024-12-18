# CI/CD Project

## Introduction

This project is an effort to automate a complete CI/CD pipeline from the infrastructure to the configuration using Terraform, Ansible, and GitHub Actions. Currently, there is one GitHub Action that deploys an AWS EC2 instance, configures it to run Docker, and launches an NGINX server in a container. Additionally, the project includes a microservices-based application with components for authentication and poll management. These microservices are built as Docker containers and automatically pushed to my Docker Hub repository using dedicated GitHub Actions workflows. The project showcases the integration of modern CI/CD practices with microservices architecture and containerization.

## Project Structure

```bash
.github/
  └── workflows/
      ├── deploy.yml           # Deploys and configures the EC2 machine
      ├── publish-auth.yml     # Publishes the auth service container to Docker Hub
      └── publish-poll.yml     # Publishes the poll service container to Docker Hub
ansible/
  ├── install_docker.yml       # Install and configure docker
  ├── run_apache.yml           # Deploy and run nginx in a container
  └── ansible.cfg              # Configuration file
application/
  ├── auth                     # Authentication microservice source code
  └── poll                     # Polling microservice source code
terraform/
  ├── infrastructure/
  │   ├── main.tf              # Provision machine and security groups + rules
  │   └── outputs.tf           # Outputs the IP of the machine
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
   - Separate workflows for building and deploying the authentication and polling microservices.

## Current Features

1. **Authentication Microservice**

   - Handles user signup, login, and password resets.
   - Utilizes JWT tokens with RS256 algorithm for secure authentication.
   - Packaged and deployed as a Docker container via CI/CD pipeline.

2. **Poll Microservice**

   - Manages polls, including creating and voting.
   - Integrated with a Postgres database using Docker Compose.
   - Fully automated build and deployment pipeline using GitHub Actions.

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

## Future Plans

1. Build a **Results Microservice** to fetch and display poll results.
2. Build an **Email Microservice** to handle notifications and communications.
3. Develop a **Frontend Application** for user interaction, including signup/login, poll creation, voting, and results visualization.
4. Integrate **Automated Testing** for all microservices, linked to the CI/CD pipeline.
5. Deploy the application stack on AWS using **Docker Compose** or **Kubernetes** for scalability and orchestration.

---

This README will continue to evolve as the project grows and new features are added.
