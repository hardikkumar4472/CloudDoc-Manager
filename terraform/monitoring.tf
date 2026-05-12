resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
  }
}

resource "helm_release" "prometheus_stack" {
  name       = "prometheus-stack"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  version    = "51.2.0" # Stable version

  # Expose Grafana as a NodePort so we can access it on localhost
  set {
    name  = "grafana.service.type"
    value = "NodePort"
  }

  set {
    name  = "grafana.service.nodePort"
    value = "30007"
  }

  # Disable persistence for local development (Minikube) to save resources
  set {
    name  = "prometheus.prometheusSpec.storageSpec.volumeClaimTemplate.spec.resources.requests.storage"
    value = "2Gi"
  }

  # Enable sidecar to watch for dashboards in ConfigMaps
  set {
    name  = "grafana.sidecar.dashboards.enabled"
    value = "true"
  }

  set {
    name  = "grafana.sidecar.dashboards.label"
    value = "grafana_dashboard"
  }
}

resource "kubernetes_config_map" "grafana_dashboard" {
  metadata {
    name      = "clouddoc-dashboard"
    namespace = kubernetes_namespace.monitoring.metadata[0].name
    labels = {
      grafana_dashboard = "1"
    }
  }

  data = {
    "clouddoc-dashboard.json" = file("${path.module}/../monitoring/dashboard.json")
  }
}
