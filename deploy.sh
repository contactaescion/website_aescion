
#!/bin/bash

# Update and Install Dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm nginx git

# Install PM2 globally
sudo npm install -g pm2

# Setup Directory Structure (Assuming repo is cloned to /var/www/aescion)
# You might need to adjust paths based on where you clone the repo
PROJECT_DIR="/var/www/aescion"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "Directory $PROJECT_DIR does not exist. Please clone the repo to this location first."
    exit 1
fi

cd $PROJECT_DIR

# Frontend Build
echo "Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# Backend Build
echo "Building Backend..."
cd backend
npm install
npm run build
cd ..

# Configure Nginx
echo "Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/aescion
sudo ln -s /etc/nginx/sites-available/aescion /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Start Backend with PM2
echo "Starting Backend..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "Deployment Complete!"
