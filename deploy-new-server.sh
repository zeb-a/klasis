#!/bin/bash

# --- CONFIGURATION ---
SERVER_IP="34.176.82.196"
REMOTE_PATH="/home/workspace-key-20260313/clabc/"
IMAGE_NAME="klasiz-app"
CONTAINER_NAME="klasiz-live"
SERVER_USER="workspace-key-20260313"

echo "🚀 Starting Deployment..."

# 1. Build locally
echo "📦 Building React app..."
npm run build

# 2. Package
echo "🤐 Zipping files..."
zip -r deploy.zip dist Dockerfile remote_commands.sh

# 3. Upload
echo "🚚 Uploading to server..."
# Create remote directory first if it doesn't exist
ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_PATH"
scp -o StrictHostKeyChecking=no deploy.zip $SERVER_USER@$SERVER_IP:$REMOTE_PATH

# 4. Remote Commands
echo "🔧 Server-side update in progress..."
scp -o StrictHostKeyChecking=no remote_commands.sh $SERVER_USER@$SERVER_IP:$REMOTE_PATH
ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "cd $REMOTE_PATH && bash remote_commands.sh"

echo "🎉 All done! Visit http://34.176.82.196:8080"
