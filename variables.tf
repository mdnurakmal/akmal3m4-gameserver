# define GCP region
variable "region" {
  type        = string
  description = "GCP region"
}

# define GCP region
variable "multiregion" {
  type        = string
  description = "GCP region"
}

# define GCP project name
variable "project_id" {
  type        = string
  description = "GCP project name"
}

variable "gameserverSHA" {
  type        = string
  description = "game-serverSHA"
}

variable "gameclientSHA" {
  type        = string
  description = "game-clientSHA"
}

