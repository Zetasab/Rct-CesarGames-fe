'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const hasToken =
        typeof window !== 'undefined' &&
        Boolean(localStorage.getItem('token') || sessionStorage.getItem('token'));
    const canAccessProtectedRoutes = isAuthenticated && hasToken;
    const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
    const isLoginPage = normalizedPathname === '/login' || normalizedPathname.endsWith('/login');
    const isLegalPage = normalizedPathname === '/legal' || normalizedPathname.endsWith('/legal');
    const isForgotPasswordPage = normalizedPathname === '/forgot-password' || normalizedPathname.endsWith('/forgot-password');
    const isRegisterPage = normalizedPathname === '/register' || normalizedPathname.startsWith('/register/');
    const isPublicPage = isLoginPage || isLegalPage || isForgotPasswordPage || isRegisterPage;

    useEffect(() => {
        if (!loading) {
            if (!canAccessProtectedRoutes && !isPublicPage) {
                router.push('/login');
            }
        }
    }, [canAccessProtectedRoutes, isPublicPage, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    // Don't render protected content if not authenticated
    if (!canAccessProtectedRoutes && !isPublicPage) {
        return null;
    }

    return <>{children}</>;
}
