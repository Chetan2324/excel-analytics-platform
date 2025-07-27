import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your page components
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// A simple PrivateRoute component to protect dashboard
const PrivateRoute = ({ children }) => {
    // Check if a token exists in localStorage (using 'auth-token' as per your Login.js)
    const isAuthenticated = localStorage.getItem('auth-token');
    // If authenticated, render the children (Dashboard); otherwise, redirect to Login
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            {/* ToastContainer for notifications */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <Routes>
                {/* Default route: Redirects to Signup */}
                <Route path="/" element={<Navigate to="/signup" />} />

                {/* Public routes */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                {/* Protected route: Only accessible if authenticated */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                {/* Catch-all route for unmatched paths (404) */}
                <Route path="*" element={
                    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
                        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                    </div>
                } />
            </Routes>
        </Router>
    );
}

export default App;
