import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TrainingPage } from './pages/TrainingPage';
import { LandingPage } from './pages/LandingPage';
import RecruitmentPage from './pages/RecruitmentPage';
import { Login } from './pages/admin/Login';
import { ForgotPassword } from './pages/admin/ForgotPassword';
import { ResetPassword } from './pages/admin/ResetPassword';
import { AdminLayout } from './layouts/AdminLayout';
import { TrainingLayout } from './layouts/TrainingLayout';
import { RecruitmentLayout } from './layouts/RecruitmentLayout';
import { LandingLayout } from './layouts/LandingLayout';
import { CoursesManager } from './pages/admin/CoursesManager';
import { GalleryManager } from './pages/admin/GalleryManager';
import { EnquiriesManager } from './pages/admin/EnquiriesManager';
import { PopupManager } from './pages/admin/PopupManager';
import { ScrollNavigation } from './components/layout/ScrollNavigation';
import { Dashboard } from './pages/admin/Dashboard';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PageTracker } from './components/common/PageTracker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Landing Flow (Common) */}
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* 2. Training Flow (Students) */}
        <Route path="/training" element={<TrainingLayout />}>
          <Route index element={<TrainingPage />} />
          <Route path="*" element={<Navigate to="/training" replace />} />
        </Route>

        {/* 3. Recruitment Flow (HR) */}
        <Route path="/recruitment" element={<RecruitmentLayout />}>
          <Route index element={<RecruitmentPage />} />
          <Route path="*" element={<Navigate to="/recruitment" replace />} />
        </Route>

        {/* 4. Admin Flow (Internal) */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />

            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'STAFF']} />}>
              <Route path="courses" element={<CoursesManager />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="popups" element={<PopupManager />} />
            </Route>

            <Route path="enquiries" element={<EnquiriesManager />} />

            {/* Default redirect */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* Catch all: Redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <PageTracker />
      <ScrollNavigation />
    </BrowserRouter>
  );
}

export default App;
