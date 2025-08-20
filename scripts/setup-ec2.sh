#!/bin/bash

# EC2 Setup Script - Run this on your EC2 instance
# This script installs Docker, Docker Compose, and sets up the application

echo "🚀 Setting up Marriage Predictor on EC2..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "📦 Installing Docker..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Install Git
sudo apt install -y git

# Create app directory
mkdir -p /home/ubuntu/marriage-predictor
cd /home/ubuntu/marriage-predictor

# Clone repository (replace with your repo URL)
echo "📥 Cloning repository..."
git clone https://github.com/YOUR_USERNAME/marriage-predictor.git .

# Create environment file
echo "⚙️ Setting up environment..."
cat > .env << EOF
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_cpOQrmBD48kM@ep-proud-salad-a149njzg-pooler.ap-southeast-1.aws.neon.tech/neondb
NEXT_PUBLIC_API_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5000
EOF

# Set up database schema
echo "🗄️ Setting up database..."
# You can run your SQL schema here if needed

# Build and start containers
echo "🏗️ Building and starting containers..."
docker-compose up -d --build

# Setup nginx reverse proxy (optional)
echo "🌐 Setting up Nginx..."
sudo apt install -y nginx

# Create nginx config
sudo tee /etc/nginx/sites-available/marriage-predictor << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable nginx site
sudo ln -sf /etc/nginx/sites-available/marriage-predictor /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# Enable services to start on boot
sudo systemctl enable docker
sudo systemctl enable nginx

echo "✅ Setup complete!"
echo "🌍 Your app should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo ""
echo "📋 Next steps:"
echo "1. Update your GitHub repository secrets with EC2 details"
echo "2. Push your code to trigger the deployment"
echo "3. Check logs with: docker-compose logs -f"
