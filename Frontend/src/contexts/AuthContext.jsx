import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for token and get user on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        // Fetch the user profile from backend using token
        fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
            setUser(data?.user || null);
            setLoading(false);
        })
        .catch(() => {
            setUser(null);
            setLoading(false);
        });
    }, []);

    const signUp = async (email, password) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            setUser(data.user);
        }
        return { data, error: !response.ok ? data.message : null };
    };

    const signIn = async (email, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            setUser(data.user);
        }
        return { data, error: !response.ok ? data.message : null };
    };

    const signOut = async () => {
        localStorage.removeItem('token');
        setUser(null);
        return { error: null };
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
