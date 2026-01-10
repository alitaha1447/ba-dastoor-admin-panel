// components/ProtectedRoute.jsx
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {

    const { isAuthenticated, loading } = useAuth();

    if (loading) return null;

    return isAuthenticated ? children : <Navigate to="/login" replace />;

    // Check if user is authenticated
    // const isAuthenticated = () => {
    //     const token = localStorage.getItem('adminToken');
    //     return !!token; // Returns true if token exists
    // };

    // Check session expiration (simplified - in real app, validate JWT)
    // const checkSessionExpired = () => {
    //     // For demo, we'll just check if token exists
    //     // In real app, check token expiration
    //     return false;
    // };

    // if (!isAuthenticated()) {
    //     // Redirect to login if not authenticated
    //     return <Navigate to="/login" replace />;
    // }

    // if (checkSessionExpired()) {
    //     // Clear expired session and redirect
    //     localStorage.removeItem('adminToken');
    //     localStorage.removeItem('adminUser');
    //     return <Navigate to="/login" replace />;
    // }

    return children;
};

export default ProtectedRoute;