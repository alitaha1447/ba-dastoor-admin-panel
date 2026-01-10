// Layout.jsx
import React from 'react'
import { Outlet, useNavigate } from 'react-router'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Footer from './components/Footer'
import { useAuth } from './context/AuthContext'

const Layout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });

    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar onLogout={handleLogout} />
            <div className='flex-1 flex flex-col lg:ml-64'>
                <Header />
                <main className='flex-1 p-6'>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default Layout