"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/AuthService";
import { extractErrorMessage } from "@/services/api-error";
import type { VerifyEmailRequest } from "@/models/VerifyEmailRequest";

export default function ValidateUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRequested = useRef(false);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Preparando validación...");

  useEffect(() => {
    if (hasRequested.current) {
      return;
    }

    const code = (searchParams.get("code") || "").trim();
    const email = (searchParams.get("email") || "").trim();

    if (!code || !email) {
      setStatus("error");
      setMessage("Faltan parámetros obligatorios. Usa la URL con code y email.");
      return;
    }

    hasRequested.current = true;
    setStatus("loading");
    setMessage("Verificando correo...");

    const verify = async () => {
      try {
        const request: VerifyEmailRequest = {
          Email: email,
          Code: code,
        };

        const response = await authService.verifyEmail(request);
        setStatus("success");
        setMessage(response.message || "Cuenta creada exitosamente. Ya puedes iniciar sesión.");
        router.push("/login");
      } catch (error) {
        setStatus("error");
        setMessage(extractErrorMessage(error, "No se pudo verificar el correo."));
      }
    };

    void verify();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-[#151515] text-white px-4 md:px-8 lg:px-12 py-12 md:py-16 flex items-center justify-center">
      <section className="w-full max-w-md border border-gray-700 rounded-xl p-6 md:p-8 bg-[#1b1b1b]">
        <h1 className="text-2xl font-bold mb-3">Verificación de correo</h1>
        <p className="text-sm text-gray-300 mb-6">Estado: {status}</p>

        <div
          className={`rounded-md px-3 py-2 text-sm mb-6 ${
            status === "error"
              ? "border border-red-500/40 bg-red-500/10 text-red-200"
              : status === "success"
                ? "border border-green-500/40 bg-green-500/10 text-green-200"
                : "border border-gray-600 bg-black/20 text-gray-200"
          }`}
        >
          {message}
        </div>

        <Link
          href="/login"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#ff4200] text-[#ff4200] hover:text-white hover:bg-[#ff4200] transition-colors"
        >
          Ir al login
        </Link>
      </section>
    </main>
  );
}
