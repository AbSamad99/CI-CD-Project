variable "whitelist_ip" {
  description = "The IP address from which you want to access the machine."
}

variable "preferred_region" {
  description = "The region where you want to deploy the infrastructure."
  default     = "ca-central-1"
}

variable "machine_ami" {
  description = "The identifier of the OS you want to deploy."
  default     = "ami-00aa5a38fb6567e70"
}
