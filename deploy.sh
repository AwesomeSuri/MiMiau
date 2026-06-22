#!/bin/bash

# 1. Build the fresh images
echo "Building images..."
sudo docker build --no-cache -t mimiau-frontend:v1 ./frontend
sudo docker build --no-cache -t mimiau-backend-php:v1 ./backend/php

# 2. Export them so K3s can see them
echo "Exporting images for K3s..."
sudo docker save mimiau-frontend:v1 > frontend.tar
sudo docker save mimiau-backend-php:v1 > backend.tar

# 3. Import them into K3s (The crucial bridge)
echo "Importing into K3s..."
sudo k3s ctr images import frontend.tar
sudo k3s ctr images import backend.tar

# 4. Cleanup temporary files
rm frontend.tar backend.tar

# 5. Apply and rollout
echo "Deploying..."
sudo kubectl apply -f mimiau-stack.yaml
sudo kubectl rollout restart deployment/angular-frontend
sudo kubectl rollout restart deployment/php-backend

echo "Deployment complete!"