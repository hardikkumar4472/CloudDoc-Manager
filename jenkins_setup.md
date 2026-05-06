# Jenkins Setup and Testing Instructions

This guide will help you set up Jenkins locally and test the CI/CD pipeline for the CloudDoc-Manager project.

## 1. Start Jenkins Locally

Use the provided `docker-compose.jenkins.yml` to spin up a Jenkins instance:

```bash
docker-compose -f docker-compose.jenkins.yml up -d
```

Access Jenkins at `http://localhost:9090`.

## 2. Initial Configuration

1.  **Unlock Jenkins**: Follow the instructions on the screen (the password can be found in the container logs or `/var/jenkins_home/secrets/initialAdminPassword`).
2.  **Install Plugins**:
    -   Docker Pipeline
    -   GitHub
    -   Kubernetes CLI
3.  **Configure Credentials**:
    -   Go to `Manage Jenkins` -> `Credentials` -> `System` -> `Global credentials`.
    -   Add `github-creds`: Username with password (PAT) or SSH key for your GitHub repository.
    -   Add `docker-hub-creds`: Username and password for your Docker Hub account.
    -   Add `kubeconfig`: Secret file containing your `~/.kube/config`.

## 3. Create a Pipeline Job

1.  Click `New Item`.
2.  Enter name: `CloudDoc-Pipeline`.
3.  Select `Pipeline` and click OK.
4.  Under `Build Triggers`, check `GitHub hook trigger for GITScm polling`.
5.  Under `Pipeline`, select `Pipeline script from SCM`.
    -   SCM: `Git`
    -   Repository URL: `https://github.com/your-username/CloudDoc-Manager.git`
    -   Credentials: `github-creds`
    -   Script Path: `Jenkinsfile`
6.  Save the job.

## 4. Test the Pipeline

1.  **Manual Trigger**: Click `Build Now` on the pipeline page to ensure everything is working correctly.
2.  **GitHub Webhook**: 
    -   In your GitHub repository, go to `Settings` -> `Webhooks`.
    -   Add webhook: `http://<your-jenkins-public-url>/github-webhook/`.
    -   Set content type to `application/json`.
    -   Push a change to the `main` branch to trigger the build automatically.

## 5. Verify Results

-   Check the **Console Output** in Jenkins for each stage.
-   Verify images are pushed to **Docker Hub**.
-   Run `kubectl get pods` to see the updated containers running in your cluster.
