# AWS Production Deployment Guide

Follow these steps to deploy the AESCION website to AWS.

## 1. Architecture Overview
- **Frontend**: Hosted on **AWS S3** and served via **CloudFront** (CDN) for HTTPS and speed.
- **Backend**: Hosted on **AWS EC2** (Ubuntu) using PM2 and Nginx reverse proxy.
- **Database**: **AWS RDS** (MySQL) or Local MySQL on EC2.
- **Storage**: **AWS S3** for Gallery images.

---

## 2. Backend Deployment (EC2)

1. **Launch an EC2 Instance**:
   - OS: Ubuntu 22.04 LTS
   - Type: t2.micro (Free Tier) or t3.small
   - Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS).

2. **Connect to EC2 and Setup Environment**:
   ```bash
   ssh -i key.pem ubuntu@your-ec2-ip
   
   # Update and Install Node.js
   sudo apt update
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs nginx

   # Install Process Manager
   sudo npm install -g pm2
   ```

3. **Deploy Code**:
   - Clone repo or SCP the `backend` folder to the server.
   - Install dependencies:
     ```bash
     cd backend
     npm install --production
     npm run build
     ```

4. **Prepare Database (RDS or Local)**:
   - Update `.env` with production DB credentials (RDS Endpoint).
   - Run migration/seed: `npm run seed`.

5. **Start Application**:
   ```bash
   pm2 start dist/main.js --name "aescion-api"
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx (Reverse Proxy)**:
   - Edit `/etc/nginx/sites-available/default`:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   - Restart Nginx: `sudo systemctl restart nginx`

---

## 3. Frontend Deployment (S3 + CloudFront)

1. **Build Frontend**:
   - In your local `frontend` folder:
     ```bash
     # Ensure VITE_API_URL points to your production API (e.g., https://api.yourdomain.com)
     npm run build
     ```
   - This creates a `dist` folder.

2. **Create S3 Bucket**:
   - Create a bucket (e.g., `aescion-web-prod`).
   - Uncheck "Block all public access".
   - Enable "Static website hosting".

3. **Upload Files**:
   - Upload contents of `dist/` to the bucket root.

4. **Configure CloudFront (SSL)**:
   - Create a CloudFront Distribution.
   - Origin Domain: Your S3 bucket website endpoint.
   - Viewer Protocol Policy: Redirect HTTP to HTTPS.
   - Custom SSL Certificate (ACM) if using a custom domain.

---

## 4. Updates & Maintenance
- **Backend Updates**: `git pull`, `npm install`, `npm run build`, `pm2 restart all`.
- **Frontend Updates**: Re-build locally and upload new assets to S3.
