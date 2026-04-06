'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { User } from '@/models/User';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        // Check persisted auth on initial load (shared across tabs)
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        try {
            if (storedUser) {
                const parsedUser: User = JSON.parse(storedUser);
                // Handle both lowercase and PascalCase properties
                const token = parsedUser.token || parsedUser.Token;
                
                if (parsedUser && token) {
                    localStorage.setItem('user', JSON.stringify(parsedUser));
                    localStorage.setItem('token', token);
                    sessionStorage.removeItem('user');
                    sessionStorage.removeItem('token');
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                }
            }
        } catch (error) {
            console.error('Failed to parse user from session storage', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
        }
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        const token = userData?.token || userData?.Token;
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        setUser(userData);
        setIsAuthenticated(true);
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('gameApiKey');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('gameApiKey');
        setUser(null);
        setIsAuthenticated(false);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
