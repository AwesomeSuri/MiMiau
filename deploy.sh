#!/bin/bash

# 1. Get the latest code
echo "Pulling latest code from Git..."
git pull origin main

# 2. Build the updated containers
echo "Building Docker images..."
sudo docker build -t mimiau-frontend:v1 ./frontend
sudo docker build -t mimiau-backend-php:v1 ./backend/php

# 3. Apply the YAML config (in case you changed environment variables/ports)
echo "Applying Kubernetes configuration..."
sudo kubectl apply -f mimiau-stack.yaml

# 4. Restart pods to force them to use the new images
echo "Rolling out updates..."
sudo kubectl rollout restart deployment/angular-frontend
sudo kubectl rollout restart deployment/php-backend

echo "Deployment complete!"