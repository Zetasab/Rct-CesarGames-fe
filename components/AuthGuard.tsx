'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated && pathname !== '/login') {
                router.push('/login');
            } else if (isAuthenticated && pathname === '/login') {
                router.push('/');
            }
        }
    }, [isAuthenticated, loading, pathname, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    // Don't render protected content if not authenticated
    if (!isAuthenticated && pathname !== '/login') {
        return null;
    }

    // Don't render login page if already authenticated
    if (isAuthenticated && pathname === '/login') {
        return null;
    }

    return <>{children}</>;
}
