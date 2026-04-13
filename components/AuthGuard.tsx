'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
    const isLoginPage = normalizedPathname === '/login' || normalizedPathname.endsWith('/login');
    const isLegalPage = normalizedPathname === '/legal' || normalizedPathname.endsWith('/legal');
    const isForgotPasswordPage = normalizedPathname === '/forgot-password' || normalizedPathname.endsWith('/forgot-password');
    const isRegisterPage = normalizedPathname === '/register' || normalizedPathname.endsWith('/register');
    const isPublicPage = isLoginPage || isLegalPage || isForgotPasswordPage || isRegisterPage;

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated && !isPublicPage) {
                router.push('/login');
            } else if (isAuthenticated && isLoginPage) {
                router.push('/');
            }
        }
    }, [isAuthenticated, isLoginPage, isPublicPage, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    // Don't render protected content if not authenticated
    if (!isAuthenticated && !isPublicPage) {
        return null;
    }

    // Don't render login page if already authenticated
    if (isAuthenticated && isLoginPage) {
        return null;
    }

    return <>{children}</>;
}
