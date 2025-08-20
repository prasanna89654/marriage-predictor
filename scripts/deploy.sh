#!/bin/bash

# Simple deployment script for manual deployment
# Run this script on your EC2 instance to deploy manually

echo "🚀 Deploying Marriage Predictor..."

# Navigate to app directory
cd /home/ubuntu/marriage-predictor

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove unused Docker resources
echo "🧹 Cleaning up Docker resources..."
docker system prune -f

# Build and start new containers
echo "🏗️ Building and starting containers..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check container status
echo "📊 Container status:"
docker-compose ps

# Check application health
echo "🏥 Checking application health..."
curl -f http://localhost:5000/health && echo "✅ Backend is healthy"
curl -f http://localhost:3000 && echo "✅ Frontend is accessible"

echo "✅ Deployment complete!"
echo "🌍 App is available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
