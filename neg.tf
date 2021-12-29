resource "google_compute_region_network_endpoint_group" "game-client-neg" {
  name                  = "game-client-${var.multiregion}-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_service.game-client.name
  }

  depends_on = [google_cloud_run_service.game-client]
   
}

resource "google_compute_region_network_endpoint_group" "game-server-neg" {
  name                  = "game-server-${var.multiregion}-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_service.game-server.name
  }

  depends_on = [google_cloud_run_service.game-server]
   
}


