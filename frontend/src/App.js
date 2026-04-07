import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import ResourcesCatalogPage from './features/resources/pages/ResourcesCatalogPage';
import ResourceDetailsPage from './features/resources/pages/ResourceDetailsPage';
import AdminResourceManagementPage from './features/resources/pages/AdminResourceManagementPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<ResourcesCatalogPage />} />
            <Route path="/resources/:id" element={<ResourceDetailsPage />} />
            <Route path="/admin/resources" element={<AdminResourceManagementPage />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
