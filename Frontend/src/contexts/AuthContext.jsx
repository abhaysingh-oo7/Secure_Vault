import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { deriveKey, generateSalt } from '../utils/cryptoUtils';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [encKey, setEncKey] = useState(null); // AES-GCM key
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        // Optionally fetch user info from backend
        setUser({ email: localStorage.getItem('email') });
        setLoading(false);
    }, []);

    // Registration
    const signUp = async (email, password) => {
        const salt = generateSalt(); // new salt for this user
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            email,
            password,
            kdfSalt: salt,
        });
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('email', email);
            setUser({ email });
            const key = await deriveKey(password, salt);
            setEncKey(key);
        }
        return res.data;
    };

    // Login
    const signIn = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('email', email);
                setUser({ email });
                const key = await deriveKey(password, res.data.kdfSalt);
                setEncKey(key);
            }
            return res.data;
        } catch (err) {
            // Handle network / server errors
            throw new Error(err.response?.data?.message || 'Login failed');
        }
    };

    const signOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setUser(null);
        setEncKey(null);
    };

    return (
        <AuthContext.Provider value={{ user, encKey, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};