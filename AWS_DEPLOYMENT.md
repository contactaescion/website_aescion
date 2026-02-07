# AWS Production Deployment Guide

This guide provides a step-by-step procedure to deploy the AESCION website securely to AWS.

## 1. Prerequisites
- [ ] **AWS Account** with billing enabled.
- [ ] **Domain Name** (optional but recommended) managed via Route53 or another provider.
- [ ] **SSH Key Pair** (`.pem` file) for EC2 access.

## 2. Infrastructure Setup (AWS Console)

### Step 2.1: Database (RDS)
1.  Go to **RDS** service -> **Create database**.
2.  Choose **Standard create** -> **MySQL**.
3.  **Template**: Free tier (or Production).
4.  **Settings**:
    -   DB instance identifier: `aescion-db`
    -   Master username: `admin`
    -   Master password: `your-secure-password` (Save this!)
5.  **Connectivity**:
    -   Public access: **No** (Secure) or **Yes** (if you need to connect from home, restrict to your IP).
    -   VPC Security Group: Create new (allow port 3306).
6.  Create Database and wait for it to be available. Note the **Endpoint** (e.g., `aescion-db.xxx.us-east-1.rds.amazonaws.com`).

### Step 2.2: S3 Bucket (for User Uploads)
1.  Go to **S3** -> **Create bucket**.
2.  Name: `aescion-gallery-prod` (must be unique).
3.  **Block Public Access**:
    -   Uncheck "Block all public access" (if you want images to be publicly viewable directly).
    -   *Better Security:* Keep blocked and use CloudFront, but for simplicity, uncheck for now and acknowledge the warning.
4.  Create bucket.
5.  **CORS Configuration** (Permissions tab):
    ```json
    [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
            "ExposeHeaders": []
        }
    ]
    ```

### Step 2.3: IAM User (For App Access to S3)
1.  Go to **IAM** -> **Users** -> **Create user**.
2.  Name: `aescion-app-user`.
3.  Attach policies directly: `AmazonS3FullAccess` (or restrict to your specific bucket).
4.  Create User.
5.  **Security credentials** -> **Create access key**.
6.  **Save the Access Key ID and Secret Access Key**. You will need these for the backend `.env`.

---

## 3. Backend Deployment (EC2)

### Step 3.1: Launch Instance
1.  **EC2** -> **Launch Instance**.
2.  **OS**: Ubuntu 22.04 LTS.
3.  **Instance Type**: `t2.micro` (Free tier) or `t3.small`.
4.  **Key Pair**: Select your `.pem` key.
5.  **Network Settings (Security Group)**:
    -   Allow **SSH** (Port 22) from **My IP**.
    -   Allow **HTTP** (Port 80) from **Anywhere**.
    -   Allow **HTTPS** (Port 443) from **Anywhere**.

### Step 3.2: Configure Server
Connect to your instance:
```bash
ssh -i "path/to/key.pem" ubuntu@your-ec2-public-ip
```

Run the setup commands:
```bash
# Update OS
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx and PM2
sudo apt install -y nginx
sudo npm install -g pm2
```

### Step 3.3: Deploy Code
1.  **Upload Code**: use SCP or Git to get your `backend` folder onto the server (e.g., `/home/ubuntu/aescion/backend`).
    ```bash
    # Example SCP from your local machine
    scp -i key.pem -r ./backend ubuntu@ec2-ip:/home/ubuntu/aescion/
    ```
2.  **Install Dependencies**:
    ```bash
    cd ~/aescion/backend
    npm ci --production
    ```

### Step 3.4: Configure Environment & Start
1.  Create `.env` file:
    ```bash
    nano .env
    ```
2.  **Paste and Fill** the following (derived from `.env.example`):
    ```env
    PORT=3000
    NODE_ENV=production
    ALLOWED_ORIGINS=https://yourdomain.com
    
    # Database (RDS Details)
    DB_TYPE=mysql
    DB_HOST=aescion-db.xxx.us-east-1.rds.amazonaws.com
    DB_PORT=3306
    DB_USERNAME=admin
    DB_PASSWORD=your-rds-password
    DB_DATABASE=aescion
    
    # Security
    JWT_SECRET=GENERATED_SECURE_RANDOM_STRING
    
    # Mail
    MAIL_USER=your-email@gmail.com
    MAIL_PASS=your-app-password
    
    # AWS S3 (From Step 2.3)
    AWS_REGION=us-east-1
    AWS_ACCESS_KEY_ID=AKIA...
    AWS_SECRET_ACCESS_KEY=...
    AWS_S3_BUCKET=aescion-gallery-prod
    ```
3.  **Start App**:
    ```bash
    npm run build
    pm2 start dist/main.js --name "api"
    pm2 save
    pm2 startup
    ```

### Step 3.5: Configure Nginx (Reverse Proxy)
1.  Edit config: `sudo nano /etc/nginx/sites-available/default`
2.  Replace with:
    ```nginx
    server {
        listen 80;
        server_name api.yourdomain.com; # OR your EC2 Public IP

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
3.  Restart: `sudo systemctl restart nginx`.

---

## 4. Frontend Deployment (S3 Static Hosting)

### Step 4.1: Build Locally
1.  In your local `frontend` folder, create/edit `.env`:
    ```env
    # Point to your EC2 domain/IP
    VITE_API_URL=http://ec2-xx-xx-xx.compute-1.amazonaws.com
    ```
2.  Build:
    ```bash
    npm run build
    # This creates the 'dist' folder
    ```

### Step 4.2: Host on S3
1.  Create another S3 bucket: `aescion-frontend-prod`.
2.  **Permissions**: Uncheck "Block all public access".
3.  **Policy**: Add bucket policy to allow public read:
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::aescion-frontend-prod/*"
            }
        ]
    }
    ```
4.  **Properties** -> **Static website hosting** -> Enable -> Index document: `index.html`.
5.  **Upload**: Upload **contents** of `dist` folder to this bucket.

### Step 4.3: CloudFront (Recommended for HTTPS)
1.  Create Distribution -> Origin Domain = S3 Bucket Website Endpoint.
2.  Viewer Protocol Policy: Redirect HTTP to HTTPS.

---

## 5. Final Security Checklist
- [ ] **EC2 Security Group**: Only ports 22, 80, 443 open.
- [ ] **RDS Security Group**: Only allows traffic from EC2 Security Group (Port 3306).
- [ ] **S3 Permissions**: `aescion-gallery-prod` is private (accessed via IAM keys), `aescion-frontend-prod` is public (read-only).
- [ ] **Environment Variables**: `JWT_SECRET` is strong and unique. `NODE_ENV` is set to `production`.
