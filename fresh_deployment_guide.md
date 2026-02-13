# Fresh Deployment Guide (Start From Scratch)

Follow this guide exactly to fix your deployment.

## Phase 1: GitHub Configuration (Crucial!)
You are seeing "500 Internal Server Error" because your server might be missing configurations, but the GitHub Actions tab typically shows "Success" on build but maybe "Failure" on deploy, or you successfully deployed code but it failed to run.

**You MUST add these 3 secrets in GitHub -> Settings -> Secrets and variables -> Actions:**
1.  **Name:** `EC2_HOST`
    *   **Value:** `13.60.9.145`
2.  **Name:** `EC2_USERNAME`
    *   **Value:** `ubuntu`
3.  **Name:** `EC2_SSH_KEY`
    *   **Value:** (Copy the **entire** content of your `.pem` file, starting from `-----BEGIN RSA PRIVATE KEY-----` to `-----END RSA PRIVATE KEY-----`)

*Currently, your screenshot shows only `AESCION_WEBSITE`, which is NOT used by our pipeline.*

## Phase 2: Server Cleanup & Setup
SSH into your server:
```bash
ssh -i "aesciontech-key.pem" ubuntu@13.60.9.145
```

Running these commands helps ensure a clean state:
```bash
# 1. Stop existing processes
pm2 delete all
pm2 save --force

# 2. Clean app directory
rm -rf ~/app/backend
rm -rf ~/app/frontend
mkdir -p ~/app/backend

# 3. Re-create .env file (CRITICAL)
nano ~/app/backend/.env
```
*Paste the content from the `.env.production.example` file you have locally.* **Make sure to fill in your AWS Keys!**

## Phase 3: Push & Deploy
Now that GitHub secrets are set and server is clean:

1.  Open your local terminal.
2.  Run:
    ```bash
    git add .
    git commit -m "Fix deployment workflow"
    git push origin main
    ```
3.  Go to **GitHub Actions** tab and watch the build.

## Phase 4: Verification
After GitHub Actions says **Success**:
1.  Check your website: [https://aesciontech.com](https://aesciontech.com)
2.  If it still fails, run this on server to see why:
    ```bash
    pm2 logs
    ```
