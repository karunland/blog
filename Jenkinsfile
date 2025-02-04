pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'blog-api'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                dir('backend') {
                    sh 'dotnet test'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Stop existing container if running
                    sh 'docker ps -q --filter name=blog-api | grep -q . && docker stop blog-api && docker rm blog-api || echo "No container running"'
                    
                    // Run new container
                    sh "docker run --rm --restart unless-stopped --name blog-api -p 5000:80 ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }
    }
    
    post {
        failure {
            echo 'Pipeline failed!'
        }
        success {
            echo 'Pipeline succeeded!'
        }
    }
} 