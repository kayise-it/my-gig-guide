// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('AuthContext: Initializing authentication state');
        const token = localStorage.getItem('token');
        let user = null;
        
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                user = JSON.parse(userStr);
                console.log('AuthContext: Found user in localStorage:', user);
            }
        } catch (error) {
            console.error('AuthContext: Error parsing user from localStorage:', error);
            // Clear invalid data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }

        if (token && user) {
            setCurrentUser(user);
            console.log('AuthContext: User authenticated:', user);
        } else {
            console.log('AuthContext: No valid authentication found');
        }
        setIsLoading(false);
    }, []);

    const login = (token, user) => {
        console.log('AuthContext: Login called with:', { token: !!token, user });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        console.log('AuthContext: User logged in successfully');
    };

    const logout = () => {
        console.log('AuthContext: Logout called');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        console.log('AuthContext: User logged out successfully');
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

    console.log('AuthContext: Current state:', {
        isAuthenticated: value.isAuthenticated,
        role: value.role,
        isLoading: value.isLoading,
        hasUser: !!currentUser
    });

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };