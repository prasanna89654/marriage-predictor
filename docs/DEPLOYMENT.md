# Deployment Guide

This guide provides detailed instructions for deploying the Marriage Age Predictor to AWS EC2.

## 🎯 Overview

The deployment process involves:

1. Setting up an EC2 instance
2. Installing required software
3. Configuring the application
4. Setting up CI/CD pipeline

## 📋 Prerequisites

- AWS Account
- GitHub Account
- Basic command line knowledge
- SSH key pair for EC2

## 🚀 Step-by-Step Deployment

### 1. AWS EC2 Setup

#### Launch Instance

1. **Login to AWS Console**

   - Go to https://aws.amazon.com/console/
   - Navigate to EC2 service

2. **Launch New Instance**

   - Click "Launch Instance"
   - Name: `marriage-predictor-app`

3. **Choose AMI**

   - Select **Ubuntu Server 22.04 LTS (HVM)**
   - Architecture: 64-bit (x86)

4. **Instance Type**

   - Select **t2.micro** (Free tier eligible)
   - 1 vCPU, 1 GB RAM

5. **Key Pair**

   - Create new key pair or use existing
   - Download .pem file and keep it safe

6. **Network Settings**

   - Create security group with these rules:
     - SSH (22) - Your IP only
     - HTTP (80) - 0.0.0.0/0
     - Custom TCP (3000) - 0.0.0.0/0
     - Custom TCP (5001) - 0.0.0.0/0

7. **Storage**

   - 8 GB gp2 (Free tier eligible)

8. **Launch Instance**

### 2. Connect to EC2

\`\`\`bash

# Make key file secure

chmod 400 your-key.pem

# Connect to instance

ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
\`\`\`

### 3. Server Setup

#### Automated Setup (Recommended)

\`\`\`bash

# Download setup script

wget https://raw.githubusercontent.com/YOUR_USERNAME/marriage-predictor/main/scripts/setup-ec2.sh

# Make executable

chmod +x setup-ec2.sh

# Run setup

./setup-ec2.sh
\`\`\`

#### Manual Setup (Alternative)

\`\`\`bash

# Update system

sudo apt update && sudo apt upgrade -y

# Install Docker

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose

sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git and Nginx

sudo apt install -y git nginx

# Logout and login again for Docker permissions

exit
\`\`\`

### 4. Application Setup

\`\`\`bash

# Create app directory

mkdir -p /home/ubuntu/marriage-predictor
cd /home/ubuntu/marriage-predictor

# Clone repository

git clone https://github.com/YOUR_USERNAME/marriage-predictor.git .

# Create environment file

cat > .env << EOF
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_cpOQrmBD48kM@ep-proud-salad-a149njzg-pooler.ap-southeast-1.aws.neon.tech/neondb
NEXT_PUBLIC_API_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):5001
EOF

# Start application

docker-compose up -d --build
\`\`\`

### 5. Configure Nginx (Optional)

\`\`\`bash

# Create Nginx config

sudo tee /etc/nginx/sites-available/marriage-predictor << 'EOF'
server {
listen 80;
server*name *;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

}
EOF

# Enable site

sudo ln -s /etc/nginx/sites-available/marriage-predictor /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### 6. Setup CI/CD

#### Configure GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:
   - `EC2_HOST`: Your EC2 public IP
   - `EC2_USERNAME`: `ubuntu`
   - `EC2_SSH_KEY`: Contents of your .pem file

#### Test Deployment

\`\`\`bash

# Push to main branch

git add .
git commit -m "Initial deployment"
git push origin main
\`\`\`

## ✅ Verification

### Check Application Status

\`\`\`bash

# Check containers

docker-compose ps

# Check logs

docker-compose logs

# Test endpoints

curl http://localhost:5001/health
curl http://localhost:3000
\`\`\`

### Access Application

- **Direct Access**: `http://YOUR_EC2_PUBLIC_IP:3000`
- **With Nginx**: `http://YOUR_EC2_PUBLIC_IP`

## 🔄 Ongoing Management

### Update Application

\`\`\`bash
cd /home/ubuntu/marriage-predictor
./scripts/deploy.sh
\`\`\`

### View Logs

\`\`\`bash
./scripts/logs.sh
\`\`\`

### Backup

\`\`\`bash
./scripts/backup.sh
\`\`\`

### Monitor Resources

\`\`\`bash

# Check disk space

df -h

# Check memory

free -h

# Check Docker stats

docker stats
\`\`\`

## 🛡️ Security Best Practices

1. **Restrict SSH Access**

   - Only allow your IP in security group
   - Use key-based authentication only

2. **Regular Updates**

   - Keep system updated: `sudo apt update && sudo apt upgrade`
   - Update Docker images regularly

3. **Firewall**

   - Only open necessary ports
   - Consider using AWS Security Groups

4. **Monitoring**
   - Set up CloudWatch monitoring
   - Monitor application logs

## 💰 Cost Optimization

1. **Use t2.micro** for development (free tier)
2. **Stop instance** when not in use
3. **Monitor usage** with AWS Cost Explorer
4. **Clean up unused resources** regularly

## 🆘 Troubleshooting

### Common Issues

**Cannot connect to EC2:**

- Check security group rules
- Verify key file permissions (400)
- Ensure instance is running

**Application not starting:**

- Check Docker installation: `docker --version`
- Verify environment variables
- Check logs: `docker-compose logs`

**Database connection failed:**

- Verify DATABASE_URL
- Check network connectivity
- Ensure database is accessible

**Deployment fails:**

- Check GitHub Actions logs
- Verify SSH connection
- Ensure all secrets are set correctly

### Getting Help

1. Check application logs
2. Review this documentation
3. Search GitHub issues
4. Create new issue with details

---

**Happy Deploying! 🚀**
