# Troubleshooting AWS Upload Issues

It looks like the file upload is failing. This is usually caused by one of three things:

## 1. CORS Error (Most Likely)
Your backend (EC2) might be rejecting requests from your new S3 domain.

**Fix:**
1.  SSH into your EC2 instance.
2.  Edit your `.env` file:
    ```bash
    nano ~/aescion/backend/.env
    ```
3.  Update `ALLOWED_ORIGINS` to include your exact frontend URL (from the screenshot):
    ```env
    ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://aescion-website-prod.s3-website.eu-north-1.amazonaws.com
    ```
    *(Note: Ensure there are no spaces between commas)*
4.  Restart the backend:
    ```bash
    pm2 restart api
    ```

## 2. Nginx File Size Limit
By default, Nginx limits uploads to 1MB. High-quality images usually exceed this.

**Fix:**
1.  Edit Nginx config on EC2:
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```
2.  Add `client_max_body_size 10M;` inside the `server` block (or `location /` block):
    ```nginx
    server {
        listen 80;
        server_name ...;
        
        client_max_body_size 10M;  # <--- ADD THIS LINE

        location / {
            ...
        }
    }
    ```
3.  Restart Nginx:
    ```bash
    sudo systemctl restart nginx
    ```

## 3. S3 Bucket Policy (CORS)
The S3 bucket itself might need to allow cross-origin requests if you are accessing it directly (though your backend handles the upload, so this is less likely, but good to check).

**Fix:**
1.  Go to AWS Console -> **S3** -> **aescion-gallery-prod**.
2.  **Permissions** tab -> **Cross-origin resource sharing (CORS)**.
3.  Ensure it looks like this:
    ```json
    [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
        }
    ]
    ```

## 4. Check Backend Logs
If it still fails, check the backend logs to see the specific error:
```bash
pm2 logs api
```
- If you see `AccessDenied`, your AWS IAM keys in `.env` are wrong.
- If you see `PayloadTooLarge`, it's the Nginx issue (Step 2).
