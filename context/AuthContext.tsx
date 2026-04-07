'use client';

import React, { createContext, useContext, useState } from 'react';
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

interface PersistedAuthUser {
    token: string;
    expiresAtUtc: string;
    username: string;
    email: string;
    role: string;
}

const normalizeUserSession = (userData: User): User => {
    const token = userData?.token || userData?.Token || '';
    const expiresAtUtc = userData?.expiresAtUtc || userData?.ExpiresAtUtc || '';
    const username = userData?.username || userData?.UserName || userData?.name || '';
    const email = userData?.email || userData?.Email || '';
    const role = userData?.role || userData?.Role || '';

    return {
        ...userData,
        token,
        expiresAtUtc,
        username,
        email,
        role,
    };
};

const toPersistedAuthUser = (userData: User): PersistedAuthUser => {
    const normalized = normalizeUserSession(userData);

    return {
        token: normalized.token || '',
        expiresAtUtc: normalized.expiresAtUtc || '',
        username: normalized.username || '',
        email: normalized.email || '',
        role: normalized.role || '',
    };
};

const getPersistedAuth = (): { user: User | null; isAuthenticated: boolean } => {
    if (typeof window === 'undefined') {
        return { user: null, isAuthenticated: false };
    }

    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!storedUser) {
        return { user: null, isAuthenticated: false };
    }

    try {
        const parsedUser: User = JSON.parse(storedUser);
        const normalizedUser = normalizeUserSession(parsedUser);

        if (!normalizedUser.token) {
            return { user: null, isAuthenticated: false };
        }

        localStorage.setItem('user', JSON.stringify(toPersistedAuthUser(normalizedUser)));
        localStorage.setItem('token', normalizedUser.token);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');

        return { user: normalizedUser, isAuthenticated: true };
    } catch (error) {
        console.error('Failed to parse user from session storage', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        return { user: null, isAuthenticated: false };
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const initialAuth = getPersistedAuth();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth.isAuthenticated);
    const [user, setUser] = useState<User | null>(initialAuth.user);
    const [loading] = useState<boolean>(false);
    const router = useRouter();

    const login = (userData: User) => {
        const normalizedUser = normalizeUserSession(userData);
        const token = normalizedUser.token;
        const persistedUser = toPersistedAuthUser(normalizedUser);

        localStorage.setItem('user', JSON.stringify(persistedUser));
        if (token) {
            localStorage.setItem('token', token);
        }
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        setUser(normalizedUser);
        setIsAuthenticated(true);
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
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
