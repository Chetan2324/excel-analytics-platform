import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackgroundVideo from '../assets/videos/background-video.mp4';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => { setIsLoaded(true); }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const response = await axios.post(`${API_URL}/api/auth/login`, formData);
            toast.success(response.data.message);
            localStorage.setItem('auth-token', response.data.token);
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred during login.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 overflow-hidden relative">
            <video autoPlay loop muted playsInline className="absolute top-1/2 left-1/2 w-full h-full object-cover transform -translate-x-1/2 -translate-y-1/2 z-0">
                <source src={BackgroundVideo} type="video/mp4" />
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10"></div>
            <div className="relative min-h-screen grid place-items-center p-8 z-20">
                <div className={`bg-gray-800 bg-opacity-75 p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-md transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 animate-pulse mb-8">
                        Welcome Back
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="shadow-lg appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="shadow-lg appearance-none border border-gray-600 bg-gray-700 rounded-lg w-full py-3 px-4 text-white mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" required />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <button type="submit" className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition-all transform hover:scale-105 active:scale-95 text-base">Log In</button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-8">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-bold text-teal-400 hover:text-teal-300 transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;