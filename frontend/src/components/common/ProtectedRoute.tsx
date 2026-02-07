import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    const isAuthenticated = !!sessionStorage.getItem('access_token');

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};
