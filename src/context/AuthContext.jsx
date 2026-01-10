// context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const token = localStorage.getItem('adminToken');
        const userData = localStorage.getItem('adminUser');

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
                logout();
            }
        }

        setLoading(false);

        // Setup periodic session check (every 5 minutes)
        // const interval = setInterval(() => {
        //     checkSession();
        // }, 5 * 60 * 1000);

        // return () => clearInterval(interval);
    }, []);

    // const checkSession = () => {
    //     const token = localStorage.getItem('adminToken');
    //     if (!token) {
    //         logout();
    //     }
    // };

    const login = async (email, password) => {
        // In real app, this would be an API call
        if (email === 'admin@example.com' && password === 'admin123') {
            const userData = {
                id: 1,
                name: 'Admin User',
                email: email,
                role: 'super_admin',
                // lastLogin: new Date().toISOString(),
            };

            localStorage.setItem('adminToken', 'demo_token_12345');
            localStorage.setItem('adminUser', JSON.stringify(userData));
            setUser(userData);

            return { success: true };
        }

        return { success: false, error: 'Invalid credentials' };
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setUser(null);
    };

    // const updateUser = (updatedData) => {
    //     const currentUser = { ...user, ...updatedData };
    //     localStorage.setItem('adminUser', JSON.stringify(currentUser));
    //     setUser(currentUser);
    // };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        // updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};