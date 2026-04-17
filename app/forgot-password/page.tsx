import Link from "next/link";
import SocialLinks from "@/shared/social/SocialLinks";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#151515] text-white px-4 md:px-8 lg:px-12 py-12 md:py-16 flex items-center justify-center">
      <section className="w-full max-w-md border border-gray-700 rounded-xl p-6 md:p-8 bg-[#1b1b1b]">
        <h1 className="text-2xl font-bold mb-2">Recuperar contraseña</h1>
        <p className="text-sm text-gray-300 mb-6">
          Si quieres cambiar la contraseña, contacta con el administrador para que
          gestione tu solicitud de forma segura.
        </p>

        <div className="mb-6 rounded-md border border-gray-700 bg-black/20 p-3">
          <p className="text-xs text-gray-300 mb-2">Enlaces útiles:</p>
          <SocialLinks />
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-[#ff4200] text-[#ff4200] hover:text-white hover:bg-[#ff4200] transition-colors"
          >
            Volver al login
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-gray-500 text-gray-200 hover:text-white hover:border-gray-300 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
