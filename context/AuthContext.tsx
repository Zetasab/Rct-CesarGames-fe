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

    const sessionUser = sessionStorage.getItem('user');
    const localUser = localStorage.getItem('user');
    const storedUser = sessionUser || localUser;
    if (!storedUser) {
        return { user: null, isAuthenticated: false };
    }

    try {
        const parsedUser: User = JSON.parse(storedUser);
        const normalizedUser = normalizeUserSession(parsedUser);

        if (!normalizedUser.token) {
            return { user: null, isAuthenticated: false };
        }

        sessionStorage.setItem('user', JSON.stringify(toPersistedAuthUser(normalizedUser)));
        sessionStorage.setItem('token', normalizedUser.token);
        localStorage.removeItem('user');
        localStorage.removeItem('token');

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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const initialAuth = getPersistedAuth();
        setIsAuthenticated(initialAuth.isAuthenticated);
        setUser(initialAuth.user);
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        const normalizedUser = normalizeUserSession(userData);
        const token = normalizedUser.token;
        const persistedUser = toPersistedAuthUser(normalizedUser);

        sessionStorage.setItem('user', JSON.stringify(persistedUser));
        if (token) {
            sessionStorage.setItem('token', token);
        }
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(normalizedUser);
        setIsAuthenticated(Boolean(token));
        setLoading(false);

        if (token) {
            router.push('/');
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
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
