// // App.jsx
// import { BrowserRouter as Router, Routes, Route } from 'react-router';
// import Layout from './Layout';

// // Import your page components
// import Dashboard from './pages/Dashboard';
// // import Dashboard from './pages/Dashboard';
// // import Users from './pages/Users';
// // import Roles from './pages/Roles';
// // import LeaveDashboard from './pages/LeaveDashboard';
// // import LeaveRequests from './pages/LeaveRequests';
// // import Reports from './pages/Reports';
// // import Settings from './pages/Settings';
// // import NotFound from './pages/NotFound';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/admin" element={<Layout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           {/* <Route path="users" element={<Users />} />
//           <Route path="roles" element={<Roles />} />
//           <Route path="leave-dashboard" element={<LeaveDashboard />} />
//           <Route path="leave-requests" element={<LeaveRequests />} />
//           <Route path="reports" element={<Reports />} />
//           <Route path="settings" element={<Settings />} /> */}
//         </Route>
//         {/* <Route path="*" element={<NotFound />} /> */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// App.jsx


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './pages/Login';
import Layout from './Layout';

// Import all your pages
import Dashboard from './pages/Dashboard';
import BannerManagement from './pages/BannerManagement';
import MenuManagement from './pages/MenuManagement';
import MenuContent from './pages/MenuManagement/MenuContent';
import MenuList from './pages/MenuManagement/MenuList';
import TeamManagement from './pages/TeamManagement';
import BranchManagement from './pages/BranchManagement';
import CareerManagement from './pages/CareerManagement';
import GalleryManagement from './pages/GalleryManagement';
import FormManagement from './pages/FormManagement';
import Review from './pages/Review';
import Footer from './pages/Footer';
import AboutUs from './pages/AboutUs';
import ContentManagement from './pages/ContentManagement';
import Seo from './pages/Seo';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            {/* 🔓 Login */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="banners" element={<BannerManagement />} />
              <Route path="menu" element={<MenuManagement />} />
              <Route path="menu/content" element={<MenuContent />} />
              <Route path="menu/list" element={<MenuList />} />

              <Route path="team" element={<TeamManagement />} />
              <Route path="branchs" element={<BranchManagement />} />
              <Route path="career" element={<CareerManagement />} />
              <Route path="gallery" element={<GalleryManagement />} />
              <Route path="form" element={<FormManagement />} />
              <Route path="review" element={<Review />} />
              <Route path="footer" element={<Footer />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="seo" element={<Seo />} />

              {/* Add all other admin routes here */}
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;