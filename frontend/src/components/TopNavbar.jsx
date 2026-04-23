import React from 'react';
import { Bell, Search, UserCircle, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopNavbar = () => {
  const { user, login, logout } = useAuth();

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-surface border-b border-bordercolor">
      <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
        <div className="flex-1 flex max-w-2xl items-center">
          <div className="relative w-full text-text-secondary focus-within:text-primary hidden sm:block">
             <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
               <Search className="h-5 w-5" />
             </div>
             <input className="block w-full h-10 pl-10 pr-3 py-2 border border-bordercolor rounded-xl text-sm placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm bg-background transition-colors" placeholder="Global search..." type="search" />
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <button className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-background transition-colors">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>
          
          <div className="border-l border-bordercolor h-6 mx-2 hidden sm:block"></div>
          
          {user ? (
              <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                      <UserCircle className="h-8 w-8 text-primary" />
                      <div className="ml-2 hidden sm:block font-medium text-sm text-text-primary">
                          {user.name}
                          <div className="text-xs text-text-secondary">{user.role}</div>
                      </div>
                  </div>
                  <button 
                      onClick={logout}
                      className="inline-flex items-center px-3 py-1.5 border border-bordercolor shadow-sm text-xs font-bold rounded-lg text-text-primary bg-surface hover:bg-background transition-colors"
                  >
                      <LogOut className="w-3.5 h-3.5 mr-1.5" />
                      Logout
                  </button>
              </div>
          ) : (
              <button 
                  onClick={() => login('ADMIN')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary-hover transition-colors"
              >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
              </button>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
