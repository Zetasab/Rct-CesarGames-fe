'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const pathname = usePathname();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const profileImage = user?.profileimg || user?.ProfileImg || user?.profileImg || user?.avatar || user?.image || '/Logo.png';
    const profileName = user?.username || user?.name || user?.Name || 'Jugador';
    const profileEmail = user?.email || user?.Email || '';

    const isRouteActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

   

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled((prev) => (prev === isScrolled ? prev : isScrolled));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!isProfileMenuOpen) {
            return;
        }

        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (!profileMenuRef.current) {
                return;
            }

            if (!profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isProfileMenuOpen]);

    return (
        <>
            <nav
                style={{ background: scrolled ? 'rgba(0, 0, 0, 0.6)' : 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                        ? 'h-14 md:h-16 shadow-lg backdrop-blur-sm'
                        : 'h-20 md:h-24 bg-transparent backdrop-blur-none'
                    }`}
            >
                <div className="mx-auto h-full flex items-center justify-between px-6">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className={`relative transition-all duration-500 ease-out transform group-hover:scale-110 group-hover:rotate-3 group-hover:drop-shadow-[0_0_15px_rgba(255,66,0,0.5)] ${scrolled ? 'w-12 h-12' : 'w-20 h-20'}`}>
                            {/* Usamos Next Image con unoptimized para asegurar que cargue en todos los entornos si hay problemas de optimización */}
                            <Image
                                src="/Logo.png"
                                alt="Logo"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain"
                                priority
                                unoptimized
                            />
                        </div>
                        <span className="text-primary-500 text-xl tracking-tight transition-colors duration-300" style={{ fontFamily: 'var(--font-press-start-2p)', textShadow: '2px 2px 0px #8B2500' }}>
                            Games FE
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            key="Inicio"
                            href="/"
                            style={{ fontFamily: 'var(--font-press-start-2p)' }}
                            className={`relative transition-colors font-bold text-[10px] uppercase tracking-wider group py-2 px-3 rounded-md border flex items-center gap-2 ${isRouteActive('/') ? 'text-white bg-primary-500/25 border-primary-500/60 shadow-[0_0_14px_rgba(255,66,0,0.45)]' : 'text-gray-300 hover:text-white border-transparent hover:bg-white/5'}`}
                        >
                            <i className={`pi pi-home text-white text-lg transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] ${isRouteActive('/') ? 'scale-125 text-primary-400 drop-shadow-[0_0_12px_rgba(255,66,0,0.9)]' : ''}`}></i>
                            <span>Inicio</span>
                            <span className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(255,66,0,0.6)] ${isRouteActive('/') ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`}></span>
                        </Link>
                        <Link
                           
                            href="/search"
                            style={{ fontFamily: 'var(--font-press-start-2p)' }}
                            className={`relative transition-colors font-bold text-[10px] uppercase tracking-wider group py-2 px-3 rounded-md border flex items-center gap-2 ${isRouteActive('/search') ? 'text-white bg-primary-500/25 border-primary-500/60 shadow-[0_0_14px_rgba(255,66,0,0.45)]' : 'text-gray-300 hover:text-white border-transparent hover:bg-white/5'}`}
                        >
                            <i className={`pi pi-search text-white text-lg transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] ${isRouteActive('/search') ? 'scale-125 text-primary-400 drop-shadow-[0_0_12px_rgba(255,66,0,0.9)]' : ''}`}></i>
                            <span>Buscar</span>
                            <span className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(255,66,0,0.6)] ${isRouteActive('/search') ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`}></span>
                        </Link>
                        <Link
                            key="Mis juegos"
                            href="/mygames"
                            style={{ fontFamily: 'var(--font-press-start-2p)' }}
                            className={`relative transition-colors font-bold text-[10px] uppercase tracking-wider group py-2 px-3 rounded-md border flex items-center gap-2 ${isRouteActive('/mygames') ? 'text-white bg-primary-500/25 border-primary-500/60 shadow-[0_0_14px_rgba(255,66,0,0.45)]' : 'text-gray-300 hover:text-white border-transparent hover:bg-white/5'}`}
                        >
                            <i className={`pi pi-th-large text-white text-lg transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] ${isRouteActive('/mygames') ? 'scale-125 text-primary-400 drop-shadow-[0_0_12px_rgba(255,66,0,0.9)]' : ''}`}></i>
                            <span>Mis juegos</span>
                            <span className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(255,66,0,0.6)] ${isRouteActive('/mygames') ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'}`}></span>
                        </Link>
                        
                    </div>

                    {/* Actions & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block relative" ref={profileMenuRef}>
                            {user ? (
                                <>
                                    <button
                                        type="button"
                                        className="cursor-pointer rounded-full border-2 border-transparent hover:border-primary-500/50 transition-all duration-300 relative hover:scale-105 hover:shadow-[0_0_20px_rgba(255,66,0,0.3)] active:scale-95 flex items-center gap-2 pr-2"
                                        onClick={() => setIsProfileMenuOpen((current) => !current)}
                                        aria-expanded={isProfileMenuOpen}
                                        aria-haspopup="menu"
                                    >
                                        <Image
                                            src={profileImage}
                                            alt="Profile"
                                            style={{borderRadius:'100px'}}
                                            width={scrolled ? 40 : 52}
                                            height={scrolled ? 40 : 52}
                                            className={`bg-zinc-800 text-white transition-all duration-300 border-radius-full ${scrolled ? 'w-10 h-10' : 'w-13 h-13'} object-cover`}
                                        />
                                        <i className={`pi ${isProfileMenuOpen ? 'pi-chevron-up' : 'pi-chevron-down'} text-xs text-gray-300`} />
                                    </button>

                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,0.45)] overflow-hidden z-[70]">
                                            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-black/40 to-primary-500/10">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={profileImage}
                                                        alt="Profile"
                                                        width={44}
                                                        height={44}
                                                        className="w-11 h-11 rounded-full object-cover border border-white/20"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-white truncate">{profileName}</p>
                                                        {profileEmail ? (
                                                            <p className="text-xs text-gray-400 truncate">{profileEmail}</p>
                                                        ) : (
                                                            <p className="text-xs text-gray-500">Tu perfil de jugador</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2">
                                                <Link
                                                    href="/"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm border transition-colors ${isRouteActive('/') ? 'text-white bg-primary-500/30 border-primary-500/60 shadow-[0_0_10px_rgba(255,66,0,0.35)]' : 'text-gray-200 border-transparent hover:text-white hover:bg-white/10'}`}
                                                >
                                                    <i className="pi pi-home text-xs" />
                                                    <span>Inicio</span>
                                                </Link>
                                                <Link
                                                    href="/search"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm border transition-colors ${isRouteActive('/search') ? 'text-white bg-primary-500/30 border-primary-500/60 shadow-[0_0_10px_rgba(255,66,0,0.35)]' : 'text-gray-200 border-transparent hover:text-white hover:bg-white/10'}`}
                                                >
                                                    <i className="pi pi-search text-xs" />
                                                    <span>Buscar</span>
                                                </Link>
                                                <Link
                                                    href="/mygames"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm border transition-colors ${isRouteActive('/mygames') ? 'text-white bg-primary-500/30 border-primary-500/60 shadow-[0_0_10px_rgba(255,66,0,0.35)]' : 'text-gray-200 border-transparent hover:text-white hover:bg-white/10'}`}
                                                >
                                                    <i className="pi pi-gamepad text-xs" />
                                                    <span>Mis Juegos</span>
                                                </Link>
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isRouteActive('/profile') ? 'text-white bg-primary-500/20' : 'text-gray-200 hover:text-white hover:bg-white/10'}`}
                                                >
                                                    <i className="pi pi-user text-xs" />
                                                    <span>Perfil</span>
                                                </Link>

                                                <div className="my-2 h-px bg-white/10" />

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsProfileMenuOpen(false);
                                                        logout();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors cursor-pointer"
                                                >
                                                    <i className="pi pi-power-off text-xs" />
                                                    <span>Desconectar</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link href="/login">
                                    <Button
                                        label="Login"
                                        icon="pi pi-user"
                                        className={`p-button-text text-white hover:bg-white/10 hover:text-primary-400 transition-all duration-300 border border-transparent hover:border-white/10 rounded-full px-6 ${scrolled ? 'p-button-sm' : ''}`}
                                    />
                                </Link>
                            )}
                        </div>

                        <div className="md:hidden">
                            <div className="rounded-full overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] border-2 border-transparent hover:border-white/20">
                                <Image
                                    src={profileImage}
                                    className="p-button-text transition-all duration-300 text-white object-cover cursor-pointer"
                                    style={{ height: scrolled ? 40 : 50, width: scrolled ? 40 : 50 }}
                                    onClick={() => setMobileMenuOpen(true)}
                                    alt="User Profile"
                                    width={50}
                                    height={50}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <Sidebar
                visible={mobileMenuOpen}
                onHide={() => setMobileMenuOpen(false)}
                position="right"
                style={{ background: 'transparent', border: 'none' }}
                className="bg-black/60 backdrop-blur-md text-white border-l  w-full md:w-20rem"
                pt={{
                    closeButton: { className: 'text-white hover:bg-white/10' },
                    content: { className: 'bg-transparent' },
                    root: { className: 'border-none bg-transparent shadow-none' },
                    mask: { className: 'backdrop-blur-sm' }
                }}
            >
                <div className="flex flex-col h-full">
                    <div className="flex flex-col gap-2 mt-8">
                        <Link
                            href="/"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontFamily: 'var(--font-press-start-2p)' }}
                            className={`p-4 text-xs rounded-lg border transition-colors font-bold flex items-center gap-3 group ${isRouteActive('/') ? 'text-white bg-primary-500/35 border-primary-500/60 shadow-[0_0_12px_rgba(255,66,0,0.4)]' : 'text-gray-300 border-transparent hover:text-white hover:bg-white/5'}`}
                        >
                            <i className="pi pi-home text-white transition-all duration-300 group-hover:scale-125 group-hover:text-primary-400"></i>
                            Inicio
                        </Link>
                        <Link
                            href="/search"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontFamily: 'var(--font-press-start-2p)' }}
                            className={`p-4 text-xs rounded-lg border transition-colors font-bold flex items-center gap-3 group ${isRouteActive('/search') ? 'text-white bg-primary-500/35 border-primary-500/60 shadow-[0_0_12px_rgba(255,66,0,0.4)]' : 'text-gray-300 border-transparent hover:text-white hover:bg-white/5'}`}
                        >
                            <i className="pi pi-search text-white transition-all duration-300 group-hover:scale-125 group-hover:text-primary-400"></i>
                            Buscar
                        </Link>
                        <Link
                            href="/mygames"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontFamily: 'var(--font-press-start-2p)' }}
                            className={`p-4 text-xs rounded-lg border transition-colors font-bold flex items-center gap-3 group ${isRouteActive('/mygames') ? 'text-white bg-primary-500/35 border-primary-500/60 shadow-[0_0_12px_rgba(255,66,0,0.4)]' : 'text-gray-300 border-transparent hover:text-white hover:bg-white/5'}`}
                        >
                             <i className="pi pi-th-large text-white transition-all duration-300 group-hover:scale-125 group-hover:text-primary-400"></i>
                            Juegos
                        </Link>
                    </div>

                    <div className="mt-auto mb-8 px-4">
                        <Button
                            label="Cerrar Sesión"
                            icon="pi pi-power-off"
                            onClick={() => {
                                logout();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full p-button-outlined text-white border-white/20 hover:bg-red-500/10 hover:border-red-500 hover:text-red-400 transition-all duration-300"
                        />
                    </div>
                </div>
            </Sidebar>
        </>
    );

    
}
