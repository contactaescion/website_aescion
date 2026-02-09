# AESCION Website Project Documentation

## 1. Project Overview
This project is a modern, full-stack company website for **AESCION**, designed to showcase services, courses, and gallery, and facilitate enquiries. It consists of a high-performance public-facing site and a comprehensive admin dashboard for content management.

## 2. Technology Stack

### Frontend
- **Framework**: React (v18+) with Vite
- **Styling**: TailwindCSS (v3/v4)
- **State/Effects**: React Hooks
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**:
  - **Development**: SQLite (`aescion.sqlite`) (or MySQL via config)
  - **Production**: MySQL
- **ORM**: TypeORM
- **Storage**: AWS S3 (for image uploads) or Local Storage (Mock mode for dev)
- **Features**: JWT Authentication, Rate Limiting, Security Headers (Helmet)

## 3. Project Structure

The project is structured as a monorepo containing both frontend and backend applications.

```
/AESCION/Files/Website_Files
├── backend/            # NestJS Backend API
│   ├── src/           
│   │   ├── courses/    # Course management (CRUD, Search)
│   │   ├── enquiries/  # Enquiry processing & email notifications
│   │   ├── gallery/    # Image gallery with S3 integration
│   │   ├── auth/       # Authentication (JWT)
│   │   ├── mail/       # Email service (Nodemailer)
│   │   └── ...         # other modules (analytics, users, etc.)
│   └── ...
├── frontend/           # React Frontend Application
│   ├── src/
│   │   ├── components/ # Reusable UI components & Sections
│   │   ├── pages/      # Route pages (Public, Admin, Auth)
│   │   ├── api/        # Axios instances & API calls
│   │   └── ...
└── README.md           # This file
```

## 4. Key Features

### Public Website
- **Responsive Design**: Fully responsive layout optimized for all devices.
- **Dynamic Content**:
  - **Courses**: Browse and search available courses.
  - **Gallery**: View company events and photos.
  - **Services**: Overview of company offerings.
- **Enquiry System**: Interest forms for potential clients/students.
- **Recruitment**: Application portal for careers.

### Admin Dashboard
- **Secure Login**: JWT-based authentication for administrators.
- **Content Management**:
  - **Courses**: Add, edit, delete, and feature courses.
  - **Gallery**: Upload and manage images (supports AWS S3).
  - **Enquiries**: View, filter, and manage incoming enquiries.
- **Analytics**: Visualization of site traffic and user engagement.
- **Settings**: Manage admin profile and configurations.

## 5. Application Processes & Data Flow

### Enquiry Process
1.  **Submission**: User submits an enquiry form on the Public Website.
2.  **API Handler**: Backend `EnquiriesController` receives the request.
3.  **Processing**:
    -   `EnquiriesService` saves the enquiry to the Database.
    -   `MailService` is triggered to send an email notification to the admin.
4.  **Admin View**: Admin sees the new enquiry in the Dashboard and can update its status (e.g., 'Contacted', 'Resolved').

### Course Management
1.  **Creation**: Admin fills out the course form (Title, Description, Image).
2.  **Storage**: Image is uploaded to AWS S3 (or local mock).
3.  **Database**: Course details + Image URL are saved in the Database.
4.  **Public View**: The new course immediately appears on the "Courses" section of the public site.

### Authentication Flow
1.  **Login**: Admin enters credentials on `/admin/login`.
2.  **Verification**: Backend verifies hash against the database.
3.  **Token**: A generic JWT access token is returned.
4.  **Session**: Frontend stores the token (localStorage/cookie) and checks it via `AuthGuard` for protected routes.

## 6. Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running
1.  **Backend**:
    ```bash
    cd backend
    npm install
    # Set up .env as per .env.example
    npm run start:dev
    ```
    *Runs on `http://localhost:3000`*

2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    # Create .env with VITE_API_URL=http://localhost:3000
    npm run dev
    ```
    *Runs on `http://localhost:5173`*

3.  **Default Admin Credentials**:
    - **Email**: `admin@aescion.com` (check seeds or database)
    - **Password**: `admin123` (common default, check your specific seed file)
