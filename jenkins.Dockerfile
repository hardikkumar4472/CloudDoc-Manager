FROM jenkins/jenkins:lts

USER root

# Install Docker CLI, kubectl, and Terraform
RUN apt-get update && \
    apt-get install -y docker.io curl gnupg software-properties-common && \
    # Install kubectl
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    chmod +x kubectl && \
    mv kubectl /usr/local/bin/ && \
    # Install Terraform
    curl -fsSL https://apt.releases.hashicorp.com/gpg | apt-key add - && \
    apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" && \
    apt-get update && apt-get install -y terraform && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

USER jenkins
