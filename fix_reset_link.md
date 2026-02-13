# Fix Password Reset Link (Localhost Issue)

The reason your password reset link says `localhost` is that we missed one environment variable on the server.

## 1. SSH into Server
```bash
ssh -i "path/to/aesciontech-key.pem" ubuntu@13.60.9.145
```

## 2. Edit .env File
```bash
nano ~/app/backend/.env


```

## 3. Add FRONTEND_URL
Scroll to the bottom of the file and add this line:

```env
FRONTEND_URL=https://aesciontech.com
```

## 4. Save and Restart
1.  Press `Ctrl+O`, `Enter` to save.
2.  Press `Ctrl+X` to exit.
3.  Restart the backend:
    ```bash
    pm2 restart aescion-backend
    ```

Now request a new password reset email. The link will be correct!
