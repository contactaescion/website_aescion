# How to Seed Your Database (Initialize Admin User)

Since this is a fresh deployment, your database is empty. You need to run the **seed script** to create the initial **Super Admin** user and default courses.

## 1. SSH into your Server
```bash
ssh -i "path/to/aesciontech-key.pem" ubuntu@13.49.75.255
```

## 2. Navigate to the Backend Directory
```bash
cd ~/app/backend
```

## 3. Run the Seed Script
Run this command to execute the seed file:
```bash
node dist/seed.js
```

**Expected Output:**
```
Seeding Users...
Creating Admin user...
Admin user created
Seeding Courses...
...
Courses seeded
Gallery seeded
```

## 4. Login to Admin Panel
Now you can log in to your website!

*   **URL:** [https://aesciontech.com/admin](https://aesciontech.com/admin) (or wherever your login page is)
*   **Email:** `contact.aescion@gmail.com`
*   **Password:** `AESCION@123`

**⚠️ IMPORTANT:**
Once you log in, please **change this password immediately** or create a new admin user and delete this one for security.
