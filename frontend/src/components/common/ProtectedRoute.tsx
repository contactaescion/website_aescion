import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps = {}) => {
    const isAuthenticated = !!sessionStorage.getItem('access_token');
    const userRole = sessionStorage.getItem('user_role');

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // Redirect to dashboard if authorized generally, or login if not?
        // If they are on dashboard but not allowed, this might loop if not careful.
        // For now, if they strictly don't have access, maybe just null or Redirect to dashboard.
        // Assuming Dashboard is the base authorized route.
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};
