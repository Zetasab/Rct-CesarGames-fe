"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { authService } from "@/services/AuthService";
import { extractErrorMessage } from "@/services/api-error";
import type { RegisterRequest } from "@/models/RegisterRequest";
import type { VerifyEmailRequest } from "@/models/VerifyEmailRequest";

const passwordRules = [
  { label: "Mínimo 8 caracteres", check: (value: string) => value.length >= 8 },
  { label: "Al menos una mayúscula", check: (value: string) => /[A-Z]/.test(value) },
  { label: "Al menos una minúscula", check: (value: string) => /[a-z]/.test(value) },
  { label: "Al menos un número", check: (value: string) => /\d/.test(value) },
  { label: "Al menos un carácter especial", check: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const passwordChecks = useMemo(
    () => passwordRules.map((rule) => ({ label: rule.label, valid: rule.check(password) })),
    [password]
  );

  const isPasswordStrong = passwordChecks.every((rule) => rule.valid);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!username.trim() || !email.trim() || !password || !repeatPassword) {
      setErrorMessage("Completa todos los campos del registro.");
      return;
    }

    if (password !== repeatPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    if (!isPasswordStrong) {
      setErrorMessage("La contraseña no cumple los requisitos de seguridad.");
      return;
    }

    setLoadingRegister(true);

    try {
      const request: RegisterRequest = {
        Username: username.trim(),
        Email: email.trim(),
        Password: password,
      };

      await authService.register(request);
      setAwaitingVerification(true);
      setSuccessMessage("Registro exitoso. Revisa tu correo e introduce el código de verificación.");
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, "No se pudo completar el registro."));
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleVerifyEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !verificationCode.trim()) {
      setErrorMessage("Introduce el código de verificación.");
      return;
    }

    setLoadingVerify(true);

    try {
      const request: VerifyEmailRequest = {
        Email: email.trim(),
        Code: verificationCode.trim(),
      };

      const response = await authService.verifyEmail(request);
      setSuccessMessage(response.message || "Cuenta creada exitosamente. Ya puedes iniciar sesión.");
      setVerificationCode("");
      router.push("/login");
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, "No se pudo verificar el correo."));
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#151515] text-white px-4 md:px-8 lg:px-12 py-12 md:py-16 flex items-center justify-center">
      <section className="w-full max-w-xl border border-gray-700 rounded-xl p-6 md:p-8 bg-[#1b1b1b]">
        <h1 className="text-2xl font-bold mb-2">Crear una cuenta nueva</h1>
        <p className="text-sm text-gray-300 mb-6">
          Completa el registro y luego verifica tu correo con el código recibido.
        </p>

        {errorMessage ? (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-4 rounded-md border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-200">
            {successMessage}
          </div>
        ) : null}

        {!awaitingVerification ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="register-username" className="text-sm text-gray-200 block mb-1">
                Nombre de usuario
              </label>
              <InputText
                id="register-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full"
                placeholder="Tu nombre de usuario"
                required
              />
            </div>

            <div>
              <label htmlFor="register-email" className="text-sm text-gray-200 block mb-1">
                Email
              </label>
              <InputText
                id="register-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="register-password" className="text-sm text-gray-200 block mb-1">
                Contraseña
              </label>
              <Password
                id="register-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                feedback={false}
                toggleMask
                inputClassName="w-full"
                className="w-full"
                placeholder="Tu contraseña"
                required
              />
            </div>

            <div>
              <label htmlFor="register-repeat-password" className="text-sm text-gray-200 block mb-1">
                Repetir contraseña
              </label>
              <Password
                id="register-repeat-password"
                value={repeatPassword}
                onChange={(event) => setRepeatPassword(event.target.value)}
                feedback={false}
                toggleMask
                inputClassName="w-full"
                className="w-full"
                placeholder="Repite tu contraseña"
                required
              />
            </div>

            <div className="rounded-md border border-gray-700 p-3">
              <p className="text-xs text-gray-300 mb-2">Requisitos de contraseña robusta:</p>
              <ul className="space-y-1 text-xs">
                {passwordChecks.map((rule) => (
                  <li key={rule.label} className={rule.valid ? "text-green-300" : "text-gray-400"}>
                    {rule.valid ? "✓" : "•"} {rule.label}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              type="submit"
              label={loadingRegister ? "Creando cuenta..." : "Crear cuenta"}
              className="w-full"
              disabled={loadingRegister}
            />
          </form>
        ) : (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div>
              <label htmlFor="verification-code" className="text-sm text-gray-200 block mb-1">
                Código de verificación
              </label>
              <InputText
                id="verification-code"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                className="w-full"
                placeholder="Introduce el código recibido"
                required
              />
            </div>

            <Button
              type="submit"
              label={loadingVerify ? "Verificando..." : "Verificar correo"}
              className="w-full"
              disabled={loadingVerify}
            />
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-gray-700">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#ff4200] text-[#ff4200] hover:text-white hover:bg-[#ff4200] transition-colors"
          >
            Volver al login
          </Link>
        </div>
      </section>
    </main>
  );
}
