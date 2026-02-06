import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicPage } from './pages/PublicPage';
import { Login } from './pages/admin/Login';
import { ForgotPassword } from './pages/admin/ForgotPassword';
import { ResetPassword } from './pages/admin/ResetPassword';
import { AdminLayout } from './layouts/AdminLayout';
import { CoursesManager } from './pages/admin/CoursesManager';
import { GalleryManager } from './pages/admin/GalleryManager';
import { EnquiriesManager } from './pages/admin/EnquiriesManager';
import { PopupManager } from './pages/admin/PopupManager';
import { ScrollNavigation } from './components/layout/ScrollNavigation';
import { Dashboard } from './pages/admin/Dashboard';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<CoursesManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="enquiries" element={<EnquiriesManager />} />
          <Route path="popups" element={<PopupManager />} />
          {/* Default redirect */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ScrollNavigation />
    </BrowserRouter>
  );
}

export default App;
