terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  # Need to figure out if it is possible to pass these in as variables
  backend "s3" {
    bucket         = "syed-cicd-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "ca-central-1"
    dynamodb_table = "syed-cicd-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.preferred_region
}

resource "aws_instance" "apache_server" {
  ami             = var.machine_ami
  instance_type   = "t2.micro"
  security_groups = [aws_security_group.apache_security_group.name]
  key_name        = "terraform-key"
}

resource "aws_security_group" "apache_security_group" {
  name = "apache-security-group"
}

resource "aws_security_group_rule" "allow_ssh_ingress" {
  security_group_id = aws_security_group.apache_security_group.id

  type        = "ingress"
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = [var.whitelist_ip]
}

resource "aws_security_group_rule" "allow_http_ingress" {
  security_group_id = aws_security_group.apache_security_group.id

  type        = "ingress"
  from_port   = 80
  to_port     = 80
  protocol    = "tcp"
  cidr_blocks = [var.whitelist_ip]
}

resource "aws_security_group_rule" "allow_all_egress" {
  security_group_id = aws_security_group.apache_security_group.id

  type        = "egress"
  from_port   = 0
  to_port     = 0
  protocol    = -1
  cidr_blocks = ["0.0.0.0/0"]
}
