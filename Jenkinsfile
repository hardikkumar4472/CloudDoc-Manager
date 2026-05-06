pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'hardik010190' 
        BACKEND_IMAGE = "${DOCKER_HUB_USER}/clouddoc-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_USER}/clouddoc-frontend"
        GIT_REPO_URL = 'https://github.com/hardikkumar4472/CloudDoc-Manager.git'
    }

    stages {
        stage('Checkout') {
            steps {
                // Requires 'github-creds' to be defined in Jenkins credentials
                checkout([$class: 'GitSCM', 
                    branches: [[name: '*/main']], 
                    userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: 'github-creds']]
                ])
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        docker.build("${env.BACKEND_IMAGE}:${env.BUILD_NUMBER}")
                        docker.build("${env.BACKEND_IMAGE}:latest")
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        // Passing build arg if needed
                        docker.build("${env.FRONTEND_IMAGE}:${env.BUILD_NUMBER}", "--build-arg VITE_API_URL=http://backend-service:5000 .")
                        docker.build("${env.FRONTEND_IMAGE}:latest")
                    }
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add your test commands here, e.g.,
                // sh 'cd backend && npm install && npm test'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Requires 'docker-hub-creds' to be defined in Jenkins credentials
                    docker.withRegistry('', 'docker-hub-creds') {
                        docker.image("${env.BACKEND_IMAGE}:${env.BUILD_NUMBER}").push()
                        docker.image("${env.BACKEND_IMAGE}:latest").push()
                        docker.image("${env.FRONTEND_IMAGE}:${env.BUILD_NUMBER}").push()
                        docker.image("${env.FRONTEND_IMAGE}:latest").push()
                    }
                }
            }
        }

        stage('Deploy to K8s') {
            steps {
                script {
                    // Requires 'kubeconfig' to be defined in Jenkins as a secret file
                    withKubeConfig([credentialsId: 'kubeconfig']) {
                        sh 'kubectl apply -f k8s/'
                        sh "kubectl set image deployment/backend backend=${env.BACKEND_IMAGE}:${env.BUILD_NUMBER}"
                        sh "kubectl set image deployment/frontend frontend=${env.FRONTEND_IMAGE}:${env.BUILD_NUMBER}"
                    }
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
