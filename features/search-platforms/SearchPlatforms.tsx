"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/shared/footer/Footer";
import { gameService, PlatformListItem } from "@/services/GameService";

export default function SearchPlatforms() {
    const [platforms, setPlatforms] = useState<PlatformListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadPlatforms = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await gameService.getPlatforms();
                if (!isMounted) {
                    return;
                }

                setPlatforms(Array.isArray(response) ? response : []);
            } catch {
                if (!isMounted) {
                    return;
                }

                setPlatforms([]);
                setError("No se pudieron cargar las plataformas.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void loadPlatforms();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#151515] text-white pt-28">
            <main className="px-4 md:px-8 lg:px-12 pb-12">
                <section className="mb-6 p-4 md:p-5">
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">Plataformas</h1>
                    <p className="text-sm text-gray-400">Explora las plataformas disponibles.</p>
                </section>

                <section>
                    {loading && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div key={`platform-skeleton-${index}`} className="w-full aspect-[4/3] rounded-xl border border-gray-700 bg-black/20 animate-pulse" />
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {!loading && !error && platforms.length === 0 && (
                        <div className="rounded-lg border border-gray-700 bg-black/20 p-4 text-gray-300 text-sm">
                            No hay plataformas para mostrar.
                        </div>
                    )}

                    {!loading && !error && platforms.length > 0 && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {platforms.map((platform) => (
                                <article
                                    key={platform.id}
                                    className="group relative overflow-hidden rounded-xl border border-white/10 w-full aspect-[4/3]"
                                >
                                    <Image
                                        src={platform.image_background || "/Logo.png"}
                                        alt={platform.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                                    <div className="relative z-10 h-full flex flex-col justify-end p-4">
                                        <h2 className="text-2xl font-extrabold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                                            {platform.name}
                                        </h2>
                                        <p className="text-xs text-gray-200 mt-1">
                                            {platform.games_count.toLocaleString()} juegos
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
