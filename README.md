# Marriage Age Predictor 💍

A fun, AI-powered web application that predicts your marriage age based on personal data and lifestyle factors. Built with Next.js, Node.js, and PostgreSQL.

## 🌟 Features

- **Modern UI**: Beautiful, responsive design with smooth animations
- **AI Prediction**: Smart algorithm that considers multiple lifestyle factors
- **Real-time Results**: Instant predictions with engaging loading animations
- **Social Sharing**: Share your results with friends
- **Community Feed**: View predictions from other users
- **Mobile Friendly**: Fully responsive design

## 🏗️ Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│ (PostgreSQL)    │
│   Port: 3000    │    │   Port: 5000    │    │   (Neon)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- Git installed

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/marriage-predictor.git
cd marriage-predictor
\`\`\`

### 2. Local Development

#### Option A: Using Docker (Recommended)

\`\`\`bash
# Start both frontend and backend
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

#### Option B: Manual Setup

**Backend Setup:**
\`\`\`bash
cd backend
npm install
npm start
\`\`\`

**Frontend Setup:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🌐 Deployment to AWS EC2

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Click "Launch Instance"
3. Choose **Ubuntu Server 22.04 LTS**
4. Select **t2.micro** (free tier eligible)
5. Create or select a key pair
6. Configure Security Group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - Custom TCP (3000) - Anywhere
   - Custom TCP (5000) - Anywhere
7. Launch instance

### Step 2: Connect to EC2

\`\`\`bash
# Replace with your key file and EC2 public IP
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
\`\`\`

### Step 3: Setup EC2 (One-time)

\`\`\`bash
# Download and run setup script
curl -o setup.sh https://raw.githubusercontent.com/YOUR_USERNAME/marriage-predictor/main/scripts/setup-ec2.sh
chmod +x setup.sh
./setup.sh
\`\`\`

This script will:
- Install Docker and Docker Compose
- Install Nginx as reverse proxy
- Clone your repository
- Set up the application
- Configure auto-start on boot

### Step 4: Configure GitHub Secrets

In your GitHub repository, go to Settings → Secrets and add:

- `EC2_HOST`: Your EC2 public IP address
- `EC2_USERNAME`: `ubuntu`
- `EC2_SSH_KEY`: Contents of your private key file

### Step 5: Deploy

Push to main branch to trigger automatic deployment:

\`\`\`bash
git add .
git commit -m "Deploy to production"
git push origin main
\`\`\`

Or deploy manually on EC2:

\`\`\`bash
cd /home/ubuntu/marriage-predictor
./scripts/deploy.sh
\`\`\`

## 📱 Usage

### Making a Prediction

1. Visit the homepage
2. Click "Predict My Marriage Age"
3. Fill in the form with your details:
   - Personal information (name, DOB, location, job)
   - Lifestyle questions (perfume, iPhone, bike ownership)
   - Relationship experience
4. Submit and view your prediction!

### API Endpoints

- `GET /api/predictions` - Get all predictions
- `POST /api/predict` - Create new prediction
- `GET /health` - Health check

## 🛠️ Management Commands

### View Logs
\`\`\`bash
# On EC2
cd /home/ubuntu/marriage-predictor
./scripts/logs.sh
\`\`\`

### Backup Data
\`\`\`bash
# On EC2
./scripts/backup.sh
\`\`\`

### Update Application
\`\`\`bash
# On EC2
./scripts/deploy.sh
\`\`\`

### Restart Services
\`\`\`bash
# On EC2
docker-compose restart
\`\`\`

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
\`\`\`env
DATABASE_URL=your_postgresql_connection_string
PORT=5000
NODE_ENV=production
\`\`\`

**Frontend (.env.local):**
\`\`\`env
NEXT_PUBLIC_API_URL=http://your-ec2-ip:5000
\`\`\`

### Database Schema

The application uses PostgreSQL with the following main table:

\`\`\`sql
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    user_uuid UUID UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(255) NOT NULL,
    current_job VARCHAR(255) NOT NULL,
    body_count INTEGER NOT NULL,
    is_perfume_used BOOLEAN NOT NULL,
    has_iphone BOOLEAN NOT NULL,
    has_bike BOOLEAN NOT NULL,
    predicted_age INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**1. Application not accessible**
\`\`\`bash
# Check if containers are running
docker-compose ps

# Check logs
docker-compose logs
\`\`\`

**2. Database connection issues**
- Verify DATABASE_URL in environment variables
- Check if Neon database is accessible
- Ensure database schema is created

**3. Frontend can't connect to backend**
- Verify NEXT_PUBLIC_API_URL is correct
- Check if backend is running on port 5000
- Ensure security groups allow traffic

**4. Deployment fails**
- Check GitHub Actions logs
- Verify EC2 SSH connection
- Ensure Docker is running on EC2

### Health Checks

\`\`\`bash
# Check backend health
curl http://localhost:5000/health

# Check if frontend is serving
curl http://localhost:3000

# Check Docker containers
docker-compose ps

# Check system resources
docker stats
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the logs using `./scripts/logs.sh`
3. Create an issue on GitHub
4. Contact support

---

**Made with ❤️ for fun predictions!**
