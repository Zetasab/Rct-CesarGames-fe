import Footer from "@/shared/footer/Footer";

export default function LegalPage() {
  const effectiveDate = "13 de abril de 2026";

  return (
    <div className="min-h-screen bg-[#272727] text-gray-100">
      <main className="mx-auto w-full max-w-4xl px-4 md:px-8 lg:px-12 pt-28 pb-10">
        <header className="mb-8 border-b border-gray-700 pb-5">
          <h1
            className="text-2xl md:text-3xl text-[#ff4200]"
            style={{ fontFamily: "var(--font-press-start-2p)" }}
          >
            Politica de Privacidad y Condiciones de Uso
          </h1>
          <p className="mt-4 text-sm text-gray-300">Vigencia: {effectiveDate}</p>
        </header>

        <section className="space-y-4 text-sm md:text-base leading-7 text-gray-200">
          <p>
            En Games FE nos tomamos en serio la privacidad de los usuarios. Esta
            pagina guarda informacion sensible para su funcionamiento y seguridad.
          </p>

          <h2 className="mt-6 text-lg md:text-xl font-semibold text-white">
            1. Informacion que recopilamos
          </h2>
          <p>Cuando visitas o usas esta pagina, podemos guardar:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Direccion IP de las visitas.</li>
            <li>Fecha y hora de cada visita.</li>
            <li>
              Datos de usuario como nombre y contrasena cifrada al registrarse o
              autenticarse.
            </li>
          </ul>

          <h2 className="mt-6 text-lg md:text-xl font-semibold text-white">
            2. Uso de la informacion
          </h2>
          <p>
            La informacion de visitas se guarda exclusivamente con fines
            estadisticos, para mejorar rendimiento, estabilidad, seguridad y
            experiencia general del servicio.
          </p>

          <h2 className="mt-6 text-lg md:text-xl font-semibold text-white">
            3. Comparticion con terceros
          </h2>
          <p>
            No vendemos, alquilamos ni cedemos la informacion personal o de
            visitas a terceros con fines comerciales.
          </p>

          <h2 className="mt-6 text-lg md:text-xl font-semibold text-white">
            4. Conservacion y eliminacion
          </h2>
          <p>
            La informacion registrada de las visitas se conserva por un periodo
            maximo de 30 dias y luego se elimina de manera automatica o segura.
          </p>

          <h2 className="mt-6 text-lg md:text-xl font-semibold text-white">
            5. Condiciones de uso
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>
              Al usar esta pagina aceptas estas politicas y condiciones de uso.
            </li>
            <li>
              El usuario es responsable del uso adecuado de su cuenta y
              credenciales.
            </li>
            <li>
              El incumplimiento de estas condiciones puede implicar suspension o
              restriccion de acceso.
            </li>
          </ul>

          <h2 className="mt-6 text-lg md:text-xl font-semibold text-white">
            6. Cambios en este documento
          </h2>
          <p>
            Podemos actualizar esta politica de privacidad y condiciones de uso en
            cualquier momento. Los cambios se publicaran en esta misma pagina.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}