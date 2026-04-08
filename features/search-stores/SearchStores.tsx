"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/shared/footer/Footer";
import { gameService, StoreListItem } from "@/services/GameService";

function normalizeDomainUrl(domain: string): string {
	if (!domain) {
		return "#";
	}

	if (domain.startsWith("http://") || domain.startsWith("https://")) {
		return domain;
	}

	return `https://${domain}`;
}

export default function SearchStores() {
	const router = useRouter();
	const [stores, setStores] = useState<StoreListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const goToSearchByStore = (storeId: number) => {
		const query = new URLSearchParams({ stores: String(storeId) });
		router.push(`/search?${query.toString()}`);
	};

	useEffect(() => {
		let isMounted = true;

		const loadStores = async () => {
			setLoading(true);
			setError(null);

			try {
				const response = await gameService.getStores();
				if (!isMounted) {
					return;
				}

				setStores(Array.isArray(response) ? response : []);
			} catch {
				if (!isMounted) {
					return;
				}

				setStores([]);
				setError("No se pudieron cargar las stores.");
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		void loadStores();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className="min-h-screen bg-[#151515] text-white pt-28">
			<main className="px-4 md:px-8 lg:px-12 pb-12">
				<section className="mb-6 p-4 md:p-5">
					<h1 className="text-2xl md:text-3xl font-bold mb-1">Stores</h1>
					<p className="text-sm text-gray-400">Explora las tiendas disponibles.</p>
				</section>

				<section>
					{loading && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{Array.from({ length: 12 }).map((_, index) => (
								<div key={`store-skeleton-${index}`} className="h-52 rounded-xl border border-gray-700 bg-black/20 animate-pulse" />
							))}
						</div>
					)}

					{!loading && error && (
						<div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200 text-sm">
							{error}
						</div>
					)}

					{!loading && !error && stores.length === 0 && (
						<div className="rounded-lg border border-gray-700 bg-black/20 p-4 text-gray-300 text-sm">
							No hay stores para mostrar.
						</div>
					)}

					{!loading && !error && stores.length > 0 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{stores.map((store) => (
								<article
									key={store.id}
									className="group relative overflow-hidden rounded-xl border border-white/10 min-h-52 cursor-pointer"
									role="button"
									tabIndex={0}
									onClick={() => goToSearchByStore(store.id)}
									onKeyDown={(event) => {
										if (event.key === "Enter" || event.key === " ") {
											event.preventDefault();
											goToSearchByStore(store.id);
										}
									}}
								>
									<Image
										src={store.image_background || "/Logo.png"}
										alt={store.name}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
										className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										unoptimized
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

									<div className="absolute top-3 right-3 z-20">
										<a
											href={normalizeDomainUrl(store.domain)}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(event) => event.stopPropagation()}
											onKeyDown={(event) => event.stopPropagation()}
											className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/25 bg-black/45 text-white hover:bg-primary-500/40 hover:border-primary-400 transition-colors"
											aria-label={`Abrir web de ${store.name}`}
											title={`Ir a ${store.domain}`}
										>
											<i className="pi pi-globe text-sm" />
										</a>
									</div>

									<div className="relative z-10 h-full flex flex-col justify-end p-4">
										<h2 className="text-2xl font-extrabold leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
											{store.name}
										</h2>
										<p className="text-xs text-gray-200 mt-1 truncate">
											{store.domain}
										</p>
										<p className="text-xs text-gray-200 mt-0.5">
											{store.games_count.toLocaleString()} juegos
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
