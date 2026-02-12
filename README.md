# AESCION Website Project Documentation

## 1. Project Overview
This project is a modern, full-stack corporate website for **AESCION**, designed to showcase services, training courses, and company gallery while facilitating client enquiries. It features a high-performance public-facing site and a secure, comprehensive admin dashboard for content management.

## 2. Technology Stack

### Frontend
- **Framework**: React (v19) with Vite
- **Styling**: TailwindCSS (v4)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM (v7)
- **HTTP Client**: Axios
- **State Management**: React Hooks & Context

### Backend
- **Framework**: NestJS (v11)
- **Language**: TypeScript
- **Database**: 
  - **Development**: SQLite (`aescion.sqlite`)
  - **Production**: MySQL (AWS RDS recommended)
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Storage**: AWS S3 (for image uploads)
- **Email**: Nodemailer (SMTP)
- **Values**: Validation Pipes, Rate Limiting, Helmet Security

## 3. Project Structure & Modules

The project is organized as a monorepo with `frontend` and `backend` directories.

```
/AESCION/Files/Website_Files
├── backend/            # NestJS Backend API
│   ├── src/
│   │   ├── analytics/  # Tracks site visits and page views
│   │   ├── auth/       # JWT Authentication & Guards
│   │   ├── courses/    # Course management (CRUD, Search)
│   │   ├── enquiries/  # Contact form handling & Email triggers
│   │   ├── gallery/    # Image upload & S3 management
│   │   ├── mail/       # Email service implementation
│   │   ├── popups/     # Marketing popup management
│   │   ├── search/     # Global search functionality (Courses + Gallery)
│   │   ├── testimonials/# Client testimonials management
│   │   ├── users/      # Admin user management
│   │   └── ...
├── frontend/           # React Frontend Application
│   ├── src/
│   │   ├── components/ # Reusable UI & Layouts
│   │   ├── pages/      # Public & Admin Views
│   │   ├── api/        # Axios integration
│   │   └── ...
└── README.md           # This file
```

## 4. Key Features

### Public Website
- **Dynamic Content**: Real-time fetching of Courses, Gallery, and Services.
- **Search**: Site-wide search for finding courses and images instantly.
- **Responsive Design**: Optimized for Desktop, Tablet, and Mobile.
- **Enquiry System**: Contact forms integrated with email notifications.
- **Performance**: Lazy loading, optimized assets, and fast routing.

### Admin Dashboard
- **Secure Access**: Protected via JWT Authentication.
- **Analytics Dashboard**: Visual overview of site traffic and potential leads.
- **Course Management**: Add, edit, delete, and feature training courses.
- **Gallery Management**: Upload images directly to AWS S3.
- **Enquiry Tracking**: View and manage incoming enquiries.
- **Marketing**: Manage promotional popups.

## 5. AWS Hosting & Deployment Guide

To host this application on AWS, follow standard industry practices for security and scalability.

### Architecture Overview
- **Frontend**: Hosted on **AWS S3** (Static Hosting) served via **AWS CloudFront** (CDN & SSL).
- **Backend**: Containerized with **Docker** and deployed on **AWS ECS (Fargate)** or **AWS EC2**.
- **Database**: **AWS RDS (MySQL)** for persistent data storage.
- **Storage**: **AWS S3** bucket for user-uploaded images (Gallery/Courses).
- **Domain**: Managed via **AWS Route 53**.

### Improvements & Changes Needed for AWS

#### 1. Database Migration (SQLite -> MySQL)
The current setups uses SQLite for development. For AWS, you must switch to MySQL (RDS).
- **Action**: Provision an RDS MySQL instance.
- **Config**: Update `backend/.env` to point to the RDS endpoint.
  ```env
  DB_TYPE=mysql
  DB_HOST=your-rds-endpoint.amazonaws.com
  DB_PORT=3306
  DB_USERNAME=admin
  DB_PASSWORD=your_password
  DB_DATABASE=aescion_db
  ```

#### 2. Backend Containerization (Docker)
Create a `Dockerfile` in the `/backend` directory to containerize the NestJS app.

**File: `backend/Dockerfile`**
```dockerfile
# Base image
FROM node:18-alpine

# Working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start:prod"]
```

#### 3. Frontend Build & Deployment
The frontend should be built as static assets.
- **Build Command**: `cd frontend && npm run build`
- **Output**: The `dist` folder contains the production artifacts.
- **Deploy**: Sync the contents of `dist` to an S3 bucket configured for static website hosting.

#### 4. Environment Variables
Ensure all sensitive keys (AWS Keys, Database Credentials, JWT Secrets) are securely stored.
- **AWS Parameter Store** or **Secrets Manager** is recommended for production.
- For ECS, inject these as environment variables in the Task Definition.

#### 5. CORS Configuration
Update functionality in `main.ts` to allow requests from your production domain (e.g., `https://www.aescion.com`).

### Deployment Steps (Summary)

1.  **Database**: Create AWS RDS MySQL instance.
2.  **Backend**:
    -   Build Docker image: `docker build -t aescion-backend ./backend`
    -   Push to AWS ECR (Elastic Container Registry).
    -   Create ECS Service/Task Definition using the image.
    -   Set environment variables in ECS.
3.  **Frontend**:
    -   Build React app: `npm run build`
    -   Upload `frontend/dist` to S3 Bucket.
    -   Create CloudFront Distribution pointing to S3 Bucket.
4.  **DNS**: Point your domain (Route 53) to the CloudFront distribution (Frontend) and Load Balancer (Backend).

## 6. Local Development Setup

1.  **Clone Repository**: `git clone <repo_url>`
2.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # Config .env
    npm run start:dev
    ```
3.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---
*Documentation updated on 2026-02-12*
