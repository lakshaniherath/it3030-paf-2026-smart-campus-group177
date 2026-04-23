import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Check local storage for initial state
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('mockUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (role = 'ADMIN') => {
        const mockUser = {
            id: '1',
            name: role === 'ADMIN' ? 'System Administrator' : 'Staff Member',
            role: role,
            email: 'admin@smartcampus.edu'
        };
        setUser(mockUser);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('mockUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
