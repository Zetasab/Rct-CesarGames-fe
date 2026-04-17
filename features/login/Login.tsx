'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { CustomLaddaButton } from '@/components/ladda-button/CustomLaddaButton';
import Image from 'next/image';
import './login.css';
import SocialLinks from '@/shared/social/SocialLinks';

import { authService } from '@/services/AuthService';
import { LoginRequest } from '@/models/LoginRequest';
import { extractErrorMessage } from '@/services/api-error';

interface LoginProps {
    defaultTestMode?: boolean;
}

export default function Login({ defaultTestMode = false }: LoginProps) {
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const privacyPolicyStorageKey = 'acceptedPrivacyPolicy';
    const projectNoticeStorageKey = 'acceptedPersonalProjectNotice';
    const testUserEmail = 'user@cesarsobrino.es';
    const [rememberedCredentials] = useState(() => {
        if (typeof window === 'undefined') {
            return { email: '', password: '', rememberMe: false };
        }

        const rememberedEmail = localStorage.getItem('rememberedEmail') || localStorage.getItem('rememberedUser') || '';
        const rememberedPassword = localStorage.getItem('rememberedPassword') || '';

        return {
            email: rememberedEmail,
            password: rememberedPassword,
            rememberMe: Boolean(rememberedEmail),
        };
    });
    const [email, setEmail] = useState(rememberedCredentials.email);
    const [password, setPassword] = useState(rememberedCredentials.password);
    const [rememberMe, setRememberMe] = useState(rememberedCredentials.rememberMe);
    const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return localStorage.getItem(privacyPolicyStorageKey) === 'true';
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isTestUserMode, setIsTestUserMode] = useState(defaultTestMode);
    const [showProjectNotice, setShowProjectNotice] = useState(false);

    useEffect(() => {
        if (searchParams.get('test') === 'true') {
            setIsTestUserMode(true);
            setEmail(testUserEmail);
            setPassword('');
            setRememberMe(false);
        }
    }, [searchParams]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const alreadyAccepted = localStorage.getItem(projectNoticeStorageKey) === 'true';
        setShowProjectNotice(!alreadyAccepted);
    }, []);

    const handleAcceptProjectNotice = () => {
        localStorage.setItem(projectNoticeStorageKey, 'true');
        setShowProjectNotice(false);
    };

    const handleToggleTestUserMode = () => {
        setError('');
        setStatus('idle');

        setIsTestUserMode((prev) => {
            const next = !prev;

            if (next) {
                setEmail(testUserEmail);
                setPassword('');
                setRememberMe(false);
            }

            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('idle');
        setError('');

        const submittedEmail = isTestUserMode ? testUserEmail : email.trim();
        const submittedPassword = isTestUserMode ? '' : password;

        if (!isTestUserMode && (!submittedEmail || !submittedPassword)) {
            setError('Por favor complete todos los campos');
            return;
        }

        if (!acceptedPrivacyPolicy) {
            setError('Debes aceptar la politica de privacidad para iniciar sesión');
            return;
        }

        localStorage.setItem(privacyPolicyStorageKey, 'true');

        setLoading(true);

        if (!isTestUserMode && rememberMe) {
            localStorage.setItem('rememberedEmail', submittedEmail);
            localStorage.setItem('rememberedPassword', submittedPassword);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedUser');
            localStorage.removeItem('rememberedPassword');
        }

        try {
            const loginRequest: LoginRequest = {
                Email: submittedEmail,
                Password: submittedPassword
            };
            const user = await authService.login(loginRequest);
            const token = user?.token || user?.Token;

            if (token) {
                sessionStorage.setItem('token', token);
                localStorage.removeItem('token');
            }


            setLoading(false);
            setStatus('success');
            // Si la respuesta es exitosa (200), logueamos al usuario y guardamos el token
            // Pequeño delay para mostrar la animación de éxito
            setTimeout(() => {
                login(user); // Esto probablemente desencadene la redirección en AuthGuard
            }, 1000);

        } catch (err) {
            console.error("Login error:", err);
            setLoading(false);
            setStatus('error');
            setError(extractErrorMessage(err, 'Usuario o contraseña incorrectos'));
        }
    };

    return (
        <div className='login-container' >
            {showProjectNotice && (
                <div className="project-notice-overlay">
                    <div className="project-notice-card">
                        <div className="project-notice-hero">
                            <span className="project-notice-pill">Aviso del proyecto</span>
                            <h2 className="project-notice-title">Proyecto personal en pruebas</h2>
                            <p className="project-notice-subtitle">Este mensaje no es de cookies.</p>
                        </div>

                        <p className="text-sm text-gray-200 leading-6 m-0">
                            Esta web es un proyecto personal, sin fines comerciales. Algunas partes pueden fallar o no
                            comportarse como esperas durante pruebas y mejoras.
                        </p>
                        <p className="mt-3 text-sm text-gray-200 leading-6 m-0">
                            Si te encuentras cualquier problema, por favor contacta con el administrador desde las redes
                            o correo que aparecen en esta pantalla.
                        </p>

                        <button
                            type="button"
                            onClick={handleAcceptProjectNotice}
                            className="mt-5 w-full rounded-md border border-[#ff4200] bg-[#ff4200]/15 px-4 py-2 text-[#ff4200] font-semibold hover:bg-[#ff4200] hover:text-white transition-colors"
                        >
                            Entendido, continuar
                        </button>
                    </div>
                </div>
            )}

            <div className='leftLogin'>
                <div className="flex h-screen w-full items-center justify-center bg-black/50 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
                    <div className="loginRequest w-full max-w-sm p-5 md:p-0 flex flex-col items-center">

                        <div className="mb-10 flex items-center justify-center gap-6">
                            <Image src="/Logo.png" alt="Logo" width={80} height={80} className="w-20 h-20 object-contain" priority />
                            <h2 className="text-4xl font-bold text-white m-0">
                                Iniciar Sesión
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                            <button
                                type="button"
                                onClick={handleToggleTestUserMode}
                                className="text-[#ff4200] underline hover:text-[#ff7a4d] transition-colors text-left"
                            >
                                {isTestUserMode ? 'Volver al login normal' : 'Logear como usuario prueba'}
                            </button>

                            {isTestUserMode ? (
                                <div className="mt-2 text-white text-sm leading-6">
                                    <p className="m-0">Email: {testUserEmail}</p>
                                    <p className="m-0">Contraseña: vacia</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <FloatLabel>
                                            <InputText
                                                id="email"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                                className={`w-full input-bg-transparent bg-transparent ${error ? 'p-invalid' : ''}`}
                                            />
                                            <label htmlFor="email">Email</label>
                                        </FloatLabel>
                                    </div>

                                    <div className="flex flex-col gap-2 mt-4">
                                        <FloatLabel>
                                            <Password
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                                toggleMask
                                                required
                                                feedback={false}
                                                className={`w-full ${error ? 'p-invalid' : ''}`}
                                                inputClassName={`w-full input-bg-transparent bg-transparent ${error ? 'p-invalid' : ''}`}
                                            />
                                            <label htmlFor="password">Contraseña</label>
                                        </FloatLabel>
                                    </div>
                                </>
                            )}

                            {!isTestUserMode && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Checkbox
                                        inputId="rememberMe"
                                        checked={rememberMe}
                                        onChange={e => setRememberMe(e.checked || false)}
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 text-white">Recordar credenciales</label>
                                </div>
                            )}

                            {error && <small className="p-error block">{error}</small>}

                            <div className="flex items-start gap-2 mt-1">
                                <Checkbox
                                    inputId="acceptedPrivacyPolicy"
                                    checked={acceptedPrivacyPolicy}
                                    onChange={(e) => {
                                        setAcceptedPrivacyPolicy(e.checked || false);
                                        setError('');
                                    }}
                                    required
                                />
                                <label htmlFor="acceptedPrivacyPolicy" className="ml-2 text-white text-sm leading-6">
                                    He leido y acepto la{' '}
                                    <Link
                                        href="/legal"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#ff4200] underline hover:text-[#ff7a4d] transition-colors"
                                    >
                                        politica de privacidad
                                    </Link>
                                </label>
                            </div>
                            <div className="mt-2 flex flex-col gap-1 text-sm">
                                <Link
                                    href="/forgot-password"
                                    className="text-[#ff4200] underline hover:text-[#ff7a4d] transition-colors"
                                >
                                    ¿Has olvidado tu contraseña?
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-[#ff4200] underline hover:text-[#ff7a4d] transition-colors"
                                >
                                    Crear una cuenta nueva
                                </Link>
                            </div>

                            <div className="mt-3 rounded-md border border-gray-700 bg-black/20 p-3">
                                <p className="mb-2 text-xs text-gray-300">Redes del administrador</p>
                                <SocialLinks size="small" compact className="items-center" />
                            </div>

                            <div className='mt-5'>
                                <CustomLaddaButton
                                    label="Iniciar Sesión"
                                    loading={loading}
                                    status={status}
                                    type="submit"
                                    className="w-full mt-5"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="rightLogin loginBg">
                <p>asdsa</p>
            </div>

        </div>
    );
}
