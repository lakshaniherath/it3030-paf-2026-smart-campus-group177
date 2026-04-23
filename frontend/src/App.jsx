import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import TicketListPage from './pages/TicketListPage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-brand">🏫 Smart Campus</div>
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            All Tickets
          </NavLink>
          <NavLink to="/tickets/new" className={({ isActive }) => isActive ? 'active' : ''}>
            + New Ticket
          </NavLink>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<TicketListPage />} />
          <Route path="/tickets/new" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}
