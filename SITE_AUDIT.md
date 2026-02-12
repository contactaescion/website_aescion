# AESCION EDTECH SOLUTIONS - Corporate Website Audit Report

**Date:** 2026-02-12  
**Auditor Role:** Interim CTO / Technical Consultant  
**Status:** Critical Review

---

## 1. Technical Architecture Review

### **Frontend Architecture**
*   **Structure:** The project uses a standard React+Vite structure. Using `layouts/` is a good practice.
*   **State Management:** Currently relies heavily on local `useState` and `useEffect`.
    *   **Risk:** No global state management (Redux/Zustand) or Server State management (React Query). This leads to "prop drilling" and duplicate API calls when navigating between pages (e.g., fetching Gallery images every time the Landing Page loads).
*   **Performance:**
    *   `Courses.tsx` fetches **all** courses and filters them client-side. This is acceptable for < 100 courses but will cause major performance degradation as the catalog grows.
    *   **Recommendation:** Implement server-side pagination and filtering for Courses and Gallery.

### **Backend Architecture**
*   **Modularity:** NestJS module structure is well-organized (`courses`, `gallery`, `auth`).
*   **Database:**
    *   **Current:** SQLite (Dev) / MySQL (Prod).
    *   **Gap:** The `Course` entity (`courses.entity.ts`) **lacks an `image_url` field**. This is a major omission for an EdTech platform where course thumbnails are critical for conversion.
*   **API Security:** 
    *   `helmet` is configured, but `rateLimit` is generic.
    *   CORS is dependent on `ALLOWED_ORIGINS` env var. If this is misconfigured in production, all API calls will fail.

---

## 2. React Issue Diagnosis: "Images & Courses Not Loading"

**Problem:** Users report images/courses not loading or vanishing during navigation.

**Root Causes:**
1.  **Missing Scroll Management (`CRITICAL`):**
    *   **Diagnosis:** The application lacks a `ScrollToTop` component. When a user navigates from the bottom of the "Home" page to "Training", React Router swaps the content, but the browser **stays scrolled down**.
    *   **Result:** The user sees a blank white space (the bottom of the new page) and assumes content didn't load.
2.  **S3 Signed URL Expiration:**
    *   **Diagnosis:** `GalleryService` generates S3 signed URLs with a 1-hour expiry (`expiresIn: 3600`).
    *   **Result:** If a user leaves a tab open for >1 hour and tries to interact, images will break.
3.  **Relative Asset Paths:**
    *   **Diagnosis:** In Dev/Mock mode, images are served like `http://localhost:3000/uploads/file.jpg`. If the frontend attempts to access standard components without the correct base URL, or if the `API_URL` environment variable is missing in production, images will 404.

**Immediate Fixes:**
1.  **Create `ScrollToTop.tsx`:**
    ```tsx
    import { useEffect } from "react";
    import { useLocation } from "react-router-dom";

    export default function ScrollToTop() {
      const { pathname } = useLocation();

      useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname]);

      return null;
    }
    ```
    *Add this inside `<BrowserRouter>` in `App.tsx`.*

2.  **Course Images:** Add `image_url` column to `Course` entity and update the frontend `Card` component to display it. currently, it just shows a Generic Icon.

---

## 3. UI/UX Improvements

### **Homepage Conversion**
*   **Hero Section:** Current hero is likely generic. Needs a "High-Stakes" headline.
    *   *Change:* "Welcome to AESCION" -> "Launch Your Tech Career with Government-Certified Training."
*   **Trust Signals:** The GST and MSME numbers are hidden or small. Move "Government Recognized" badges to the Hero or immediately below it (Trust Bar).

### **Internship/Workshop Presentation**
*   **Current:** Buried in general lists.
*   **Improvement:** create a dedicated "Upcoming Cohorts" section with countdown timers to create urgency (FOMO).

### **Mobile Responsiveness Audit**
*   [ ] **Hamburger Menu:** Ensure it closes automatically after clicking a link.
*   [ ] **Table Overflows:** detailed course syllabus tables often break mobile layouts. Use card views for mobile.
*   [ ] **Touch Targets:** Ensure "Enquire" buttons are at least 44px height.

---

## 4. SEO & Ranking Improvements

### **Technical SEO**
*   **Meta Tags:** Currently, standard React apps have one static Title/Description.
*   **Action:** Implement `react-helmet-async` to dynamically update `<title>` and `<meta name="description">` for every route (e.g., "Python Course - Tirunelveli | AESCION").

### **Local SEO (Tirunelveli/Tamil Nadu)**
*   **Strategy:** You are competing locally.
    *   Create dedicated landing pages for location-based keywords:
        *   `/training/python-training-tirunelveli`
        *   `/training/software-testing-course-tamil-nadu`
    *   Embed a Google Map on the Contact page.
    *   Register "AESCION EDTECH SOLUTIONS" on Google My Business immediately.

### **Structured Data (Schema.org)**
*   Add `Course` schema to your Course pages so Google displays them as "Courses" in search results (Rich Snippets).

---

## 5. Business Positioning Feedback

### **Market Positioning**
*   **Strength:** "Government Registered" is your biggest differentiator against freelance trainers. Lean heavily into "Certified," "Regulated," and "Job-Ready."
*   **Weakness:** The current brand feels "Generic EdTech."
*   **Fix:** Pivot to "The Enterprise Bridge." You don't just teach; you are an IT Development firm that trains students on **live client projects**. This is a massive selling point.

### **Revenue Expansion**
*   **B2B Corporate Training:** Don't just target students. Target local colleges. Offer "bundled internship programs" to engineering colleges in Tirunelveli.
*   **SaaS Products:** Since you have a dev team, build a simple "College Management System" or "Placement Tracker" and license it to the schools you visit.

---

## 6. Admin Dashboard Review

### **Security & Access**
*   **Issue:** `UserRole.STAFF` seems to have broad access.
*   **Fix:** Implement granular permissions. A "Sales" role should see Enquiries but NOT be able to delete Courses.

### **Lead Tracking**
*   **Missing:** No "Status Pipeline" (New -> Contacted -> Interested -> Converted -> Cold).
*   **Recommendation:** Add a `status` column to the `Enquiry` entity and a Kanban-style board in the admin panel to track follow-ups.

---

## 7. AWS Deployment Review

### **Security Hardening**
*   **Private S3:** Ensure the S3 bucket is **Private** (Block Public Access). The current implementation uses Signed URLs, which is good, but ensure the bucket policy doesn't accidentally allow public reads.
*   **RDS Security:** Ensure the RDS instance is **NOT public**. It should only be accessible from the EC2/ECS security group.

### **Cost Optimization**
*   **Frontend:** Hosting on S3 + CloudFront is excellent (essentially free).
*   **Backend:** Running EC2 24/7 for a low-traffic regional site is wasteful.
    *   **Recommendation:** Use **AWS App Runner** or **ECS Fargate** (Serverless containers). It scales to zero or low cost when unused.

### **Logging**
*   **Missing:** Centralized logging. If the backend fails, you have to SSH into EC2?
*   **Fix:** Integrate **CloudWatch Logs** for NestJS.

---

## **Summary Scorecard**
*   **Architecture:** B+ (Solid choice of stack)
*   **UX/UI:** C (Functional but lacks polish and scroll management)
*   **Business Potential:** A- (Strong local niche, needs better positioning)
*   **Readiness:** **NOT READY**. Fix the specific React "blank page" issues and Course Image data before marketing launch.
