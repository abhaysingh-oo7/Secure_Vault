import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register } from '../services/api';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the AuthContext easily
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount, check for an existing token and optionally fetch profile info from backend
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        // For simple demo, set an email in context. In production, fetch user info with token.
        setUser({ email: 'user@example.com' });
        setLoading(false);
    }, []);

    // Login using backend API
    const signIn = async (email, password) => {
        const data = await login(email, password);
        if (data.token) {
            localStorage.setItem('token', data.token);
            setUser(data.user);
        }
        return data;
    };

    // Registration using backend API
    const signUp = async (email, password) => {
        const data = await register(email, password);
        if (data.token) {
            localStorage.setItem('token', data.token);
            setUser(data.user);
        }
        return data;
    };

    // Sign out: remove token and clear user info
    const signOut = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Provide auth state and actions to children
    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
