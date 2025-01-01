# CI/CD Project

## Index

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Current Features](#current-features)
- [Workflow Overview](#workflow-overview)
- [Reusable GitHub Actions](#reusable-github-actions)
- [Requirements](#requirements)
- [How to Use](#how-to-use)
- [Future Plans](#future-plans)

## Introduction

This project is an effort to automate a complete CI/CD pipeline from the infrastructure to the configuration using Terraform, Ansible, and GitHub Actions. Currently, there is one GitHub Action that deploys an AWS EC2 instance, configures it to run Docker, and launches an NGINX server in a container. Additionally, the project includes a microservices-based application with components for authentication and poll management. These microservices are built as Docker containers and automatically pushed to my Docker Hub repository using dedicated GitHub Actions workflows. The project showcases the integration of modern CI/CD practices with microservices architecture and containerization.

## Project Structure

```bash
.github/
  └── actions/
      ├── build-push-image/         # Action to build and push Docker images
      ├── initialize-terraform/     # Action to set up Terraform
      ├── set-inventory-and-key/    # Action to configure Ansible inventory and SSH keys
      └── setup-ansible/            # Action to set up Ansible
  └── workflows/
      ├── deploy-compose.yml       # Deploys and manages Docker Compose setup
      ├── deploy-infrastructure.yml # Provisions infrastructure and sets up Ansible
      ├── destroy.yml              # Destroys the deployed infrastructure
      ├── publish-auth.yml         # Publishes the auth microservice container
      ├── publish-poll.yml         # Publishes the poll microservice container
      └── restart-compose.yml      # Restarts Docker Compose setup
ansible/
  ├── install_docker.yml          # Install and configure Docker
  ├── run_apache.yml              # Deploy and run nginx in a container
  ├── restart_compose.yml         # Restarts the Docker Compose setup
  └── ansible.cfg                 # Configuration file
application/
  ├── auth                        # Authentication microservice source code
  └── poll                        # Polling microservice source code
terraform/
  ├── infrastructure/
  │   ├── main.tf                 # Provision machine and security groups + rules
  │   └── outputs.tf              # Outputs the IP of the machine
  ├── backend/
      └── main.tf                 # Deploys backend used by the infrastructure (RUN SEPARATELY)
```

## Current Features

For details about changes and updates, refer to the [changelog](./changelog.md).

1. Authentication Microservice

   - Readme: [application/auth/readme.md](application/auth/readme.md)
   - Handles user signup, login, and password resets.
   - Utilizes JWT tokens with RS256 algorithm for secure authentication.
   - Packaged and deployed as a Docker container via CI/CD pipeline.

2. Poll Microservice

   - Readme: [application/poll/readme.md](application/poll/readme.md)
   - Manages polls, including creating and voting.
   - Integrated with a Postgres database using Docker Compose.
   - Fully automated build and deployment pipeline using GitHub Actions.

## Workflow Overview

### 1. Deploy Infrastructure

- File: [deploy-infrastructure.yml](.github/workflows/deploy-infrastructure.yml)
- Purpose: Provisions an AWS EC2 instance and configures it with required software.
- Key Steps:
  - Initialize and apply Terraform configurations.
  - Set up the SSH private key and Ansible inventory.
  - Install Docker using Ansible.
- Uses Actions:
  - [Initialize Terraform](#2-initialize-terraform)
  - [Set Inventory and Private Key](#3-set-inventory-and-private-key)
  - [Setup Ansible](#4-setup-ansible)

### 2. Destroy Infrastructure

- File: [destroy.yml](.github/workflows/destroy.yml)
- Purpose: Cleans up the provisioned AWS infrastructure.
- Key Steps:
  - Initializes Terraform.
  - Destroys the infrastructure.
- Uses Actions:
  - [Initialize Terraform](#2-initialize-terraform)

### 3. Deploy Docker Compose

- File: [deploy-compose.yml](.github/workflows/deploy-compose.yml)
- Purpose: Deploys and manages the Docker Compose setup for microservices.
- Key Steps:
  - Configures Ansible using the provisioned infrastructure.
  - Executes the Docker Compose playbook via Ansible.
- Uses Actions:
  - [Setup Ansible](#4-setup-ansible)

### 4. Publish Auth Microservice

- File: [publish-auth.yml](.github/workflows/publish-auth.yml)
- Purpose: Builds and pushes the authentication microservice Docker image.
- Key Steps:
  - Builds the Docker image from the `auth` directory.
  - Publishes the image to Docker Hub.
  - Triggers the `restart-compose` workflow.
- Uses Actions:
  - [Build and Push Microservice Image](#1-build-and-push-microservice-image)

### 5. Publish Poll Microservice

- File: [publish-poll.yml](.github/workflows/publish-poll.yml)
- Purpose: Builds and pushes the polling microservice Docker image.
- Key Steps:
  - Builds the Docker image from the `poll` directory.
  - Publishes the image to Docker Hub.
  - Triggers the `restart-compose` workflow.
- Uses Actions:
  - [Build and Push Microservice Image](#1-build-and-push-microservice-image)

### 6. Restart Docker Compose

- File: [restart-compose.yml](.github/workflows/restart-compose.yml)
- Purpose: Re-deploys the Docker Compose setup to reflect updated microservices.
- Key Steps:
  - Configures Ansible.
  - Runs the `restart_compose.yml` playbook to restart services.
- Uses Actions:
  - [Setup Ansible](#4-setup-ansible)

## Reusable GitHub Actions

### 1. Build and Push Microservice Image

- File: [build-push-image/action.yml](.github/actions/build-push-image/action.yml)
- Builds a Docker image and pushes it to Docker Hub.
- Inputs include DockerHub credentials, image name, and tag.

### 2. Initialize Terraform

- File: [initialize-terraform/action.yml](.github/actions/initialize-terraform/action.yml)
- Sets up and initializes Terraform for infrastructure management.
- Inputs include Terraform directory and version.

### 3. Set Inventory and Private Key

- File: [set-inventory-and-key/action.yml](.github/actions/set-inventory-and-key/action.yml)
- Configures Ansible inventory and SSH keys for the provisioned machine.
- Inputs include SSH private key.

### 4. Setup Ansible

- File: [setup-ansible/action.yml](.github/actions/setup-ansible/action.yml)
- Prepares the environment for Ansible by integrating Terraform and SSH configurations.
- Inputs include SSH private key.

## Requirements

1. AWS Account

   - Full Access to EC2, S3 buckets and DynamoDB.
   - The security credentials of the account needed by terraform.
   - EC2 security key pair private key.

2. GitHub Secrets

   - AWS credentials: `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`
   - EC2 security private key: `RSA_SECRET_KEY`
   - DB connection values: `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT` & `DB_USERNAME`
   - DockerHub credentials: `DOCKERHUB_TOKEN` & `DOCKERHUB_USERNAME`
   - JWT key pair: `JWT_PRIVATE_KEY` & `JWT_PUBLIC_KEY`

3. GitHub Variables

   - `WHITELIST_IP`, this can be either `0.0.0.0/0` (_ALL_ IPs) or your home/personal IP.

## How to Use

1. Fork or Clone the repository

   - Fork it directly from GitHub.
   - Clone the repository and push it to your own.

2. Set up the Terraform Backend

   - Install terraform.
   - Perform AWS CLI login or set the `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` values in your local environment.
   - Navigate to the `terraform/backend` directory.
   - Initialize Terraform and apply the backend configuration:
     ```bash
     terraform init
     terraform apply --auto-approve
     ```

3. Set up GitHub Secrets and Variables

   - AWS Secrets:

     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `RSA_SECRET_KEY`

   - Database Secrets:

     - `DB_HOST`
     - `DB_NAME`
     - `DB_PASSWORD`
     - `DB_PORT`
     - `DB_USERNAME`

   - Docker Hub Secrets:

     - `DOCKERHUB_TOKEN`
     - `DOCKERHUB_USERNAME`

   - JWT Secrets:

     - `JWT_PRIVATE_KEY`
     - `JWT_PUBLIC_KEY`

   - Add GitHub variables: `WHITELIST_IP`.

4. Trigger the Action

   - Navigate to the Actions tab in your repository on GitHub.
   - Manually dispatch the `Deploy the infrastructure` workflow.
   - Manually dispatch the `Deploy docker compose` workflow.

5. Access the deployed server

   - Use the public IP outputted by terraform to verify the nginx server.

## Future Plans

1. Build an Email Microservice to handle notifications and communications.
2. Develop a Frontend Application for user interaction, including signup/login, poll creation, voting, and results visualization.
3. Integrate Automated Testing for all microservices, linked to the CI/CD pipeline.

---

This README will continue to evolve as the project grows and new features are added.
