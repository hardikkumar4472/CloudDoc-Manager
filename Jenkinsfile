pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_CREDS = 'aws-credentials-id'
        SSH_CREDS = 'ec2-ssh-key'
        PROJECT_NAME = 'clouddoc'
        KUBECONFIG_PATH = "${WORKSPACE}/portable-kubeconfig"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Infrastructure') {
            steps {
                script {
                    dir('terraform') {
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDS]]) {
                            sh 'terraform init'
                            sh 'terraform apply -auto-approve'
                            env.S3_BUCKET = sh(script: 'terraform output -raw frontend_bucket_name', returnStdout: true).trim()
                            env.EC2_IP = sh(script: 'terraform output -raw backend_public_ip', returnStdout: true).trim()
                            env.ECR_URL = sh(script: 'terraform output -raw ecr_repository_url', returnStdout: true).trim()
                            env.CLOUDFRONT_URL = sh(script: 'terraform output -raw cloudfront_url', returnStdout: true).trim()
                        }
                    }
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                script {
                    dir('backend') {
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDS]]) {
                            sh "aws ecr get-login-password --region ${env.AWS_REGION} | docker login --username AWS --password-stdin ${env.ECR_URL}"
                            sh "docker build -t ${env.PROJECT_NAME}-backend ."
                            sh "docker tag ${env.PROJECT_NAME}-backend:latest ${env.ECR_URL}:latest"
                            sh "docker push ${env.ECR_URL}:latest"
                        }
                    }
                }
            }
        }

        stage('Build & Deploy Frontend') {
            steps {
                script {
                    dir('frontend') {
                        // Create .env for frontend if needed, pointing to CloudFront URL
                        sh "echo VITE_API_URL=https://${env.CLOUDFRONT_URL}/api > .env.production"
                        sh 'npm install'
                        sh 'npm run build'
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: env.AWS_CREDS]]) {
                            sh "aws s3 sync dist/ s3://${env.S3_BUCKET} --delete"
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([
                    string(credentialsId: 'mongo-uri', variable: 'MONGO_URI'),
                    string(credentialsId: 'jwt-secret', variable: 'JWT_ACCESS_SECRET'),
                    string(credentialsId: 'supabase-key', variable: 'SUPABASE_KEY'),
                    string(credentialsId: 'supabase-url', variable: 'SUPABASE_URL'),
                    string(credentialsId: 'gemini-key', variable: 'GEMINI_API_KEY')
                ]) {
                    script {
                        sh """
                            export KUBECONFIG=${env.KUBECONFIG_PATH}
                            
                            # Update Backend Secret
                            kubectl create secret generic backend-secret \
                                --from-literal=MONGO_URI=${env.MONGO_URI} \
                                --from-literal=JWT_ACCESS_SECRET=${env.JWT_ACCESS_SECRET} \
                                --from-literal=SUPABASE_KEY=${env.SUPABASE_KEY} \
                                --from-literal=SUPABASE_URL=${env.SUPABASE_URL} \
                                --from-literal=GEMINI_API_KEY=${env.GEMINI_API_KEY} \
                                --dry-run=client -o yaml | kubectl apply -f -

                            # Update image in manifests
                            sed -i "s|clouddoc-backend:latest|${env.ECR_URL}:latest|g" k8s/backend-deployment.yaml
                            
                            # Apply K8s configurations
                            kubectl apply -k k8s/
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
