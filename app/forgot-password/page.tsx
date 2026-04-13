import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#151515] text-white px-4 md:px-8 lg:px-12 py-12 md:py-16 flex items-center justify-center">
      <section className="w-full max-w-md border border-gray-700 rounded-xl p-6 md:p-8 bg-[#1b1b1b]">
        <h1 className="text-2xl font-bold mb-2">Recuperar contraseña</h1>
        <p className="text-sm text-gray-300 mb-6">
          Esta sección estará disponible próximamente. Si necesitas ayuda, contacta
          con soporte.
        </p>

        <div className="flex gap-3">
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
