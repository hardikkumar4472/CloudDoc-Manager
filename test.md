# CloudDoc-Manager: Comprehensive Test Plan

This document provides a systematic approach to testing the entire CloudDoc-Manager ecosystem, including Frontend, Backend, Infrastructure, DevOps, and Monitoring.

## Prerequisites
- **Local Environment**: Node.js installed, Docker Desktop running.
- **Cloud Environment**: AWS CLI configured, Terraform installed.
- **Kubernetes**: Minikube/Cluster running, `KUBECONFIG` set to `portable-kubeconfig`.
- **Secrets**: `.env` files populated in `backend/` and `frontend/`.

---

## Module 1: User Authentication & Security
| Test Case | Action | Expected Result |
| :--- | :--- | :--- |
| **1.1 Register** | Register a new user via the UI. | User created in MongoDB, redirected to login. |
| **1.2 Login** | Log in with valid credentials. | JWT token stored in `localStorage`, redirected to Dashboard. |
| **1.3 JWT Protection** | Access `/api/docs` without a token. | Status `401 Unauthorized`. |
| **1.4 Document Vault** | Toggle "Move to Vault" on a document. | Document disappears from main list, appears in Vault section. |

## Module 2: Document Management & AI
| Test Case | Action | Expected Result |
| :--- | :--- | :--- |
| **2.1 File Upload** | Upload a PDF or Image. | File saved to Supabase, metadata saved to MongoDB. |
| **2.2 AI OCR** | Upload an image with text. | `ocrText` field populated in document metadata. |
| **2.3 AI Summary** | Upload a large PDF. | `summary` field populated with a concise overview. |
| **2.4 Auto-Tagging** | Upload any document. | `tags` array contains relevant keywords (e.g., "Invoice", "Legal"). |
| **2.5 Full-Text Search** | Search for a keyword inside a document. | Document returned based on `textContent` or `ocrText`. |

## Module 3: Advanced File Transformations
| Test Case | Action | Expected Result |
| :--- | :--- | :--- |
| **3.1 PDF Merge** | Select two PDFs and click "Merge". | A new merged PDF is downloaded. |
| **3.2 PDF Split** | Specify page range (e.g., "1-2") for a PDF. | A new PDF containing only those pages is downloaded. |
| **3.3 Image Resize** | Download an image with width/height params. | Image downloaded with requested dimensions. |
| **3.4 PDF Compression** | Trigger compression on a large PDF. | PDF downloaded with reduced file size. |
| **3.5 Watermarking** | Add text watermark to a PDF/Image. | Downloaded file has the watermark overlay. |

## Module 4: Infrastructure & Cloud Routing
| Test Case | Action | Expected Result |
| :--- | :--- | :--- |
| **4.1 CloudFront Frontend** | Access the root CloudFront URL. | Serves the React application from S3. |
| **4.2 CloudFront API** | Access `<CF_URL>/api/auth/health`. | Traffic routed to EC2/K8s Backend. |
| **4.3 S3 Hosting** | Check S3 bucket permissions. | Public read restricted; accessible only via CloudFront OAI/OAC. |
| **4.4 HTTPS Enforce** | Access via `http://`. | Automatically redirected to `https://`. |

## Module 5: DevOps & Orchestration
| Test Case | Action | Expected Result |
| :--- | :--- | :--- |
| **5.1 Jenkins Pipeline** | Push code to `main` branch. | Jenkins triggers: Infra -> Build -> Push -> Deploy. |
| **5.2 K8s Deployment** | Run `kubectl get pods`. | `backend` and `frontend` pods are `Running`. |
| **5.3 K8s Secret Sync** | Change a secret in Jenkins & redeploy. | New secret value reflected in Pod environment. |
| **5.4 Self-Healing** | Manually delete a backend pod. | Kubernetes automatically recreates the pod. |

## Module 6: Monitoring & Governance
| Test Case | Action | Expected Result |
| :--- | :--- | :--- |
| **6.1 Metrics Endpoint** | `curl <BACKEND_URL>/metrics`. | Prometheus-formatted metrics are returned. |
| **6.2 Grafana Dashboard** | Access Grafana on port `30007`. | "CloudDoc-Manager Overview" dashboard shows live data. |
| **6.3 Expiry Logic** | Set `expiresAt` to 1 minute ago. | Document is deleted from DB and Storage within 24h (or on startup). |
| **6.4 Trash Purge** | Move doc to trash, set `trashedAt` to 31 days ago. | Document is permanently deleted by the Cron job. |

---

## Technical Implementation & Tool Testing

### 1. Docker Implementation
**How it is Implemented:**
- **Backend**: A `Dockerfile` in `backend/` uses `node:18-alpine` as a base, installs dependencies, and runs the Express server.
- **Frontend**: A `Dockerfile` in `frontend/` handles the multi-stage build: building the React app with Node and potentially serving it.
- **Orchestration**: `docker-compose.yml` in the root allows running both services locally.
- **Networking**: A custom bridge network (`clouddoc-network`) enables services to communicate via container names (e.g., `frontend` reaching `http://backend:5000`).
- **Volumes**: A named volume (`clouddoc-logs`) is mounted to `/app/logs` in the backend for persistent log storage.

**How to Test it:**
1. **Build Locally**: 
   ```bash
   docker build -t test-backend ./backend
   ```
2. **Run Container**:
   ```bash
   docker run -p 5000:5000 --env-file ./backend/.env test-backend
   ```
3. **Verify Connectivity (Network)**:
   - Exec into the frontend container and ping the backend:
     ```bash
     docker exec -it <frontend_container_id> ping backend
     ```
4. **Verify Persistence (Volume)**:
   - Check if the logs volume is created:
     ```bash
     docker volume inspect clouddoc_clouddoc-logs
     ```
   - Verify logs are being written inside the container:
     ```bash
     docker exec -it <backend_container_id> ls /app/logs
     ```

---

### 2. Kubernetes Implementation
**How it is Implemented:**
- **Manifests**: Located in the `k8s/` directory.
- **Resources**: Uses `Deployment` for scaling/self-healing, `Service` (NodePort) for internal/external access, `ConfigMap` for non-sensitive config, and `Secret` for credentials.
- **Orchestration**: Managed via `kubectl` and the `KUBECONFIG` file (`portable-kubeconfig`).

**How to Test it:**
1. **Deploy**:
   ```bash
   kubectl apply -k k8s/
   ```
2. **Check Status**:
   ```bash
   kubectl get pods,svc,secrets
   ```
3. **Test Self-Healing**: Delete a pod and watch K8s recreate it:
   ```bash
   kubectl delete pod <backend-pod-name>
   kubectl get pods -w
   ```

---

### 3. Terraform & AWS Implementation
**How it is Implemented:**
- **Modular IaC**: Terraform files are in `terraform/` (e.g., `aws_vpc.tf`, `aws_s3_frontend.tf`).
- **CloudFront**: Acts as the single entry point, routing `/api/*` to EC2 and everything else to S3.
- **S3/ECR**: S3 hosts static assets; ECR stores Docker images.
- **EC2**: Runs the backend service in a cost-optimized `t3.micro` instance.

**How to Test it:**
1. **Validate Config**:
   ```bash
   cd terraform
   terraform validate
   ```
2. **Dry Run**:
   ```bash
   terraform plan
   ```
3. **AWS Verification**: After `terraform apply`, log in to AWS Console and verify resources exist.

---

### 4. Jenkins Implementation
**How it is Implemented:**
- **Pipeline as Code**: Defined in `Jenkinsfile` at the root.
- **Stages**: `Checkout`, `Infrastructure`, `Build & Push`, `Deploy`.
- **Secrets**: Integrated with Jenkins Credentials Provider for AWS keys and Database URIs.

**How to Test it:**
1. **Manual Trigger**: Open Jenkins UI and click "Build Now" for the job.
2. **Stage View**: Monitor the pipeline progress in the UI.
3. **Console Output**: Inspect logs of the "Deploy" stage to ensure success.

---

### 5. Prometheus & Grafana Implementation
**How it is Implemented:**
- **Instrumentation**: Backend uses `prom-client` to expose metrics on `/metrics`.
- **Infrastructure**: `monitoring.tf` uses the `kube-prometheus-stack` Helm chart.
- **Visualization**: Grafana is configured with a sidecar to automatically load `monitoring/dashboard.json`.

**How to Test it:**
1. **Metrics Check**:
   ```bash
   curl http://localhost:5000/metrics
   ```
2. **Access Grafana**: 
   - Open `http://localhost:30007` in your browser.
   - Login (Default: admin/prom-operator).
3. **Verify Dashboard**: Search for the "CloudDoc-Manager Overview" dashboard.
