// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAndMergeProfile = async (user) => {
        try {
            if (!user) return user;
            if (user.role === 3 && user.id) {
                const { data } = await axios.get(`${API_BASE_URL}/api/artists/${user.id}`);
                if (data && (data.profile_picture || data.settings)) {
                    const merged = { ...user };
                    if (data.profile_picture) merged.profile_picture = data.profile_picture;
                    if (data.settings) merged.settings = data.settings;
                    // Persist merged user for header avatar
                    localStorage.setItem('user', JSON.stringify(merged));
                    setCurrentUser(merged);
                    return merged;
                }
            }
        } catch (error) {
            console.warn('AuthContext: Could not augment user with artist profile:', error?.message);
        }
        return user;
    };

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
            // Attempt to enrich with artist profile (profile_picture)
            fetchAndMergeProfile(user);
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
        // Enrich after login as well
        fetchAndMergeProfile(user);
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