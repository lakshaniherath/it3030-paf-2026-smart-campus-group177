import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiBarChart2, FiBell, FiLock, FiZap, FiGlobe, FiMenu, FiX } from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-md bg-white bg-opacity-5 border-b border-white border-opacity-10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Smart Campus</div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="#features" className="hover:text-blue-400 transition">Features</a>
            <a href="#about" className="hover:text-blue-400 transition">About</a>
            <button onClick={() => navigate('/login')} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition">Sign In</button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white bg-opacity-5 backdrop-blur-md border-t border-white border-opacity-10 p-4 space-y-4">
            <a href="#features" className="block hover:text-blue-400 transition py-2">Features</a>
            <a href="#about" className="block hover:text-blue-400 transition py-2">About</a>
            <button onClick={() => navigate('/login')} className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition">Sign In</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <div className="inline-block">
            <span className="px-4 py-2 bg-blue-500 bg-opacity-10 border border-blue-400 border-opacity-30 rounded-full text-sm text-blue-300">✨ The Future of Campus Management</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent leading-tight">
            Smart Campus Hub
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Streamline campus operations, enhance student engagement, and manage resources effortlessly with our intelligent campus management platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-full font-semibold flex items-center justify-center gap-2 transition transform hover:scale-105">
              Get Started <FiArrowRight />
            </button>
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 hover:bg-opacity-20 rounded-full font-semibold transition">
              Sign In
            </button>
          </div>
        </div>

        {/* Hero Image/Graphic */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-br from-blue-500 from-10% via-purple-500 via-50% to-emerald-500 to-90% opacity-10 rounded-3xl p-1">
            <div className="bg-[#0f172a] rounded-3xl p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6 text-center hover:bg-opacity-10 transition">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="text-sm text-slate-400">Analytics</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Powerful Features</h2>
        <p className="text-center text-slate-400 mb-16 max-w-2xl mx-auto">Everything you need to manage your campus efficiently</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FiUsers />}
            title="User Management"
            description="Easily manage students, faculty, and staff with role-based access control and permissions."
          />
          <FeatureCard
            icon={<FiBarChart2 />}
            title="Analytics & Insights"
            description="Real-time dashboards and detailed analytics to track campus activities and metrics."
          />
          <FeatureCard
            icon={<FiBell />}
            title="Notifications"
            description="Keep everyone informed with instant notifications for important campus events and updates."
          />
          <FeatureCard
            icon={<FiLock />}
            title="Security First"
            description="Enterprise-grade security with encrypted passwords and secure authentication protocols."
          />
          <FeatureCard
            icon={<FiZap />}
            title="Fast & Responsive"
            description="Lightning-fast performance with modern technology built for seamless user experience."
          />
          <FeatureCard
            icon={<FiGlobe />}
            title="Cloud Based"
            description="Access your campus hub from anywhere with our reliable cloud infrastructure."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <StatBox number="500+" label="Active Users" />
          <StatBox number="99.9%" label="Uptime" />
          <StatBox number="24/7" label="Support" />
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center space-y-6 border border-white border-opacity-10 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Campus?</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">Join hundreds of institutions already using Smart Campus to streamline operations and enhance student experience.</p>
          <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-blue-50 transition transform hover:scale-105">
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white border-opacity-10 mt-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Smart Campus</h3>
              <p className="text-sm text-slate-400">Transforming campus management globally.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400 hover:text-white transition">
                <li><a href="#features">Features</a></li>
                <li><a href="#about">Pricing</a></li>
                <li><a href="#about">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#about" className="hover:text-white transition">About</a></li>
                <li><a href="#about" className="hover:text-white transition">Contact</a></li>
                <li><a href="#about" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#about" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#about" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white border-opacity-10 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2026 Smart Campus. All rights reserved. | IT3030 PAF Group 177</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="group bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-3xl p-8 hover:bg-opacity-10 hover:border-blue-400 hover:border-opacity-30 transition transform hover:-translate-y-2 cursor-pointer">
    <div className="text-4xl mb-4 text-blue-400 group-hover:text-emerald-400 transition">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const StatBox = ({ number, label }) => (
  <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl p-8 text-center hover:scale-105 transition">
    <p className="text-4xl md:text-5xl font-bold mb-2">{number}</p>
    <p className="text-blue-100">{label}</p>
  </div>
);

export default Home;
