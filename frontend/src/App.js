// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; // Dashboard එකත් හදලා තියෙනවා නම්

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        { <Route path="/dashboard" element={<Dashboard />} /> }
        <Route path="/" element={<Login />} /> {/* Default route එක */}
      </Routes>
    </Router>
  );
}

export default App;