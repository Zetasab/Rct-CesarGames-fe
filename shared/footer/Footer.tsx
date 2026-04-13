"use client";

import Link from "next/link";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-10 border-t border-gray-800 bg-gradient-to-b from-[#151515] to-black/80">
            <div className="mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <p
                            className="text-[#ff4200] text-sm md:text-base"
                            style={{ fontFamily: "var(--font-press-start-2p)" }}
                        >
                            Games FE
                        </p>
                        <p className="text-xs md:text-sm text-gray-400 mt-3 max-w-md">
                            Descubre, compara y encuentra tus próximos juegos favoritos en un solo lugar.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs md:text-sm">
                        <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                            Inicio
                        </Link>
                        <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                            Catálogo
                        </Link>
                        <Link href="/legal" className="text-gray-300 hover:text-white transition-colors">
                            Privacidad y Términos
                        </Link>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between gap-3">
                    <p className="text-[11px] md:text-xs text-gray-500">
                        © {currentYear} Games FE. Todos los derechos reservados.
                    </p>
                    <span className="text-[11px] md:text-xs text-[#ff4200] uppercase tracking-[0.12em]">
                        Play more
                    </span>
                </div>
            </div>
        </footer>
    );
}
