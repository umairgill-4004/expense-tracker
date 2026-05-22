pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "umair4004/expense-tracker:latest"
    }

    stages {

        stage('Code Fetch Stage') {
            steps {
                echo 'Fetching code from GitHub...'
                checkout scm
            }
        }

        stage('Docker Image Creation Stage') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t $DOCKER_IMAGE .'

                echo 'Running basic test...'
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Push Docker Image to DockerHub') {
            steps {
                echo 'Pushing Docker image to DockerHub...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Kubernetes Deployment Stage') {
            steps {
                echo 'Deploying application on Kubernetes...'
                sh 'kubectl apply -f k8s/mongo-deployment.yaml'
                sh 'kubectl apply -f k8s/mongo-service.yaml'
                sh 'kubectl apply -f k8s/app-deployment.yaml'
                sh 'kubectl apply -f k8s/app-service.yaml'
                sh 'kubectl rollout restart deployment expense-app-deployment || true'
                sh 'kubectl get pods'
                sh 'kubectl get svc'
            }
        }

        stage('Prometheus / Grafana Stage') {
            steps {
                echo 'Monitoring will be done using Prometheus and Grafana.'
                echo 'Prometheus collects metrics.'
                echo 'Grafana displays those metrics using dashboards.'
                sh 'kubectl get pods -A'
            }
        }
    }

    post {
        success {
            echo 'CI/CD Pipeline completed successfully.'
        }

        failure {
            echo 'CI/CD Pipeline failed.'
        }
    }
}
