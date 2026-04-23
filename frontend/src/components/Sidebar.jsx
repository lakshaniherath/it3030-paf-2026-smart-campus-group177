import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, LayoutDashboard, CalendarDays, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:inset-y-0 md:fixed bg-secondary text-white">
      <div className="flex items-center h-16 px-6 bg-secondary font-bold text-xl tracking-wide border-b border-white/10">
        CampusHub
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        <NavLink to="/" className={({isActive}) => `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-white/10'}`}>
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Resource Catalog
        </NavLink>
        <NavLink to="/admin/resources" className={({isActive}) => `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-white/10'}`}>
          <Building2 className="w-5 h-5 mr-3" />
          Resource Admin
        </NavLink>
        {/* Placeholders for other members */}
        <div className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-500 cursor-not-allowed">
          <CalendarDays className="w-5 h-5 mr-3" />
          Bookings (Member 2)
        </div>
        <div className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-slate-500 cursor-not-allowed">
          <Settings className="w-5 h-5 mr-3" />
          Maintenance (Member 3)
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
