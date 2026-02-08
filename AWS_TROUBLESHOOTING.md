# Troubleshooting AWS Upload Issues

## 0. CRITICAL: Run Commands on Server!
You must be connected to your AWS server to run these commands.
Your terminal prompt should look like: `ubuntu@ip-172-xx-xx-xx:~/backend$`
**NOT** like: `PS C:\Users\tskar\...`

## 1. Restart Services (After .env changes)
If you changed `.env` or Nginx config, you **MUST** restart for changes to apply:
```bash
# Restart Backend (Apply .env changes)
pm2 restart api

# Restart Nginx (Apply upload limit changes)
sudo systemctl restart nginx
```

## 2. Check the Error Code (Browser)
1.  On your website, right-click -> **Inspect**.
2.  Go to the **Network** tab.
3.  Try to upload the image again.
4.  Look for the red line (the failed request) and check the **Status** column:

*   **413 Payload Too Large**: Nginx is blocking the file size.
    *   *Fix:* Edit `/etc/nginx/sites-available/default` and add `client_max_body_size 10M;`.
*   **403 Forbidden / 401 Unauthorized**: AWS Keys are wrong or Bucket Name is wrong.
    *   *Fix:* Check `AWS_ACCESS_KEY_ID` and `AWS_S3_BUCKET` in `.env`.
*   **500 Internal Server Error**: Backend crashed or syntax error in code.
    *   *Fix:* Run `pm2 logs api` to see the crash error.
*   **CORS Error ( Console Tab )**: "Blocked by CORS policy".
    *   *Fix:* Check `ALLOWED_ORIGINS` in `.env`.

## 3. Verify .env File
Ensure there are no spaces around the `=` sign and no duplicate keys.
```bash
cat .env
```

## 4. View Backend Logs
To see exactly why the server is rejecting the file:
```bash
pm2 logs api --lines 50
```
*Look for "Error" or "Exception" messages.*
