# AESCION Website Project Documentation

## 1. Project Overview
This project is a modern, full-stack company website for **AESCION**, designed to showcase services, courses, gallery, and contact information. It features a responsive UI, an admin dashboard for content management, visitor analytics, and a site-wide search functionality.

## 2. Technology Stack

### Frontend
- **Framework**: React (v19) with Vite
- **Styling**: TailwindCSS (v4)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: 
  - **Development**: SQLite (`aescion.sqlite`)
  - **Production**: MySQL (Configurable via environment variables)
- **ORM**: TypeORM
- **Storage**: AWS S3 (for image uploads) or Local Storage (Mock mode)

## 3. Project Structure

The project is invalid as a monorepo with `frontend` and `backend` directories.

### Root Directory
```
/AESCION/Files/Website_Files
├── backend/            # NestJS Backend API
├── frontend/           # React Frontend Application
├── README.md           # Project Documentation
└── ...
```

### Backend Structure (`/backend/src`)
- **app.module.ts**: Main application module, aggregates all feature modules.
- **main.ts**: Entry point, configures global pipes, CORS, compression, and security headers.
- **auth/**: Handles authentication (JWT strategy, Guards).
- **users/**: User management (Admin users).
- **courses/**: CRUD operations for Courses.
- **gallery/**: Image management with S3 integration.
- **search/**: **[NEW]** Aggregates search results from Courses and Gallery.
- **analytics/**: **[NEW]** Tracks visitor stats and page views.
- **testimonials/**, **enquiries/**, **popups/**, **mail/**: Other feature modules.

### Frontend Structure (`/frontend/src`)
- **api/**: API clients for communicating with the backend (e.g., `client.ts`, `search.ts`).
- **components/**:
  - **common/**: Reusable UI components (e.g., `SearchModal`, `MarketingPopup`).
  - **layout/**: `Navbar`, `Footer`, `AdminLayout`.
  - **sections/**: Landing page sections (`Hero`, `Services`, `Gallery`, `Courses`).
  - **ui-kit/**: Generic UI elements (`Card`, `Button`).
- **pages/**:
  - **PublicPage.tsx**: Main landing page with Lazy Loading for performance.
  - **admin/**: Dashboard and content management pages.
  - **auth/**: Login and password reset pages.

## 4. Key Features

1.  **Public Website**:
    -   Responsive Design with TailwindCSS.
    -   Lazy Loaded sections for fast initial load.
    -   marketing Popup on entry.

2.  **Admin Dashboard**:
    -   Manage Courses, Gallery, Enquiries, Popups.
    -   **Analytics Dashboard**: View total visitors, unique visitors, and trends.

3.  **Search Functionality**:
    -   Site-wide search (Courses & Gallery).
    -   Accessible via Navbar search icon (Desktop & Mobile).
    -   Instant results with debouncing.

4.  **Security & Performance**:
    -   **Security**: Helmet headers, Rate Limiting, JWT Auth, Role-based Access Control (RBAC).
    -   **Performance**: Gzip compression (Backend), Code Splitting (Frontend).

## 5. Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1.  **Backend**:
    ```bash
    cd backend
    npm install
    ```
2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    ```

### Running Locally
1.  **Start Backend**:
    ```bash
    cd backend
    npm run start:dev
    ```
    Runs on: `http://localhost:3000`

2.  **Start Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```
    Runs on: `http://localhost:5173`

## 6. Environment Variables

Create `.env` files in both directories based on your configuration.
**Backend (.env example)**:
```env
DB_TYPE=sqlite
JWT_SECRET=your_secret
AWS_ACCESS_KEY_ID=mock_key
AWS_SECRET_ACCESS_KEY=mock_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=aescion-gallery
```
