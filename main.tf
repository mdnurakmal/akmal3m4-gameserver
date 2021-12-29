terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 3.53"
    }
  }

    backend "gcs" {
  }

}


provider "google" {
  project     = var.project_id
  region      = var.region
}


provider "google-beta" {
  project     = var.project_id
  region      = var.region
}

resource "google_cloud_run_service" "game-client" {
  name     = "game-client-${var.multiregion}"
  location = var.region

  template {
    spec {
      timeout_seconds = 600
      containers {
        image = "${var.multiregion}-docker.pkg.dev/${var.project_id}/dronegaga-artifact-registry/game-client@sha256:${var.gameclientSHA}"
        env {
          name = "GAME_SERVER_URL"
          value = google_cloud_run_service.game-server.status[0].url
        }

       env {
          name = "REGION"
          value = "${var.region}"
        }

        resources {
          limits = {
            cpu = "1.0"
            memory = "1000Mi"
          }
        }
      }
      service_account_name = "cloudrun-sa@group4-3m4.iam.gserviceaccount.com"
    }

    
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  lifecycle {
    create_before_destroy = true
  }

   depends_on = [google_cloud_run_service.game-server]
   
}

resource "google_cloud_run_service" "game-server" {
  name     = "game-server-${var.multiregion}"
  location = var.region

  template {
    spec {
      containers {
        image = "${var.multiregion}-docker.pkg.dev/${var.project_id}/dronegaga-artifact-registry/game-server@sha256:${var.gameserverSHA}"

        resources {
          limits = {
            cpu = "1.0"
            memory = "1000Mi"
          }
        }
      }
      service_account_name = "cloudrun-sa@group4-3m4.iam.gserviceaccount.com"
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  lifecycle {
    create_before_destroy = true
  }

}

resource "google_cloud_run_service_iam_member" "game-server-invoker" {
  location = google_cloud_run_service.game-server.location
  project = google_cloud_run_service.game-server.project
  service = google_cloud_run_service.game-server.name
  role = "roles/run.invoker"
  member = "allUsers"
}

resource "google_cloud_run_service_iam_member" "game-client-invoker" {
  location = google_cloud_run_service.game-client.location
  project = google_cloud_run_service.game-client.project
  service = google_cloud_run_service.game-client.name
  role = "roles/run.invoker"
  member = "allUsers"
}