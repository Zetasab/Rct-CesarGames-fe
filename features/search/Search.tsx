"use client";

import { FormEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameCard, GameCardSkeleton } from "@/components/game-carousel/GameCarousel";
import Footer from "@/shared/footer/Footer";
import {
    gameService,
    RawgPaginatedResponse,
    SearchGamesParams,
} from "@/services/GameService";
import { Game } from "@/models/Game";
import {
    getGameResultFlags,
    getGameResultGameId,
    loadGameResultList,
} from "@/services/GameResultState";
import {
    genresCatalog,
    platformsCatalog,
    tagsCatalog,
} from "@/app/static/catalog-data";
import { authService } from "@/services/AuthService";
import { useAuth } from "@/context/AuthContext";

type GameStatusFlags = { isPlayed: boolean; isWishlist: boolean };
type QuickQueryKey = "" | "hot-now" | "upcoming" | "anticipated" | "popular" | "trending";

const PAGE_SIZE = 20;

const ORDERING_OPTIONS: Array<{ label: string; value: string }> = [
    { label: "Más populares", value: "-added" },
    { label: "Mejor valorados", value: "-rating" },
    { label: "Más recientes", value: "-released" },
    { label: "Nombre (A-Z)", value: "name" },
    { label: "Nombre (Z-A)", value: "-name" },
    { label: "Metacritic (desc)", value: "-metacritic" },
];

const QUICK_QUERY_OPTIONS: Array<{ label: string; value: QuickQueryKey }> = [
    { label: "Selecciona una consulta rápida", value: "" },
    { label: "Juegos del momento", value: "hot-now" },
    { label: "Futuros lanzamientos", value: "upcoming" },
    { label: "Lanzamientos más esperados", value: "anticipated" },
    { label: "Más populares", value: "popular" },
    { label: "Tendencias", value: "trending" },
];

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const getQuickQueryParams = (queryKey: QuickQueryKey): Partial<SearchGamesParams> => {
    const today = new Date();

    switch (queryKey) {
        case "hot-now": {
            const threeMonthsAgo = new Date(today);
            threeMonthsAgo.setMonth(today.getMonth() - 3);

            return {
                ordering: "-rating",
                dates: `${formatDate(threeMonthsAgo)},${formatDate(today)}`,
            };
        }
        case "upcoming": {
            const sixMonthsFromNow = new Date(today);
            sixMonthsFromNow.setMonth(today.getMonth() + 6);

            return {
                ordering: "released",
                dates: `${formatDate(today)},${formatDate(sixMonthsFromNow)}`,
            };
        }
        case "anticipated": {
            const oneYearFromNow = new Date(today);
            oneYearFromNow.setFullYear(today.getFullYear() + 1);

            return {
                dates: `${formatDate(today)},${formatDate(oneYearFromNow)}`,
            };
        }
        case "popular":
            return { dates: undefined };
        case "trending": {
            const oneYearAgo = new Date(today);
            oneYearAgo.setFullYear(today.getFullYear() - 1);

            return {
                dates: `${formatDate(oneYearAgo)},${formatDate(today)}`,
            };
        }
        default:
            return {};
    }
};

export default function Search() {
    const { logout } = useAuth();
    const hasInitializedAutoSearch = useRef(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [quickQuery, setQuickQuery] = useState<QuickQueryKey>("");
    const [query, setQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [ordering, setOrdering] = useState("");
    const [metacriticMin, setMetacriticMin] = useState("");
    const [metacriticMax, setMetacriticMax] = useState("");
    const [releasedFrom, setReleasedFrom] = useState("");
    const [releasedTo, setReleasedTo] = useState("");
    const [searchPrecise, setSearchPrecise] = useState(false);
    const [searchExact, setSearchExact] = useState(false);

    const [games, setGames] = useState<Game[]>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [gameStatusById, setGameStatusById] = useState<Record<string, GameStatusFlags>>({});
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    const hasPreviousPage = page > 1;
    const hasNextPage = page * PAGE_SIZE < count;

    const metacriticFilter = useMemo(() => {
        const min = Number(metacriticMin);
        const max = Number(metacriticMax);

        if (!Number.isFinite(min) || !Number.isFinite(max)) {
            return undefined;
        }

        if (min < 0 || max < 0 || min > 100 || max > 100 || min > max) {
            return undefined;
        }

        return `${min},${max}`;
    }, [metacriticMin, metacriticMax]);

    const datesFilter = useMemo(() => {
        if (!releasedFrom || !releasedTo) {
            return undefined;
        }

        if (releasedFrom > releasedTo) {
            return undefined;
        }

        return `${releasedFrom},${releasedTo}`;
    }, [releasedFrom, releasedTo]);

    const loadGameStatuses = useCallback(async () => {
        try {
            const list = await loadGameResultList();
            const nextState = list.reduce<Record<string, GameStatusFlags>>((acc, item) => {
                const gameId = getGameResultGameId(item);
                if (!gameId) {
                    return acc;
                }

                acc[gameId] = getGameResultFlags(item);
                return acc;
            }, {});

            setGameStatusById(nextState);
        } catch {
            setGameStatusById({});
        }
    }, []);

    const runSearch = useCallback(async (nextPage: number, overrides?: Partial<SearchGamesParams>) => {
        setLoading(true);
        setError(null);
        setOpenMenuId(null);

        const params: SearchGamesParams = {
            page: nextPage,
            pageSize: PAGE_SIZE,
            search: query.trim() || undefined,
            searchPrecise,
            searchExact,
            genres: selectedGenre || undefined,
            platforms: selectedPlatform || undefined,
            tags: selectedTag || undefined,
            ordering: ordering || undefined,
            metacritic: metacriticFilter,
            dates: datesFilter,
            ...overrides,
        };

        try {
            const response: RawgPaginatedResponse<Game> = await gameService.searchGames(params);
            const safeResults = Array.isArray(response.results) ? response.results : [];

            setPage(nextPage);
            setGames(safeResults);
            setCount(Number.isFinite(response.count) ? response.count : 0);
        } catch {
            setGames([]);
            setCount(0);
            setError("No se pudo realizar la búsqueda con los filtros actuales.");
        } finally {
            setLoading(false);
        }
    }, [datesFilter, metacriticFilter, ordering, query, searchExact, searchPrecise, selectedGenre, selectedPlatform, selectedTag]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void runSearch(1);
    };

    const handleClearFilters = () => {
        setQuickQuery("");
        setQuery("");
        setSelectedGenre("");
        setSelectedPlatform("");
        setSelectedTag("");
        setOrdering("");
        setMetacriticMin("");
        setMetacriticMax("");
        setReleasedFrom("");
        setReleasedTo("");
        setSearchPrecise(false);
        setSearchExact(false);
    };

    const handleQuickQueryChange = (value: QuickQueryKey) => {
        setQuickQuery(value);

        if (!value) {
            return;
        }

        const preset = getQuickQueryParams(value);
        const [fromDate, toDate] = (preset.dates || "").split(",");

        setQuery("");
        setSelectedGenre("");
        setSelectedPlatform("");
        setSelectedTag("");
        setMetacriticMin("");
        setMetacriticMax("");
        setSearchPrecise(false);
        setSearchExact(false);
        setOrdering(preset.ordering || "");
        setReleasedFrom(fromDate || "");
        setReleasedTo(toDate || "");

    };

    const toggleMenu = (event: MouseEvent, gameId: number) => {
        event.stopPropagation();
        event.preventDefault();
        setOpenMenuId((current) => (current === gameId ? null : gameId));
    };

    const handleGameStatusChange = (gameId: number, next: GameStatusFlags) => {
        setGameStatusById((previous) => ({
            ...previous,
            [String(gameId)]: next,
        }));
    };

    useEffect(() => {
        if (hasInitializedAutoSearch.current) {
            return;
        }

        hasInitializedAutoSearch.current = true;

        const initialize = async () => {
            try {
                const isConnected = await authService.checkUser();

                if (!isConnected) {
                    console.log("usuario no conectado, redirigiendo al login");
                    logout();
                    return;
                }
            } catch (error) {
                const status = (error as { status?: number })?.status;
                if (status === 401) {
                    console.log("usuario no conectado, redirigiendo al login");
                    logout();
                    return;
                }
            }

            await loadGameStatuses();
            await runSearch(1);
        };

        void initialize();
    }, [loadGameStatuses, logout, runSearch]);

    useEffect(() => {
        if (!hasInitializedAutoSearch.current) {
            return;
        }

        setLoading(true);

        const timeoutId = window.setTimeout(() => {
            void runSearch(1);
        }, 1000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        query,
        selectedGenre,
        selectedPlatform,
        selectedTag,
        ordering,
        metacriticMin,
        metacriticMax,
        releasedFrom,
        releasedTo,
        searchPrecise,
        searchExact,
        runSearch,
    ]);

    return (
        <div className="min-h-screen bg-[#151515] text-white pt-28">
            <main className="px-4 md:px-8 lg:px-12 pb-12">
                <section className="mb-6  p-4 md:p-5">
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">Buscar juegos</h1>
                    <p className="text-sm text-gray-400 mb-4">
                        Búsqueda RAWG con filtros por texto, categoría, plataforma, tag, fechas y metacritic.
                    </p>

                    <button
                        type="button"
                        onClick={() => setIsMobileFiltersOpen((current) => !current)}
                        className="md:hidden w-full mb-4 px-4 py-2 rounded-lg border border-gray-700 text-sm font-semibold flex items-center justify-between"
                        aria-expanded={isMobileFiltersOpen}
                        aria-controls="search-filters-form"
                    >
                        <span>Filtros</span>
                        <i className={`pi ${isMobileFiltersOpen ? "pi-chevron-up" : "pi-chevron-down"}`} />
                    </button>

                    <form
                        id="search-filters-form"
                        onSubmit={handleSubmit}
                        className={`space-y-4 ${isMobileFiltersOpen ? "block" : "hidden"} md:block`}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <select
                                value={quickQuery}
                                onChange={(event) => handleQuickQueryChange(event.target.value as QuickQueryKey)}
                                className="md:col-span-4 bg-[#151515] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            >
                                {QUICK_QUERY_OPTIONS.map((option) => (
                                    <option key={option.value || "none"} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <div className="md:col-span-8 flex items-center text-xs md:text-sm text-gray-400 px-1">
                                Consultas tipo con filtros preconfigurados para descubrir juegos rápido.
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Buscar por nombre..."
                                className="md:col-span-5 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            />

                            <select
                                value={selectedGenre}
                                onChange={(event) => setSelectedGenre(event.target.value)}
                                className="md:col-span-2 bg-[#151515] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            >
                                <option value="">Todos los géneros</option>
                                {genresCatalog.map((genre) => (
                                    <option key={genre.id} value={String(genre.id)}>
                                        {genre.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedPlatform}
                                onChange={(event) => setSelectedPlatform(event.target.value)}
                                className="md:col-span-2 bg-[#151515] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            >
                                <option value="">Todas las plataformas</option>
                                {platformsCatalog.slice(0, 40).map((platform) => (
                                    <option key={platform.id} value={String(platform.id)}>
                                        {platform.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedTag}
                                onChange={(event) => setSelectedTag(event.target.value)}
                                className="md:col-span-3 bg-[#151515] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            >
                                <option value="">Todos los tags</option>
                                {tagsCatalog.slice(0, 60).map((tag) => (
                                    <option key={tag.id} value={String(tag.id)}>
                                        {tag.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <select
                                value={ordering}
                                onChange={(event) => setOrdering(event.target.value)}
                                className="md:col-span-3 bg-[#151515] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            >
                                {ORDERING_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={metacriticMin}
                                onChange={(event) => setMetacriticMin(event.target.value)}
                                placeholder="Metacritic min"
                                className="md:col-span-2 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            />

                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={metacriticMax}
                                onChange={(event) => setMetacriticMax(event.target.value)}
                                placeholder="Metacritic max"
                                className="md:col-span-2 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            />

                            <input
                                type="date"
                                value={releasedFrom}
                                onChange={(event) => setReleasedFrom(event.target.value)}
                                className="md:col-span-2 bg-[#151515] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            />

                            <input
                                type="date"
                                value={releasedTo}
                                onChange={(event) => setReleasedTo(event.target.value)}
                                className="md:col-span-2 bg-[#151515] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            />

                            <div className="md:col-span-3 flex items-center gap-4 text-sm text-gray-300">
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={searchPrecise}
                                        onChange={(event) => setSearchPrecise(event.target.checked)}
                                        className="accent-[#ff4200]"
                                    />
                                    Preciso
                                </label>
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={searchExact}
                                        onChange={(event) => setSearchExact(event.target.checked)}
                                        className="accent-[#ff4200]"
                                    />
                                    Exacto
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-[#ff4200] text-black font-semibold hover:brightness-110 transition cursor-pointer"
                                disabled={loading}
                            >
                                Buscar
                            </button>
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="px-4 py-2 rounded-lg border border-gray-600 text-white hover:border-gray-400 hover:bg-white/5 transition cursor-pointer"
                                disabled={loading}
                            >
                                Limpiar
                            </button>
                            <span className="text-sm text-gray-400">{count.toLocaleString()} resultados</span>
                        </div>
                    </form>
                </section>

                <section>
                    {loading && (
                        <div className="grid grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(500px,500px))] gap-4 justify-center justify-items-center py-2">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <GameCardSkeleton
                                    key={`search-skeleton-${index}`}
                                    className="w-full max-w-70 lg:w-125 lg:max-w-125"
                                />
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {!loading && !error && games.length === 0 && (
                        <div className="rounded-lg border border-gray-700 bg-black/20 p-4 text-gray-300 text-sm">
                            No se encontraron juegos con esos filtros.
                        </div>
                    )}

                    {!loading && games.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 lg:[grid-template-columns:repeat(auto-fit,minmax(500px,500px))] gap-4 justify-center justify-items-center">
                                {games.map((game) => {
                                    const status = gameStatusById[String(game.id)];

                                    return (
                                        <GameCard
                                            key={game.id}
                                            game={game}
                                            openMenuId={openMenuId}
                                            toggleMenu={toggleMenu}
                                            initialIsPlayed={status?.isPlayed}
                                            initialIsWishlist={status?.isWishlist}
                                            onStatusChange={handleGameStatusChange}
                                            globalStatusLoading={isStatusLoading}
                                            onGlobalStatusLoadingChange={setIsStatusLoading}
                                            className="w-full max-w-[280px] lg:w-[500px] lg:max-w-[500px]"
                                        />
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => hasPreviousPage && void runSearch(page - 1)}
                                    disabled={!hasPreviousPage || loading}
                                    className="px-4 py-2 rounded-lg border border-gray-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400 hover:bg-white/5 transition cursor-pointer"
                                >
                                    Anterior
                                </button>
                                <span className="text-sm text-gray-300">Página {page}</span>
                                <button
                                    type="button"
                                    onClick={() => hasNextPage && void runSearch(page + 1)}
                                    disabled={!hasNextPage || loading}
                                    className="px-4 py-2 rounded-lg border border-gray-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:border-gray-400 hover:bg-white/5 transition cursor-pointer"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
