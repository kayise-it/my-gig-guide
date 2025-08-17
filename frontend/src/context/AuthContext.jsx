// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        let user = null;
        
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                user = JSON.parse(userStr);
            }
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            // Clear invalid data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }

        if (token && user) {
            setCurrentUser(user);
        }
        setIsLoading(false);
    }, []);

    const login = (token, user) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    // Derive isAuthenticated and role from currentUser
    const value = {
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || null,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };