'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { CustomLaddaButton } from '@/components/ladda-button/CustomLaddaButton';
import Image from 'next/image';
import './login.css';

import { authService } from '@/services/AuthService';
import { infoService } from '@/services/InfoService';
import { gameService } from '@/services/GameService';
import { LoginRequest } from '@/models/LoginRequest';


export default function Login() {
    const { login } = useAuth();
    const [rememberedCredentials] = useState(() => {
        if (typeof window === 'undefined') {
            return { username: '', password: '', rememberMe: false };
        }

        const rememberedUser = localStorage.getItem('rememberedUser') || '';
        const rememberedPassword = localStorage.getItem('rememberedPassword') || '';

        return {
            username: rememberedUser,
            password: rememberedPassword,
            rememberMe: Boolean(rememberedUser),
        };
    });
    const [username, setUsername] = useState(rememberedCredentials.username);
    const [password, setPassword] = useState(rememberedCredentials.password);
    const [rememberMe, setRememberMe] = useState(rememberedCredentials.rememberMe);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        setError('');

        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedUser');
            localStorage.removeItem('rememberedPassword');
        }


        if (username && password) {
            try {
                const loginRequest: LoginRequest = {
                    UserName: username,
                    Password: password
                };
                const user = await authService.login(loginRequest);
                const token = user?.token || user?.Token;

                if (token) {
                    localStorage.setItem('token', token);
                    sessionStorage.removeItem('token');
                }

                const gameApiResponse = await infoService.getGameApi();
                const gameApiKey = typeof gameApiResponse === 'string'
                    ? gameApiResponse
                    : (
                        (gameApiResponse as unknown as { apiKey?: string; key?: string; value?: string })?.apiKey
                        || (gameApiResponse as unknown as { apiKey?: string; key?: string; value?: string })?.key
                        || (gameApiResponse as unknown as { apiKey?: string; key?: string; value?: string })?.value
                        || ''
                    );

                gameService.setApiKey(gameApiKey || '');

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
                setError('Usuario o contraseña incorrectos');
            }
        } else {
            setLoading(false);
            setError('Por favor complete todos los campos');
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
                                        id="username"
                                        required
                                        value={username}
                                        onChange={(e) => { setUsername(e.target.value); setError(''); }}
                                        className={`w-full input-bg-transparent bg-transparent ${error ? 'p-invalid' : ''}`}
                                    />
                                    <label htmlFor="username">Usuario</label>
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
                                <label htmlFor="rememberMe" className="ml-2 text-white">Recordar usuario</label>
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
