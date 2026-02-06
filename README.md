# ALL-IN-ONE AESCION Website Project Guide

This repository contains the complete source code for the AESCION Edtech Solutions website, including the Admin Panel and Backend API.

## Project Structure

- **frontend/**: React + Vite + Tailwind CSS application (Public Site + Admin Panel)
- **backend/**: NestJS + TypeORM + MySQL application (REST API)

---

## 1. Local Development Setup

### Prerequisites
- Node.js (v18+)
- MySQL Server
- Git

### Backend Setup
1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Create a `.env` file (copy from `.env.example` if available, or use the provided template).
   - Update `DB_PASSWORD` with your local MySQL root password.
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=aescion_db
   JWT_SECRET=supersecretkey
   AWS_S3_BUCKET=aescion-gallery
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=mock_key
   AWS_SECRET_ACCESS_KEY=mock_secret
   PORT=3000
   ```
4. Start the Database:
   - Ensure MySQL is running and the database `aescion_db` exists.
   - Run the seeder to create Admin user and initial courses:
   ```bash
   npm run seed
   ```
   *(If seed fails due to access denied, double check DB_PASSWORD in .env)*
5. Start the Server:
   ```bash
   npm run start:dev
   ```
   Server will run at `http://localhost:3000`.

### Frontend Setup
1. Navigate to `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   - Ensure `.env` exists with:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
4. Start the Development Server:
   ```bash
   npm run dev
   ```
   App will run at `http://localhost:5173`.

---

## 2. default Credentials

**Admin Panel**: `http://localhost:5173/admin/login`

- **Email**: `admin@aescion.com`
- **Password**: `admin123`

---

## 3. Features

### Public Website
- Single Page Application with smooth scrolling.
- Sections: Home, Services, Featured Course, Courses, Gallery, Testimonials, Contact.
- Responsive Apple-style Design.

### Admin Panel
- **Dashboard**: Overview of site activity.
- **Courses Management**: Add, Edit, Delete courses. Toggle "Featured" status.
- **Gallery Management**: Upload images to Gallery (Supports S3).
- **Testimonials/Enquiries**: View student feedback and contact requests.

---

## 4. Troubleshooting

- **Database Connection Error**: Verify `DB_PASSWORD` in `backend/.env`. ensure MySQL service is running.
- **Image Uploads Not Working**:
  - In local dev (`mock_key`), images are not actually uploaded to S3 but simulated.
  - For production, verify valid AWS Credentials in `.env`.

