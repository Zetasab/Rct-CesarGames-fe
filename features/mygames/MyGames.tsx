"use client";

import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Game } from "@/models/Game";
import {
    GamePlatform,
    GameResultModel,
    gamePlatformOptions,
    getGamePlatformLabel,
    getGamePlatformOption,
    normalizeGamePlatform,
} from "@/models/GameResultModel";
import { gameResultService } from "@/services/GameResultService";
import { GameCard, GameCardSkeleton } from "@/components/game-carousel/GameCarousel";
import Footer from "@/shared/footer/Footer";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { extractErrorMessage } from "@/services/api-error";
import {
    getGameResultFlags,
    getGameResultGameId,
    loadGameResultList,
} from "@/services/GameResultState";
import {
    gameService,
    GenreListItem,
    PlatformListItem,
    SearchGamesParams,
    StoreListItem,
} from "@/services/GameService";

const PAGE_SIZE = 40;
const STORAGE_KEYS = {
    collectionMode: "mygames.filter.collectionMode",
    mobileGridMode: "mygames.mobile.gridMode",
};

type CollectionMode = "played" | "wishlist";
type SelectOption = { label: string; value: string };

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

const parseCollectionModeFromStorage = (value: string | null): CollectionMode => {
    if (value === "played") return "played";
    if (value === "wishlist") return "wishlist";
    return "played";
};

const toGameFromResult = (result: GameResultModel | Game): Game | null => {
    const rawResult = result as unknown as Record<string, unknown>;

    const fullGameId = Number(rawResult.id);
    if (Number.isFinite(fullGameId) && fullGameId > 0 && "slug" in rawResult) {
        return result as Game;
    }

    const id = Number(rawResult.game_id ?? rawResult.id);
    if (!Number.isFinite(id) || id <= 0) {
        return null;
    }

    const rating = Number(rawResult.rating);
    const rawName = String(rawResult.name ?? "Juego").trim() || "Juego";
    const rawReleased = String(rawResult.released ?? "");
    const rawBackground = String(rawResult.background_image ?? "");
    const rawTba = rawResult.tba === true || rawResult.tba === 1 || String(rawResult.tba ?? "").toLowerCase() === "true";
    const rawPriority = rawResult.Priority === true || rawResult.Priority === 1 || String(rawResult.Priority ?? "").toLowerCase() === "true";

    return {
        id,
        slug: `game-${id}`,
        name: rawName,
        Priority: rawPriority,
        description_raw: "",
        description: "",
        website: "",
        released: rawReleased,
        tba: rawTba,
        background_image: rawBackground,
        rating: Number.isFinite(rating) ? rating : 0,
        rating_top: 0,
        ratings: [],
        ratings_count: 0,
        reviews_text_count: 0,
        added: 0,
        added_by_status: {
            yet: 0,
            owned: 0,
            beaten: 0,
            toplay: 0,
            dropped: 0,
            playing: 0,
        },
        metacritic: 0,
        playtime: 0,
        suggestions_count: 0,
        updated: "",
        user_game: null,
        reviews_count: 0,
        saturated_color: "",
        dominant_color: "",
        platforms: [],
        parent_platforms: [],
        genres: [],
        stores: [],
        clip: null,
        tags: [],
        esrb_rating: null,
        short_screenshots: [],
    };
};

function PlatformIcon({
    platform,
    className = "h-4 w-4",
}: {
    platform: GamePlatform;
    className?: string;
}) {
    const option = getGamePlatformOption(platform);
    const [hasImageError, setHasImageError] = useState(false);
    const fallbackLabel = platform === GamePlatform.None
        ? "-"
        : option.label
            .split(" ")
            .map((segment) => segment[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

    if (!option.iconUrl || hasImageError) {
        return (
            <span className={`inline-flex ${className} items-center justify-center rounded-full bg-white/12 text-[9px] font-bold text-white`}>
                {fallbackLabel}
            </span>
        );
    }

    return (
        <img
            src={option.iconUrl}
            alt={option.label}
            className={className}
            onError={() => setHasImageError(true)}
        />
    );
}

function PlatformOptionContent({
    platform,
    showLabel = true,
}: {
    platform: GamePlatform;
    showLabel?: boolean;
}) {
    return (
        <div className="flex items-center gap-2 text-sm text-white">
            <PlatformIcon platform={platform} className="h-4 w-4 shrink-0" />
            {showLabel ? <span className="truncate">{getGamePlatformLabel(platform)}</span> : null}
        </div>
    );
}

export default function MyGames() {
    const [name, setName] = useState("");
    const [collectionMode, setCollectionMode] = useState<CollectionMode>(() => {
        if (typeof window === "undefined") return "played";
        return parseCollectionModeFromStorage(window.localStorage.getItem(STORAGE_KEYS.collectionMode));
    });
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [selectedStores, setSelectedStores] = useState<string[]>([]);
    const [ordering, setOrdering] = useState("");
    const [dateRange, setDateRange] = useState<Date[] | null>(null);
    const [searchPrecise, setSearchPrecise] = useState(false);
    const [searchExact, setSearchExact] = useState(false);
    const [genreOptions, setGenreOptions] = useState<SelectOption[]>([]);
    const [platformOptions, setPlatformOptions] = useState<SelectOption[]>([]);
    const [storeOptions, setStoreOptions] = useState<SelectOption[]>([]);
    const [mobileGridMode, setMobileGridMode] = useState<"double" | "single">(() => {
        if (typeof window === "undefined") return "double";
        return window.localStorage.getItem(STORAGE_KEYS.mobileGridMode) === "single" ? "single" : "double";
    });
    const [games, setGames] = useState<Game[]>([]);
    const [priorityByGameId, setPriorityByGameId] = useState<Record<number, boolean>>({});
    const [isPlayedByGameId, setIsPlayedByGameId] = useState<Record<number, boolean>>({});
    const [isWishlistByGameId, setIsWishlistByGameId] = useState<Record<number, boolean>>({});
    const [isBoughtByGameId, setIsBoughtByGameId] = useState<Record<number, boolean>>({});
    const [isMultiplayerByGameId, setIsMultiplayerByGameId] = useState<Record<number, boolean>>({});
    const [platformByGameId, setPlatformByGameId] = useState<Record<number, GamePlatform>>({});
    const [buyLoadingByGameId, setBuyLoadingByGameId] = useState<Record<number, boolean>>({});
    const [multiplayerLoadingByGameId, setMultiplayerLoadingByGameId] = useState<Record<number, boolean>>({});
    const [platformLoadingByGameId, setPlatformLoadingByGameId] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(false);
    const [priorityLoadingGameId, setPriorityLoadingGameId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [lastPageResultCount, setLastPageResultCount] = useState(0);
    const [totalRecordsFromApi, setTotalRecordsFromApi] = useState<number | null>(null);
    const hasAutoFiltered = useRef(false);
    const toastRef = useRef<Toast>(null);

    const datesFilter = useMemo(() => {
        const formatDate = (value: Date) => {
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, "0");
            const day = String(value.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const from = dateRange?.[0] ?? null;
        const to = dateRange?.[1] ?? null;

        if (!from || !to || from > to) {
            return undefined;
        }

        return `${formatDate(from)},${formatDate(to)}`;
    }, [dateRange]);

    const hasAnyFilter = useMemo(() => {
        return (
            Boolean(name.trim()) ||
            selectedGenres.length > 0 ||
            selectedPlatforms.length > 0 ||
            selectedStores.length > 0 ||
            Boolean(ordering) ||
            Boolean(datesFilter) ||
            searchPrecise ||
            searchExact
        );
    }, [datesFilter, name, ordering, searchExact, searchPrecise, selectedGenres.length, selectedPlatforms.length, selectedStores.length]);

    const orderedGames = useMemo(() => {
        if (games.length <= 1) {
            return games;
        }

        const priorityGames: Game[] = [];
        const regularGames: Game[] = [];

        for (const game of games) {
            if (priorityByGameId[game.id]) {
                priorityGames.push(game);
            } else {
                regularGames.push(game);
            }
        }

        return [...priorityGames, ...regularGames];
    }, [games, priorityByGameId]);

    const toggleMenu = useCallback((e: MouseEvent, id: number) => {
        e.stopPropagation();
        e.preventDefault();
        setOpenMenuId((current) => (current === id ? null : id));
    }, []);

    const runFilter = useCallback(async (page: number = 0) => {
        setLoading(true);
        setError(null);
        setOpenMenuId(null);

        try {
            const savedGames = await loadGameResultList();
            const savedStatusByGameId = savedGames.reduce<Record<string, { isPlayed: boolean; isWishlist: boolean }>>((acc, item) => {
                const gameId = getGameResultGameId(item);
                if (!gameId) {
                    return acc;
                }

                acc[gameId] = getGameResultFlags(item);
                return acc;
            }, {});

            const params: SearchGamesParams = {
                page: page + 1,
                pageSize: PAGE_SIZE,
                search: name.trim() || undefined,
                searchPrecise,
                searchExact,
                genres: selectedGenres.join(",") || undefined,
                platforms: selectedPlatforms.join(",") || undefined,
                stores: selectedStores.join(",") || undefined,
                ordering: ordering || undefined,
                dates: datesFilter,
            };

            const response = await gameResultService.searchUserCollection(
                collectionMode === "played" ? "PlayedGames" : "WishlistGames",
                params
            );

            const responseRecord = response as {
                items?: GameResultModel[];
                results?: GameResultModel[];
                count?: number;
                totalCount?: number;
                page?: number;
            };

            const safeResults = Array.isArray(responseRecord.items)
                ? responseRecord.items
                : Array.isArray(responseRecord.results)
                    ? responseRecord.results
                    : [];

            const rawCount = responseRecord.totalCount ?? responseRecord.count;
            const parsedCount = Number(rawCount);
            const hasValidCount = Number.isFinite(parsedCount) && parsedCount >= 0;

            const apiPage = Number(responseRecord.page);
            const currentApiPage = Number.isFinite(apiPage) && apiPage > 0 ? apiPage - 1 : page;

            setCurrentPage(currentApiPage);
            setLastPageResultCount(safeResults.length);
            setTotalRecordsFromApi(hasValidCount ? parsedCount : null);

            const nextPriorityByGameId: Record<number, boolean> = {};
            const nextIsPlayedByGameId: Record<number, boolean> = {};
            const nextIsWishlistByGameId: Record<number, boolean> = {};
            const nextIsBoughtByGameId: Record<number, boolean> = {};
            const nextIsMultiplayerByGameId: Record<number, boolean> = {};
            const nextPlatformByGameId: Record<number, GamePlatform> = {};
            const nextGamesById = new Map<number, Game>();

            for (const result of safeResults) {
                const record = result as unknown as Record<string, unknown>;
                const gameId = Number(record.game_id ?? record.id);
                if (!Number.isFinite(gameId) || gameId <= 0) continue;

                const rawPriority =
                    record.priority ??
                    record.Priority ??
                    record.isPriority ??
                    record.IsPriority;

                const isPriority =
                    rawPriority === true ||
                    rawPriority === 1 ||
                    String(rawPriority ?? '').trim().toLowerCase() === 'true';

                const rawIsPlayed = record.isPlayed ?? record.IsPlayed;
                const rawIsWishlist = record.isWishlist ?? record.IsWishlist;
                const rawIsBought = record.isBought ?? record.IsBought;
                const rawIsMultiplayer = record.isMultiplayer ?? record.IsMultiplayer;
                const rawPlatform =
                    record.gamePlaform ??
                    record.gamePlatform ??
                    record.GamePlatform ??
                    record.platform ??
                    record.Platform;

                const parsedIsPlayed =
                    rawIsPlayed === true ||
                    rawIsPlayed === 1 ||
                    String(rawIsPlayed ?? '').trim().toLowerCase() === 'true';

                const parsedIsWishlist =
                    rawIsWishlist === true ||
                    rawIsWishlist === 1 ||
                    String(rawIsWishlist ?? '').trim().toLowerCase() === 'true';

                const hasRawPlayed = rawIsPlayed !== undefined && rawIsPlayed !== null;
                const hasRawWishlist = rawIsWishlist !== undefined && rawIsWishlist !== null;

                const savedFlags = savedStatusByGameId[String(gameId)];
                const effectiveIsPlayed = typeof savedFlags?.isPlayed === "boolean"
                    ? savedFlags.isPlayed
                    : hasRawPlayed
                        ? parsedIsPlayed
                        : collectionMode === "played";

                const effectiveIsWishlist = typeof savedFlags?.isWishlist === "boolean"
                    ? savedFlags.isWishlist
                    : hasRawWishlist
                        ? parsedIsWishlist
                        : collectionMode === "wishlist";

                const parsedIsBought =
                    rawIsBought === true ||
                    rawIsBought === 1 ||
                    String(rawIsBought ?? '').trim().toLowerCase() === 'true';

                const parsedIsMultiplayer =
                    rawIsMultiplayer === true ||
                    rawIsMultiplayer === 1 ||
                    String(rawIsMultiplayer ?? '').trim().toLowerCase() === 'true';

                nextPriorityByGameId[gameId] = isPriority;
                nextIsPlayedByGameId[gameId] = effectiveIsPlayed;
                nextIsWishlistByGameId[gameId] = effectiveIsWishlist;
                nextIsBoughtByGameId[gameId] = parsedIsBought;
                nextIsMultiplayerByGameId[gameId] = parsedIsMultiplayer;
                nextPlatformByGameId[gameId] = normalizeGamePlatform(rawPlatform);

                const game = toGameFromResult(result);
                if (game) {
                    nextGamesById.set(game.id, game);
                }
            }

            const nextGames = Array.from(nextGamesById.values());

            if (!nextGames.length) {
                setGames([]);
                setPriorityByGameId({});
                setIsPlayedByGameId({});
                setIsWishlistByGameId({});
                setIsBoughtByGameId({});
                setIsMultiplayerByGameId({});
                setPlatformByGameId({});
                return;
            }

            setGames(nextGames);
            setPriorityByGameId(nextPriorityByGameId);
            setIsPlayedByGameId(nextIsPlayedByGameId);
            setIsWishlistByGameId(nextIsWishlistByGameId);
            setIsBoughtByGameId(nextIsBoughtByGameId);
            setIsMultiplayerByGameId(nextIsMultiplayerByGameId);
            setPlatformByGameId(nextPlatformByGameId);
        } catch (error) {
            setGames([]);
            setPriorityByGameId({});
            setIsPlayedByGameId({});
            setIsWishlistByGameId({});
            setIsBoughtByGameId({});
            setIsMultiplayerByGameId({});
            setPlatformByGameId({});
            setError(extractErrorMessage(error, "No se pudieron cargar tus juegos con los filtros actuales."));
        } finally {
            setLoading(false);
        }
    }, [collectionMode, datesFilter, name, ordering, searchExact, searchPrecise, selectedGenres, selectedPlatforms, selectedStores]);

    const hasNextPage = lastPageResultCount === PAGE_SIZE;
    const totalRecords = totalRecordsFromApi ?? ((currentPage + 1) * PAGE_SIZE + (hasNextPage ? 1 : 0));

    const handlePaginatorChange = useCallback((event: PaginatorPageChangeEvent) => {
        if (loading) {
            return;
        }
        const nextPage = Math.floor(event.first / event.rows);
        void runFilter(nextPage);
    }, [loading, runFilter]);

    const handlePriorityLongPress = useCallback(async (game: Game) => {
        if (priorityLoadingGameId === game.id) {
            return;
        }

        const currentlyPriority = Boolean(priorityByGameId[game.id]);

        confirmDialog({
            message: currentlyPriority
                ? `¿Quieres quitar \"${game.name}\" de prioridad?`
                : `¿Quieres poner \"${game.name}\" como prioridad?`,
            header: currentlyPriority ? "Quitar prioridad" : "Marcar prioridad",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sí",
            rejectLabel: "No",
            acceptClassName: "p-button-warning",
            accept: async () => {
                setPriorityLoadingGameId(game.id);

                try {
                    if (currentlyPriority) {
                        await gameResultService.unsetPriority(game.id);
                        setPriorityByGameId((current) => ({ ...current, [game.id]: false }));
                    } else {
                        await gameResultService.setPriority(game.id);
                        setPriorityByGameId((current) => ({ ...current, [game.id]: true }));
                    }
                } catch (error) {
                    setError(extractErrorMessage(error, "No se pudo actualizar la prioridad del juego."));
                } finally {
                    setPriorityLoadingGameId(null);
                }
            },
        });
    }, [priorityByGameId, priorityLoadingGameId]);

    const handleGameStatusChange = useCallback((gameId: number, next: { isPlayed: boolean; isWishlist: boolean }) => {
        setIsPlayedByGameId((current) => ({ ...current, [gameId]: next.isPlayed }));
        setIsWishlistByGameId((current) => ({ ...current, [gameId]: next.isWishlist }));

        const isBought = Boolean(isBoughtByGameId[gameId]);
        const isMultiplayerEnabled = Boolean(isMultiplayerByGameId[gameId]);

        if (!next.isPlayed && !next.isWishlist && !isBought && !isMultiplayerEnabled) {
            setGames((current) => current.filter((game) => game.id !== gameId));
            setPriorityByGameId((current) => {
                const nextPriority = { ...current };
                delete nextPriority[gameId];
                return nextPriority;
            });
            setIsPlayedByGameId((current) => {
                const nextPlayed = { ...current };
                delete nextPlayed[gameId];
                return nextPlayed;
            });
            setIsWishlistByGameId((current) => {
                const nextWishlist = { ...current };
                delete nextWishlist[gameId];
                return nextWishlist;
            });
            setIsBoughtByGameId((current) => {
                const nextBought = { ...current };
                delete nextBought[gameId];
                return nextBought;
            });
            setIsMultiplayerByGameId((current) => {
                const nextMultiplayer = { ...current };
                delete nextMultiplayer[gameId];
                return nextMultiplayer;
            });
            setPlatformByGameId((current) => {
                const nextPlatform = { ...current };
                delete nextPlatform[gameId];
                return nextPlatform;
            });
        }
    }, [isBoughtByGameId, isMultiplayerByGameId]);

    const handlePlatformChange = useCallback(async (gameId: number, platform: GamePlatform) => {
        if (platformLoadingByGameId[gameId]) {
            return;
        }

        const currentPlatform = platformByGameId[gameId] ?? GamePlatform.None;
        if (currentPlatform === platform) {
            return;
        }

        setPlatformLoadingByGameId((current) => ({ ...current, [gameId]: true }));

        try {
            await gameResultService.changePlatform(gameId, platform);
            setPlatformByGameId((current) => ({ ...current, [gameId]: platform }));
            toastRef.current?.show({
                severity: "success",
                summary: "Plataforma actualizada",
                detail: `Se cambió a ${getGamePlatformLabel(platform)}.`,
                life: 2200,
            });
        } catch (error) {
            setError(extractErrorMessage(error, "No se pudo actualizar la plataforma del juego."));
        } finally {
            setPlatformLoadingByGameId((current) => ({ ...current, [gameId]: false }));
        }
    }, [platformByGameId, platformLoadingByGameId]);

    const handleToggleBought = useCallback(async (gameId: number) => {
        if (buyLoadingByGameId[gameId]) {
            return;
        }

        const isCurrentlyBought = Boolean(isBoughtByGameId[gameId]);

        setBuyLoadingByGameId((current) => ({ ...current, [gameId]: true }));

        try {
            if (isCurrentlyBought) {
                await gameResultService.setNotBought(gameId);
                setIsBoughtByGameId((current) => ({ ...current, [gameId]: false }));
            } else {
                await gameResultService.setBought(gameId);
                setIsBoughtByGameId((current) => ({ ...current, [gameId]: true }));
            }
        } catch (error) {
            setError(extractErrorMessage(
                error,
                isCurrentlyBought
                    ? "No se pudo quitar el juego de comprados."
                    : "No se pudo marcar el juego como comprado."
            ));
        } finally {
            setBuyLoadingByGameId((current) => ({ ...current, [gameId]: false }));
        }
    }, [buyLoadingByGameId, isBoughtByGameId]);

    const handleToggleMultiplayer = useCallback(async (gameId: number) => {
        if (multiplayerLoadingByGameId[gameId]) {
            return;
        }

        const isCurrentlyMultiplayer = Boolean(isMultiplayerByGameId[gameId]);
        setMultiplayerLoadingByGameId((current) => ({ ...current, [gameId]: true }));

        try {
            if (isCurrentlyMultiplayer) {
                await gameResultService.setSingleplayer(gameId);
                setIsMultiplayerByGameId((current) => ({ ...current, [gameId]: false }));
            } else {
                await gameResultService.setMultiplayer(gameId);
                setIsMultiplayerByGameId((current) => ({ ...current, [gameId]: true }));
            }
        } catch (error) {
            setError(extractErrorMessage(
                error,
                isCurrentlyMultiplayer
                    ? "No se pudo cambiar a un jugador."
                    : "No se pudo cambiar a multijugador."
            ));
        } finally {
            setMultiplayerLoadingByGameId((current) => ({ ...current, [gameId]: false }));
        }
    }, [multiplayerLoadingByGameId, isMultiplayerByGameId]);

    const handleClearFilters = useCallback(() => {
        setName("");
        setSelectedGenres([]);
        setSelectedPlatforms([]);
        setSelectedStores([]);
        setOrdering("");
        setDateRange(null);
        setSearchPrecise(false);
        setSearchExact(false);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadFilterOptions = async () => {
            const [genresResult, platformsResult, storesResult] = await Promise.allSettled([
                gameService.getGenres(),
                gameService.getPlatforms(),
                gameService.getStores(),
            ]);

            if (!isMounted) {
                return;
            }

            const genres = genresResult.status === "fulfilled" ? genresResult.value : [];
            const platforms = platformsResult.status === "fulfilled" ? platformsResult.value : [];
            const stores = storesResult.status === "fulfilled" ? storesResult.value : [];

            setGenreOptions(
                (Array.isArray(genres) ? genres : []).map((genre: GenreListItem) => ({
                    label: genre.name,
                    value: String(genre.id),
                }))
            );

            setPlatformOptions(
                (Array.isArray(platforms) ? platforms : []).slice(0, 40).map((platform: PlatformListItem) => ({
                    label: platform.name,
                    value: String(platform.id),
                }))
            );

            setStoreOptions(
                (Array.isArray(stores) ? stores : []).map((store: StoreListItem) => ({
                    label: store.name,
                    value: String(store.id),
                }))
            );
        };

        void loadFilterOptions();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (hasAutoFiltered.current) return;
        hasAutoFiltered.current = true;
        void runFilter(0);
    }, [runFilter]);

    useEffect(() => {
        if (!hasAutoFiltered.current) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            void runFilter(0);
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [collectionMode, dateRange, name, ordering, runFilter, searchExact, searchPrecise, selectedGenres, selectedPlatforms, selectedStores]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.collectionMode, collectionMode);
    }, [collectionMode]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.mobileGridMode, mobileGridMode);
    }, [mobileGridMode]);

    return (
        <div className="min-h-screen bg-[#151515] text-white pt-28">
            <ConfirmDialog />
            <Toast ref={toastRef} position="bottom-right" />
            <main className="px-4 md:px-8 lg:px-12 pb-12">
                <section className="pb-4 border-b border-gray-800/70">
                    <div className="mb-3 md:hidden">
                        <div className="inline-flex rounded-lg border border-gray-700 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setMobileGridMode("double")}
                                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                                    mobileGridMode === "double"
                                        ? "bg-[#ff4200] text-white"
                                        : "bg-transparent text-gray-300 hover:bg-white/10"
                                }`}
                                aria-pressed={mobileGridMode === "double"}
                            >
                                Grid 2x1
                            </button>
                            <button
                                type="button"
                                onClick={() => setMobileGridMode("single")}
                                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                                    mobileGridMode === "single"
                                        ? "bg-[#ff4200] text-white"
                                        : "bg-transparent text-gray-300 hover:bg-white/10"
                                }`}
                                aria-pressed={mobileGridMode === "single"}
                            >
                                Grid 1x1
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="inline-flex rounded-lg border border-gray-700 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setCollectionMode("played")}
                                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                                    collectionMode === "played"
                                        ? "bg-[#ff4200] text-white"
                                        : "bg-transparent text-gray-300 hover:bg-white/10"
                                }`}
                                aria-pressed={collectionMode === "played"}
                            >
                                Jugados
                            </button>
                            <button
                                type="button"
                                onClick={() => setCollectionMode("wishlist")}
                                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                                    collectionMode === "wishlist"
                                        ? "bg-[#ff4200] text-white"
                                        : "bg-transparent text-gray-300 hover:bg-white/10"
                                }`}
                                aria-pressed={collectionMode === "wishlist"}
                            >
                                Deseados
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-start justify-items-stretch">
                            <div className="md:col-span-3 p-1">
                                <InputText
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Buscar por nombre..."
                                    className="w-full bg-transparent border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#ff4200]"
                                />
                            </div>

                            <div className="md:col-span-2 p-1">
                                <MultiSelect
                                    value={selectedGenres}
                                    onChange={(event) => setSelectedGenres((event.value as string[]) ?? [])}
                                    options={genreOptions}
                                    optionLabel="label"
                                    optionValue="value"
                                    display="chip"
                                    filter
                                    placeholder="Géneros"
                                    className="w-full text-xs"
                                    panelClassName="bg-[#151515] text-white"
                                />
                            </div>

                            <div className="md:col-span-2 p-1">
                                <MultiSelect
                                    value={selectedPlatforms}
                                    onChange={(event) => setSelectedPlatforms((event.value as string[]) ?? [])}
                                    options={platformOptions}
                                    optionLabel="label"
                                    optionValue="value"
                                    display="chip"
                                    filter
                                    placeholder="Plataformas"
                                    className="w-full text-xs"
                                    panelClassName="bg-[#151515] text-white"
                                />
                            </div>

                            <div className="md:col-span-2 p-1">
                                <MultiSelect
                                    value={selectedStores}
                                    onChange={(event) => setSelectedStores((event.value as string[]) ?? [])}
                                    options={storeOptions}
                                    optionLabel="label"
                                    optionValue="value"
                                    display="chip"
                                    filter
                                    placeholder="Stores"
                                    className="w-full text-xs"
                                    panelClassName="bg-[#151515] text-white"
                                />
                            </div>

                            <div className="md:col-span-3 p-1">
                                <Calendar
                                    value={dateRange}
                                    onChange={(event) => setDateRange((event.value as Date[] | null) ?? null)}
                                    selectionMode="range"
                                    dateFormat="yy-mm-dd"
                                    showIcon
                                    readOnlyInput
                                    placeholder="Desde - Hasta"
                                    className="w-full text-xs"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-start gap-2">
                            <div className="flex items-center gap-3 text-xs text-gray-300">
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        inputId="mygamesSearchPrecise"
                                        checked={searchPrecise}
                                        onChange={(event) => setSearchPrecise(Boolean(event.checked))}
                                    />
                                    <span>Preciso</span>
                                </label>
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        inputId="mygamesSearchExact"
                                        checked={searchExact}
                                        onChange={(event) => setSearchExact(Boolean(event.checked))}
                                    />
                                    <span>Exacto</span>
                                </label>
                            </div>

                            <Dropdown
                                value={ordering}
                                onChange={(event) => setOrdering((event.value as string) ?? "")}
                                options={[{ label: "Orden por defecto", value: "" }, ...ORDERING_OPTIONS]}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Ordenar"
                                className="w-full md:w-56 text-xs"
                                panelClassName="bg-[#151515] text-white"
                            />

                            <div className="flex flex-wrap items-center gap-2 justify-start">
                                <Button
                                    type="button"
                                    label="Limpiar"
                                    onClick={handleClearFilters}
                                    outlined
                                    disabled={loading}
                                />
                                <span className="text-xs text-gray-400">{totalRecords.toLocaleString()} resultados</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6">
                    {loading && (
                        <div className={`grid ${mobileGridMode === "single" ? "grid-cols-1" : "grid-cols-2"} lg:grid-cols-[repeat(auto-fit,minmax(500px,500px))] gap-4 justify-center justify-items-center`}>
                            {Array.from({ length: 8 }).map((_, index) => (
                                <GameCardSkeleton
                                    key={`mygames-skeleton-${index}`}
                                    className="w-full max-w-70 lg:w-125 lg:max-w-125"
                                    mediaClassName={mobileGridMode === "double" ? "h-[110px] md:h-[250px]" : "h-[176px] md:h-[250px]"}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    {!loading && !error && hasAnyFilter && games.length === 0 && (
                        <div className="rounded-lg border border-gray-700 bg-black/20 p-4 text-gray-300 text-sm">
                            No se encontraron juegos con esos filtros.
                        </div>
                    )}

                    {!loading && games.length > 0 && (
                        <>
                            <div className={`grid ${mobileGridMode === "single" ? "grid-cols-1" : "grid-cols-2"} lg:grid-cols-[repeat(auto-fit,minmax(500px,500px))] gap-4 justify-center justify-items-center`}>
                                {orderedGames.map((game) => (
                                    <div key={game.id} className="group relative w-full max-w-70 lg:w-125 lg:max-w-125">
                                        <GameCard
                                            game={game}
                                            openMenuId={openMenuId}
                                            toggleMenu={toggleMenu}
                                            isPriority={Boolean(priorityByGameId[game.id])}
                                            initialIsPlayed={Boolean(isPlayedByGameId[game.id])}
                                            initialIsWishlist={Boolean(isWishlistByGameId[game.id])}
                                            onStatusChange={handleGameStatusChange}
                                            globalStatusLoading={isStatusLoading}
                                            onGlobalStatusLoadingChange={setIsStatusLoading}
                                            onLongPress={handlePriorityLongPress}
                                            className="w-full max-w-70 lg:w-125 lg:max-w-125"
                                            mediaClassName={mobileGridMode === "double" ? "h-[110px] md:h-[250px]" : "h-[176px] md:h-[250px]"}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex items-center justify-center">
                                <Paginator
                                    first={currentPage * PAGE_SIZE}
                                    rows={PAGE_SIZE}
                                    totalRecords={totalRecords}
                                    onPageChange={handlePaginatorChange}
                                    template="PrevPageLink CurrentPageReport NextPageLink"
                                    currentPageReportTemplate={`Página ${currentPage + 1}`}
                                    className="bg-transparent border-none"
                                />
                            </div>
                        </>
                    )}
                </section>
            </main>
            <Footer />
            <style jsx global>{`
                .mygames-platform-select.p-dropdown {
                    border-radius: 9999px;
                    border: 1px solid rgba(255, 255, 255, 0.16);
                    background: rgba(0, 0, 0, 0.62);
                    box-shadow: none;
                }

                .mygames-platform-select .p-dropdown-label {
                    color: #ffffff;
                }

                .mygames-platform-multiselect.p-multiselect {
                    width: 100%;
                    border-radius: 0.75rem;
                    border: 1px solid rgba(255, 255, 255, 0.16);
                    background: rgba(0, 0, 0, 0.4);
                    box-shadow: none;
                }

                .mygames-platform-multiselect .p-multiselect-label {
                    padding: 0.6rem 0.8rem;
                    color: #ffffff;
                }

                .mygames-platform-multiselect .p-multiselect-trigger {
                    width: 2.5rem;
                    color: #d1d5db;
                }

                .mygames-platform-multiselect .p-multiselect-token {
                    background: rgba(255, 66, 0, 0.2);
                    color: #fff;
                    border-radius: 9999px;
                }

                .mygames-platform-panel .p-multiselect-items {
                    padding: 0.35rem;
                }

                .mygames-platform-panel .p-multiselect-item {
                    border-radius: 0.65rem;
                    color: #f3f4f6;
                    margin-bottom: 0.15rem;
                }

                .mygames-platform-panel .p-multiselect-item:hover,
                .mygames-platform-panel .p-multiselect-item.p-highlight {
                    background: rgba(255, 66, 0, 0.16);
                    color: #ffffff;
                }

                .mygames-platform-select--desktop {
                    width: 2.1rem;
                    min-width: 2.1rem;
                    height: 2rem;
                }

                .mygames-platform-select--desktop .p-dropdown-label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                }

                .mygames-platform-select--desktop .p-dropdown-trigger {
                    display: none;
                }

                .mygames-platform-select--mobile {
                    width: 100%;
                    border-radius: 0.75rem;
                    border-color: rgba(255, 255, 255, 0.18);
                    background: rgba(255, 255, 255, 0.05);
                }

                .mygames-platform-select--mobile .p-dropdown-label {
                    padding: 0.7rem 0.9rem;
                }

                .mygames-platform-select--mobile .p-dropdown-trigger {
                    width: 2.5rem;
                    color: #d1d5db;
                }

                .mygames-platform-panel.p-dropdown-panel {
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    background: #151515;
                }

                .mygames-platform-panel .p-dropdown-items {
                    padding: 0.35rem;
                }

                .mygames-platform-panel .p-dropdown-item {
                    border-radius: 0.65rem;
                    color: #f3f4f6;
                    margin-bottom: 0.15rem;
                }

                .mygames-platform-panel .p-dropdown-item:hover,
                .mygames-platform-panel .p-dropdown-item.p-highlight {
                    background: rgba(255, 66, 0, 0.16);
                    color: #ffffff;
                }
            `}</style>
        </div>
    );
}
