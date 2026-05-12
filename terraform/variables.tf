variable "namespace" {
  description = "The namespace to deploy resources into"
  type        = string
  default     = "clouddoc-terraform"
}

variable "backend_image" {
  description = "Docker image for the backend"
  type        = string
  default     = "hardik010190/clouddoc-backend:latest"
}

variable "frontend_image" {
  description = "Docker image for the frontend"
  type        = string
  default     = "hardik010190/clouddoc-frontend:latest"
}

variable "mongo_uri" {
  description = "MongoDB connection string"
  type        = string
  sensitive   = true
}

variable "jwt_access_secret" {
  description = "JWT Access Secret"
  type        = string
  sensitive   = true
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "clouddoc"
}
