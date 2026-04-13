'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { CustomLaddaButton } from '@/components/ladda-button/CustomLaddaButton';
import Image from 'next/image';
import './login.css';

import { authService } from '@/services/AuthService';
import { LoginRequest } from '@/models/LoginRequest';
import { extractErrorMessage } from '@/services/api-error';


export default function Login() {
    const { login } = useAuth();
    const privacyPolicyStorageKey = 'acceptedPrivacyPolicy';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('idle');
        setError('');

        if (!email || !password) {
            setError('Por favor complete todos los campos');
            return;
        }

        if (!acceptedPrivacyPolicy) {
            setError('Debes aceptar la politica de privacidad para iniciar sesión');
            return;
        }

        localStorage.setItem(privacyPolicyStorageKey, 'true');

        setLoading(true);

        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedUser');
            localStorage.removeItem('rememberedPassword');
        }

        try {
            const loginRequest: LoginRequest = {
                Email: email,
                Password: password
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
                            {error && <small className="p-error block">{error}</small>}
                            <div className="flex items-center gap-2 mt-2">
                                <Checkbox
                                    inputId="rememberMe"
                                    checked={rememberMe}
                                    onChange={e => setRememberMe(e.checked || false)}
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-white">Recordar credenciales</label>
                            </div>
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
