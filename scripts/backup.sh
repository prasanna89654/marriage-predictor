#!/bin/bash

# Simple backup script
echo "💾 Creating backup..."

BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/marriage-predictor_$DATE.tar.gz \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  /home/ubuntu/marriage-predictor

# Keep only last 5 backups
cd $BACKUP_DIR
ls -t marriage-predictor_*.tar.gz | tail -n +6 | xargs -r rm

echo "✅ Backup created: marriage-predictor_$DATE.tar.gz"
echo "📁 Backup location: $BACKUP_DIR"
