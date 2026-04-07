import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2a5298] p-4">
      {/* Glassmorphism Card */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white border-opacity-20 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-blue-100 opacity-80">Smart Campus Group 177</p>
        </div>

        {/* Normal Login Form */}
        <form className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full px-5 py-3 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-300 transform hover:-translate-y-1">
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white bg-opacity-30"></div>
          <span className="px-4 text-blue-100 text-sm">OR</span>
          <div className="flex-1 h-px bg-white bg-opacity-30"></div>
        </div>

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 rounded-xl transition duration-300 shadow-md"
        >
          <FcGoogle size={24} />
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-blue-100 text-sm mt-8">
          Don't have an account? <span className="font-semibold cursor-pointer hover:underline">Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;