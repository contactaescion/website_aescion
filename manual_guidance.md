# Manual Guidance for Deployment and Fixes

Step-by-step instructions to configure your AWS EC2 instance and GitHub repository for automated deployment.

## 1. Connect to your EC2 Instance
Open your terminal (or Putty) and SSH into your server:
```bash
ssh -i "path/to/aesciontech-key.pem" ubuntu@13.49.75.255
```

## 2. Server Setup (Run these commands on EC2)
Install Node.js, Nginx, and PM2:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx and Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Install PM2 globally
sudo npm install -g pm2
```

## 3. Configure Backend Environment
Create the directory for the app:
```bash
mkdir -p ~/app/backend
```
Create a `.env` file for your backend in `~/app/backend/.env`:
```bash
nano ~/app/backend/.env
```
Paste your backend environment variables into this file. **Crucially**, ensure you have:
```env
PORT=3000
# Add your database credentials and other secrets here
# CORS_ORIGIN=https://aesciontech.com
```
Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

## 4. Configure Nginx (The Fix for "Backend Not Connected")
This configuration will serve your frontend and proxy API requests to your backend, fixing the connection issues.

Create a new Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/aescion
```
Paste the following configuration:
```nginx
server {
    server_name aesciontech.com www.aesciontech.com;

    # Frontend (React App)
    location / {
        root /var/www/html/aescion;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        # Rewrite /api/foo to /foo if your backend doesn't expect /api prefix
        # If your backend routes are like /courses, keeps this rewriting:
        rewrite ^/api/(.*) /$1 break;
        
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/aescion /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default if present
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

## 5. SSL Setup (HTTPS)
Secure your site with a free Let's Encrypt certificate:
```bash
sudo certbot --nginx -d aesciontech.com -d www.aesciontech.com
```
Follow the prompts (enter email, agree to terms).

## 6. GitHub Repository Setup
1.  Go to your GitHub Repository Settings -> **Secrets and variables** -> **Actions**.
2.  Click **New repository secret**.
3.  Add the following secrets:
    -   `EC2_HOST`: `13.49.75.255`
    -   `EC2_USERNAME`: `ubuntu`
    -   `EC2_SSH_KEY`: (Open your `.pem` file with a text editor and copy the entire content, including `-----BEGIN RSA PRIVATE KEY-----`)

## 7. Deploy!
Push your changes to the `main` branch.
```bash
git add .
git commit -m "Configure deployment pipeline"
git push origin main
```
Go to the **Actions** tab in GitHub to watch the deployment proceed.

## Troubleshooting
-   **Backend Logs:** `pm2 logs aescion-backend`
-   **Nginx Logs:** `sudo tail -f /var/log/nginx/error.log`
-   **Permissions:** If deployment fails, ensure the ubuntu user owns the `~/app` directory.
