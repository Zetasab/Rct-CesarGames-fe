"use client";

import { FormEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameCard, GameCardSkeleton } from "@/components/game-carousel/GameCarousel";
import Footer from "@/shared/footer/Footer";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
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
    storesCatalog,
} from "@/app/static/catalog-data";
import { authService } from "@/services/AuthService";
import { useAuth } from "@/context/AuthContext";

type GameStatusFlags = { isPlayed: boolean; isWishlist: boolean };
type DateRange = { from: Date | null; to: Date | null };
type SelectOption = { label: string; value: string };

const PAGE_SIZE = 20;

const ORDERING_OPTIONS: Array<{ label: string; value: string }> = [
    { label: "Nombre (A-Z)", value: "name" },
    { label: "Nombre (Z-A)", value: "-name" },
    { label: "Lanzamiento (asc)", value: "released" },
    { label: "Lanzamiento (desc)", value: "-released" },
    { label: "Añadidos (asc)", value: "added" },
    { label: "Añadidos (desc)", value: "-added" },
    { label: "Creado (asc)", value: "created" },
    { label: "Creado (desc)", value: "-created" },
    { label: "Actualizado (asc)", value: "updated" },
    { label: "Actualizado (desc)", value: "-updated" },
    { label: "Rating (asc)", value: "rating" },
    { label: "Rating (desc)", value: "-rating" },
    { label: "Metacritic (asc)", value: "metacritic" },
    { label: "Metacritic (desc)", value: "-metacritic" },
];

export default function Search() {
    const { logout } = useAuth();
    const hasInitializedAutoSearch = useRef(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [selectedStores, setSelectedStores] = useState<string[]>([]);
    const [ordering, setOrdering] = useState("");
    const [dateRanges, setDateRanges] = useState<DateRange[]>([{ from: null, to: null }]);
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

    const genreOptions = useMemo<SelectOption[]>(
        () => genresCatalog.map((genre) => ({ label: genre.name, value: String(genre.id) })),
        []
    );

    const platformOptions = useMemo<SelectOption[]>(
        () => platformsCatalog.slice(0, 40).map((platform) => ({ label: platform.name, value: String(platform.id) })),
        []
    );

    const storeOptions = useMemo<SelectOption[]>(
        () => storesCatalog.map((store) => ({ label: store.name, value: String(store.id) })),
        []
    );

    const datesFilter = useMemo(() => {
        const formatDate = (value: Date) => {
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, "0");
            const day = String(value.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const segments = dateRanges
            .filter((range) => range.from && range.to && range.from <= range.to)
            .map((range) => `${formatDate(range.from as Date)},${formatDate(range.to as Date)}`);

        return segments.length ? segments.join(".") : undefined;
    }, [dateRanges]);

    const updateDateRange = (index: number, key: "from" | "to", value: Date | null) => {
        setDateRanges((current) =>
            current.map((range, rangeIndex) => (rangeIndex === index ? { ...range, [key]: value } : range))
        );
    };

    const addDateRange = () => {
        setDateRanges((current) => [...current, { from: null, to: null }]);
    };

    const removeDateRange = (index: number) => {
        setDateRanges((current) => {
            if (current.length === 1) {
                return [{ from: null, to: null }];
            }

            return current.filter((_, rangeIndex) => rangeIndex !== index);
        });
    };

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
            genres: selectedGenres.join(",") || undefined,
            platforms: selectedPlatforms.join(",") || undefined,
            stores: selectedStores.join(",") || undefined,
            ordering: ordering || undefined,
            dates: datesFilter,
            ...overrides,
        };

        try {
            const response: RawgPaginatedResponse<Game> = await gameService.searchGames(params);
            const safeResults = Array.isArray(response.items) ? response.items : [];

            setPage(Number.isFinite(response.page) ? response.page : nextPage);
            setGames(safeResults);
            setCount(Number.isFinite(response.totalCount) ? response.totalCount : 0);
        } catch {
            setGames([]);
            setCount(0);
            setError("No se pudo realizar la búsqueda con los filtros actuales.");
        } finally {
            setLoading(false);
        }
    }, [datesFilter, ordering, query, searchExact, searchPrecise, selectedGenres, selectedPlatforms, selectedStores]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void runSearch(1);
    };

    const handleClearFilters = () => {
        setQuery("");
        setSelectedGenres([]);
        setSelectedPlatforms([]);
        setSelectedStores([]);
        setOrdering("");
        setDateRanges([{ from: null, to: null }]);
        setSearchPrecise(false);
        setSearchExact(false);
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
        selectedGenres,
        selectedPlatforms,
        selectedStores,
        ordering,
        dateRanges,
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
                        Filtros: nombre, precisión, exactitud, plataformas, stores, géneros, fechas y ordenación.
                    </p>

                    <button
                        type="button"
                        onClick={() => setIsMobileFiltersOpen((current) => !current)}
                        className="md:hidden w-full mb-4"
                        aria-expanded={isMobileFiltersOpen}
                        aria-controls="search-filters-form"
                    >
                        <Button
                            type="button"
                            className="w-full"
                            outlined
                            label="Filtros"
                            icon={`pi ${isMobileFiltersOpen ? "pi-chevron-up" : "pi-chevron-down"}`}
                            iconPos="right"
                        />
                    </button>

                    <form
                        id="search-filters-form"
                        onSubmit={handleSubmit}
                        className={`space-y-4 ${isMobileFiltersOpen ? "block" : "hidden"} md:block`}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <InputText
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Buscar por nombre..."
                                className="md:col-span-6 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                            />

                            <div id="genres-filter" className="md:col-span-2 scroll-mt-28">
                                <MultiSelect
                                    value={selectedGenres}
                                    onChange={(event) => setSelectedGenres((event.value as string[]) ?? [])}
                                    options={genreOptions}
                                    optionLabel="label"
                                    optionValue="value"
                                    display="chip"
                                    filter
                                    placeholder="Géneros"
                                    className="w-full"
                                    panelClassName="bg-[#151515] text-white"
                                />
                            </div>

                            <div id="platforms-filter" className="md:col-span-2 scroll-mt-28">
                                <MultiSelect
                                    value={selectedPlatforms}
                                    onChange={(event) => setSelectedPlatforms((event.value as string[]) ?? [])}
                                    options={platformOptions}
                                    optionLabel="label"
                                    optionValue="value"
                                    display="chip"
                                    filter
                                    placeholder="Plataformas"
                                    className="w-full"
                                    panelClassName="bg-[#151515] text-white"
                                />
                            </div>

                            <div id="stores-filter" className="md:col-span-2 scroll-mt-28">
                                <MultiSelect
                                    value={selectedStores}
                                    onChange={(event) => setSelectedStores((event.value as string[]) ?? [])}
                                    options={storeOptions}
                                    optionLabel="label"
                                    optionValue="value"
                                    display="chip"
                                    filter
                                    placeholder="Stores"
                                    className="w-full"
                                    panelClassName="bg-[#151515] text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <Dropdown
                                value={ordering}
                                onChange={(event) => setOrdering((event.value as string) ?? "")}
                                options={[{ label: "Orden por defecto", value: "" }, ...ORDERING_OPTIONS]}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Orden por defecto"
                                className="md:col-span-4"
                                panelClassName="bg-[#151515] text-white"
                            />

                            <div className="md:col-span-3 flex items-center gap-4 text-sm text-gray-300">
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        inputId="searchPrecise"
                                        checked={searchPrecise}
                                        onChange={(event) => setSearchPrecise(Boolean(event.checked))}
                                    />
                                    <span>Preciso</span>
                                </label>
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        inputId="searchExact"
                                        checked={searchExact}
                                        onChange={(event) => setSearchExact(Boolean(event.checked))}
                                    />
                                    <span>Exacto</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs text-gray-400">
                                Rango de fechas (formato backend: YYYY-MM-DD,YYYY-MM-DD. Puedes añadir varios rangos).
                            </p>
                            {dateRanges.map((range, index) => (
                                <div key={`date-range-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                    <Calendar
                                        value={range.from}
                                        onChange={(event) => updateDateRange(index, "from", (event.value as Date | null) ?? null)}
                                        dateFormat="yy-mm-dd"
                                        showIcon
                                        placeholder="Desde"
                                        className="md:col-span-5"
                                    />
                                    <Calendar
                                        value={range.to}
                                        onChange={(event) => updateDateRange(index, "to", (event.value as Date | null) ?? null)}
                                        dateFormat="yy-mm-dd"
                                        showIcon
                                        placeholder="Hasta"
                                        className="md:col-span-5"
                                    />
                                    <Button
                                        type="button"
                                        label="Quitar"
                                        onClick={() => removeDateRange(index)}
                                        outlined
                                        className="md:col-span-2"
                                    />
                                </div>
                            ))}
                            <Button
                                type="button"
                                label="Añadir rango"
                                icon="pi pi-plus"
                                onClick={addDateRange}
                                outlined
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                type="submit"
                                label="Buscar"
                                disabled={loading}
                            />
                            <Button
                                type="button"
                                label="Limpiar"
                                onClick={handleClearFilters}
                                outlined
                                disabled={loading}
                            />
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
                                <Button
                                    type="button"
                                    onClick={() => hasPreviousPage && void runSearch(page - 1)}
                                    disabled={!hasPreviousPage || loading}
                                    label="Anterior"
                                    outlined
                                />
                                <span className="text-sm text-gray-300">Página {page}</span>
                                <Button
                                    type="button"
                                    onClick={() => hasNextPage && void runSearch(page + 1)}
                                    disabled={!hasNextPage || loading}
                                    label="Siguiente"
                                    outlined
                                />
                            </div>
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
