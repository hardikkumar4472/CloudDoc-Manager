resource "kubernetes_namespace" "clouddoc" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_config_map" "backend_config" {
  metadata {
    name      = "backend-config"
    namespace = kubernetes_namespace.clouddoc.metadata[0].name
  }

  data = {
    PORT      = "5000"
    NODE_ENV  = "production"
    SMTP_PORT = "587"
  }
}

resource "kubernetes_secret" "backend_secret" {
  metadata {
    name      = "backend-secret"
    namespace = kubernetes_namespace.clouddoc.metadata[0].name
  }

  data = {
    MONGO_URI             = var.mongo_uri
    JWT_ACCESS_SECRET     = var.jwt_access_secret
    JWT_REFRESH_SECRET    = "your_jwt_refresh_secret_here"
    BREVO_API_KEY         = "your_brevo_api_key_here"
    CLOUDINARY_API_KEY     = "your_cloudinary_api_key_here"
    CLOUDINARY_API_SECRET  = "your_cloudinary_api_secret_here"
    CLOUDINARY_CLOUD_NAME  = "your_cloudinary_cloud_name_here"
    FROM_EMAIL            = "your_email_here"
    FRONTEND_URL          = "http://localhost:3000"
    RESEND_API_KEY        = "your_resend_api_key_here"
    SMTP_HOST             = "smtp.gmail.com"
    SMTP_PASS             = "your_smtp_password_here"
    SMTP_USER             = "your_smtp_user_here"
    SUPABASE_KEY          = "your_supabase_key_here"
    SUPABASE_URL          = "your_supabase_url_here"
    GEMINI_API_KEY        = "your_gemini_api_key_here"
  }

  type = "Opaque"
}

resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.clouddoc.metadata[0].name
    labels = {
      app = "backend"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }

      spec {
        container {
          name  = "backend"
          image = var.backend_image

          port {
            container_port = 5000
          }

          env_from {
            config_map_ref {
              name = kubernetes_config_map.backend_config.metadata[0].name
            }
          }

          env_from {
            secret_ref {
              name = kubernetes_secret.backend_secret.metadata[0].name
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "backend_service" {
  metadata {
    name      = "backend-service"
    namespace = kubernetes_namespace.clouddoc.metadata[0].name
  }

  spec {
    selector = {
      app = "backend"
    }

    port {
      port        = 5000
      target_port = 5000
      node_port   = 30006
    }

    type = "NodePort"
  }
}

resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.clouddoc.metadata[0].name
    labels = {
      app = "frontend"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend"
        }
      }

      spec {
        container {
          name  = "frontend"
          image = var.frontend_image

          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend_service" {
  metadata {
    name      = "frontend-service"
    namespace = kubernetes_namespace.clouddoc.metadata[0].name
  }

  spec {
    selector = {
      app = "frontend"
    }

    port {
      port        = 3000
      target_port = 3000
      node_port   = 30001
    }

    type = "NodePort"
  }
}
