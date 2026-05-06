# CloudDoc-Manager Testing Guide

This guide provides step-by-step instructions for testing the application in both Docker Compose and Kubernetes (Minikube).

---

## 🐳 Phase 1: Testing with Docker Compose

This is the standard local development setup.

1.  **Clean up existing state:**
    ```powershell
    docker compose down -v
    ```
2.  **Build and run:**
    ```powershell
    docker compose up --build
    ```
3.  **Access the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.
4.  **Verify Registration/Login:**
    - Go to the Sign Up page.
    - Register a new user.
    - Verify that any errors (like "User already exists") appear clearly in the toast notifications.

---

## ☸️ Phase 2: Testing with Kubernetes (Minikube)

This setup tests the container orchestration layer.

### 1. Initial Setup (If not done)
Ensure Minikube is running:
```powershell
minikube start
```

### 2. Build and Load Images
Kubernetes needs access to your Docker images. Since Minikube has its own registry, you must load them manually after building.

**Build Backend:**
```powershell
docker build -t clouddoc-backend:latest ./backend
```

**Build Frontend:**
*Note: We build the frontend with the Kubernetes backend NodePort URL.*
```powershell
docker build -t clouddoc-frontend:latest --build-arg VITE_API_URL=http://localhost:30005 ./frontend
```

**Load into Minikube:**
```powershell
minikube image load clouddoc-backend:latest
minikube image load clouddoc-frontend:latest
```

### 3. Deploy Resources
Deploy all manifests (Secrets, ConfigMaps, Deployments, and Services):
```powershell
kubectl apply -k k8s/
```

### 4. Verify and Access
Check if pods are running:
```powershell
kubectl get pods
```

Access the frontend via Minikube:
```powershell
minikube service frontend-service
```

### 5. Troubleshooting Connectivity
If the frontend cannot communicate with the backend from your host browser, run this port-forwarding command in a separate terminal:
```powershell
kubectl port-forward service/backend-service 30005:5000
```

---

## 🛠️ Common Fixes

### "EOF" or "Connection Refused" with kubectl
If `kubectl` commands fail with connection errors:
1. Ensure Minikube is started (`minikube start`).
2. If it persists, restart it: `minikube delete` followed by `minikube start`.

### CORS Issues
The backend is configured to allow:
- `http://localhost:3000` (Docker)
- `http://localhost:5173` / `5174` (Vite Dev)
- `http://localhost:30000` (K8s Frontend)
- `https://clouddoc-manager-interface.onrender.com` (Production)
