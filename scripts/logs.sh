#!/bin/bash

# Script to view application logs
echo "📋 Application Logs"
echo "==================="

echo "🔍 Backend Logs:"
docker-compose logs --tail=50 backend

echo ""
echo "🔍 Frontend Logs:"
docker-compose logs --tail=50 frontend

echo ""
echo "📊 Container Status:"
docker-compose ps

echo ""
echo "💾 System Resources:"
docker stats --no-stream
