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
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { extractErrorMessage } from "@/services/api-error";

const PAGE_SIZE = 40;
const STORAGE_KEYS = {
    statusMode: "mygames.filter.statusMode",
    isBought: "mygames.filter.isBought",
    isMultiplayer: "mygames.filter.isMultiplayer",
    platforms: "mygames.filter.platforms",
    mobileGridMode: "mygames.mobile.gridMode",
};

type TriStateFilter = boolean | null;
type StatusMode = "played" | "wishlist" | null;

const parseTriStateFromStorage = (value: string | null): TriStateFilter => {
    if (value === "true") return true;
    if (value === "false") return false;
    return null;
};

const parseStatusModeFromStorage = (value: string | null): StatusMode => {
    if (value === "played") return "played";
    if (value === "wishlist") return "wishlist";
    return null;
};

const parsePlatformsFromStorage = (value: string | null): GamePlatform[] => {
    if (!value) return [];

    try {
        const parsedValue = JSON.parse(value);
        if (!Array.isArray(parsedValue)) {
            return [];
        }

        const normalized = parsedValue.map((platform) => normalizeGamePlatform(platform));
        return Array.from(new Set(normalized));
    } catch {
        return [];
    }
};

const toGameFromResult = (result: GameResultModel): Game | null => {
    const id = Number(result.game_id);
    if (!Number.isFinite(id) || id <= 0) {
        return null;
    }

    const rating = Number(result.rating);

    return {
        id,
        slug: `game-${id}`,
        name: (result.name || "Juego").trim() || "Juego",
        Priority: Boolean(result.Priority),
        description_raw: "",
        description: "",
        website: "",
        released: result.released || "",
        tba: Boolean(result.tba),
        background_image: result.background_image || "",
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
    const [statusMode, setStatusMode] = useState<StatusMode>(() => {
        if (typeof window === "undefined") return null;
        return parseStatusModeFromStorage(window.localStorage.getItem(STORAGE_KEYS.statusMode));
    });
    const [isBought, setIsBought] = useState<TriStateFilter>(() => {
        if (typeof window === "undefined") return false;
        return parseTriStateFromStorage(window.localStorage.getItem(STORAGE_KEYS.isBought));
    });
    const [isMultiplayer, setIsMultiplayer] = useState<TriStateFilter>(() => {
        if (typeof window === "undefined") return false;
        return parseTriStateFromStorage(window.localStorage.getItem(STORAGE_KEYS.isMultiplayer));
    });
    const [platforms, setPlatforms] = useState<GamePlatform[]>(() => {
        if (typeof window === "undefined") return [];
        return parsePlatformsFromStorage(window.localStorage.getItem(STORAGE_KEYS.platforms));
    });
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
    const [priorityLoadingGameId, setPriorityLoadingGameId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [lastPageResultCount, setLastPageResultCount] = useState(0);
    const [totalRecordsFromApi, setTotalRecordsFromApi] = useState<number | null>(null);
    const hasAutoFiltered = useRef(false);
    const toastRef = useRef<Toast>(null);

    const cycleStatusMode = useCallback(() => {
        setStatusMode((current) => {
            if (current === null) return "played";
            if (current === "played") return "wishlist";
            return null;
        });
    }, []);

    const cycleTriState = useCallback((current: TriStateFilter): TriStateFilter => {
        if (current === null) return true;
        if (current === true) return false;
        return null;
    }, []);

    const hasAnyFilter = useMemo(() => {
        return Boolean(name.trim()) || statusMode !== null || isBought !== null || isMultiplayer !== null || platforms.length > 0;
    }, [name, statusMode, isBought, isMultiplayer, platforms]);

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
            const filteredResults = await gameResultService.filter(
                name.trim() || undefined,
                statusMode === "played" ? true : statusMode === "wishlist" ? false : true,
                statusMode === "wishlist" ? true : statusMode === "played" ? false : true,
                isMultiplayer === null ? undefined : isMultiplayer,
                isBought === null ? undefined : isBought,
                platforms.length ? platforms : undefined,
                page * PAGE_SIZE,
                PAGE_SIZE
            );

            const response = Array.isArray(filteredResults)
                ? { results: filteredResults, count: undefined }
                : (filteredResults as { results?: GameResultModel[]; count?: number });

            const safeResults = Array.isArray(response.results) ? response.results : [];
            const parsedCount = Number(response.count);
            const hasValidCount = Number.isFinite(parsedCount) && parsedCount >= 0;

            setCurrentPage(page);
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
                const gameId = Number(result.game_id);
                if (!Number.isFinite(gameId) || gameId <= 0) continue;

                const record = result as unknown as Record<string, unknown>;
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

                const parsedIsBought =
                    rawIsBought === true ||
                    rawIsBought === 1 ||
                    String(rawIsBought ?? '').trim().toLowerCase() === 'true';

                const parsedIsMultiplayer =
                    rawIsMultiplayer === true ||
                    rawIsMultiplayer === 1 ||
                    String(rawIsMultiplayer ?? '').trim().toLowerCase() === 'true';

                nextPriorityByGameId[gameId] = isPriority;
                nextIsPlayedByGameId[gameId] = parsedIsPlayed;
                nextIsWishlistByGameId[gameId] = parsedIsWishlist;
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
    }, [name, statusMode, isBought, isMultiplayer, platforms]);

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
    }, [name, statusMode, isBought, isMultiplayer, platforms, runFilter]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.statusMode, statusMode ?? "null");
    }, [statusMode]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.isBought, isBought === null ? "null" : String(isBought));
    }, [isBought]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.isMultiplayer, isMultiplayer === null ? "null" : String(isMultiplayer));
    }, [isMultiplayer]);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.platforms, JSON.stringify(platforms));
    }, [platforms]);

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

                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_14rem_auto] gap-3 md:gap-4 md:items-center">
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Filtrar por nombre"
                            className="bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#ff4200]"
                        />

                        <div className="w-full md:w-56 max-w-full md:justify-self-end">
                            <MultiSelect
                                value={platforms}
                                options={gamePlatformOptions}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(event: MultiSelectChangeEvent) => {
                                    const selectedPlatforms = Array.isArray(event.value)
                                        ? event.value.map((platform) => normalizeGamePlatform(platform))
                                        : [];
                                    setPlatforms(Array.from(new Set(selectedPlatforms)));
                                }}
                                itemTemplate={(option) => (
                                    <PlatformOptionContent
                                        platform={normalizeGamePlatform(option?.value)}
                                    />
                                )}
                                selectedItemTemplate={(value) => (
                                    <PlatformOptionContent platform={normalizeGamePlatform(value)} />
                                )}
                                placeholder="Plataformas"
                                filter
                                display="chip"
                                className="mygames-platform-multiselect"
                                panelClassName="mygames-platform-panel"
                                aria-label="Filtrar por plataformas"
                            />
                        </div>

                        <div className="rounded-lg p-1 flex items-center justify-center md:justify-end gap-2 flex-wrap md:flex-nowrap">
                            <button
                                type="button"
                                onClick={cycleStatusMode}
                                className={`h-10 rounded-lg px-3 flex items-center justify-center gap-2 transition-colors border text-sm font-semibold cursor-pointer ${
                                    statusMode === "played"
                                        ? 'bg-transparent border-green-500 text-green-400'
                                        : statusMode === "wishlist"
                                            ? 'bg-transparent border-blue-500 text-blue-400'
                                            : 'bg-transparent border-gray-300 text-gray-100'
                                }`}
                                title="Filtro estado: Jugado, Wishlist o Indiferente"
                                aria-pressed={statusMode !== null}
                            >
                                <i className={`pi ${statusMode === "played" ? "pi-check" : statusMode === "wishlist" ? "pi-clock" : "pi-minus"} text-lg`}></i>
                                <span>{statusMode === "played" ? "Jugado" : statusMode === "wishlist" ? "Wishlist" : "Indiferente"}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsBought((current) => cycleTriState(current))}
                                className={`h-10 rounded-lg px-3 flex items-center justify-center gap-2 transition-colors border text-sm font-semibold cursor-pointer ${
                                    isBought === true
                                        ? 'bg-transparent border-emerald-500 text-emerald-400'
                                        : isBought === false
                                            ? 'bg-transparent border-amber-500 text-amber-300'
                                            : 'bg-transparent border-gray-300 text-gray-100'
                                }`}
                                title="Filtro comprado: Sí, No o Indiferente"
                                aria-pressed={isBought !== null}
                            >
                                <i className={`pi ${isBought === true ? "pi-shopping-cart" : isBought === false ? "pi-times" : "pi-minus"} text-lg`}></i>
                                <span>{isBought === true ? "Comprado sí" : isBought === false ? "Comprado no" : "Comprado indif."}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsMultiplayer((current) => cycleTriState(current))}
                                className={`h-10 rounded-lg px-3 flex items-center justify-center gap-2 transition-colors border text-sm font-semibold cursor-pointer ${
                                    isMultiplayer === true
                                        ? 'bg-transparent border-fuchsia-500 text-fuchsia-300'
                                        : isMultiplayer === false
                                            ? 'bg-transparent border-amber-500 text-amber-300'
                                            : 'bg-transparent border-gray-300 text-gray-100'
                                }`}
                                title="Filtro multijugador: Sí, No o Indiferente"
                                aria-pressed={isMultiplayer !== null}
                            >
                                <i className={`pi ${isMultiplayer === true ? "pi-users" : isMultiplayer === false ? "pi-user" : "pi-minus"} text-lg`}></i>
                                <span>{isMultiplayer === true ? "Multi sí" : isMultiplayer === false ? "Multi no" : "Multi indif."}</span>
                            </button>
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
                                        {(() => {
                                            const selectedPlatform = platformByGameId[game.id] ?? GamePlatform.None;
                                            const isPlatformLoading = Boolean(platformLoadingByGameId[game.id]);

                                            return (
                                        <GameCard
                                            game={game}
                                            openMenuId={openMenuId}
                                            toggleMenu={toggleMenu}
                                            isPriority={Boolean(priorityByGameId[game.id])}
                                            initialIsPlayed={Boolean(isPlayedByGameId[game.id])}
                                            initialIsWishlist={Boolean(isWishlistByGameId[game.id])}
                                            onStatusChange={handleGameStatusChange}
                                            onLongPress={handlePriorityLongPress}
                                            className="w-full max-w-70 lg:w-125 lg:max-w-125"
                                            mediaClassName={mobileGridMode === "double" ? "h-[110px] md:h-[250px]" : "h-[176px] md:h-[250px]"}
                                            hoverTitleMeta={(
                                                <div
                                                    className="inline-flex rounded-full border border-white/15 bg-black/40 p-1 backdrop-blur-sm"
                                                    onMouseDown={(event) => event.stopPropagation()}
                                                    onClick={(event) => event.stopPropagation()}
                                                >
                                                    <Dropdown
                                                        value={selectedPlatform}
                                                        options={gamePlatformOptions}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                        disabled={isPlatformLoading}
                                                        onChange={(event: DropdownChangeEvent) => {
                                                            event.originalEvent?.stopPropagation();
                                                            void handlePlatformChange(game.id, normalizeGamePlatform(event.value));
                                                        }}
                                                        valueTemplate={(value) => (
                                                            <PlatformOptionContent
                                                                platform={normalizeGamePlatform(value)}
                                                                showLabel={false}
                                                            />
                                                        )}
                                                        itemTemplate={(option) => (
                                                            <PlatformOptionContent
                                                                platform={normalizeGamePlatform(option?.value)}
                                                            />
                                                        )}
                                                        className="mygames-platform-select mygames-platform-select--desktop"
                                                        panelClassName="mygames-platform-panel"
                                                        aria-label={`Seleccionar plataforma para ${game.name}`}
                                                    />
                                                </div>
                                            )}
                                            mobileExtraActions={(
                                                <>
                                                    <div className="px-3 pt-3 pb-2" onMouseDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()}>
                                                        <Dropdown
                                                            value={selectedPlatform}
                                                            options={gamePlatformOptions}
                                                            optionLabel="label"
                                                            optionValue="value"
                                                            disabled={isPlatformLoading}
                                                            onChange={(event: DropdownChangeEvent) => {
                                                                event.originalEvent?.stopPropagation();
                                                                void handlePlatformChange(game.id, normalizeGamePlatform(event.value));
                                                            }}
                                                            valueTemplate={(value) => (
                                                                <PlatformOptionContent platform={normalizeGamePlatform(value)} />
                                                            )}
                                                            itemTemplate={(option) => (
                                                                <PlatformOptionContent platform={normalizeGamePlatform(option?.value)} />
                                                            )}
                                                            className="mygames-platform-select mygames-platform-select--mobile"
                                                            panelClassName="mygames-platform-panel"
                                                            aria-label={`Seleccionar plataforma para ${game.name}`}
                                                        />
                                                    </div>
                                                    <div className="h-px bg-gray-700 mx-2"></div>
                                                    <button
                                                        className={`flex items-center gap-3 px-4 py-3 text-sm text-left transition-all hover:translate-x-px cursor-pointer ${
                                                            multiplayerLoadingByGameId[game.id]
                                                                ? 'opacity-60 cursor-not-allowed text-gray-300'
                                                                : isMultiplayerByGameId[game.id]
                                                                    ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-500'
                                                                    : 'text-gray-200 hover:bg-white/10'
                                                        }`}
                                                        disabled={Boolean(multiplayerLoadingByGameId[game.id])}
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            void handleToggleMultiplayer(game.id);
                                                        }}
                                                    >
                                                        <i className={`pi ${multiplayerLoadingByGameId[game.id] ? 'pi-spin pi-spinner' : isMultiplayerByGameId[game.id] ? 'pi-users' : 'pi-user'} text-xs ${isMultiplayerByGameId[game.id] ? 'text-white' : 'text-fuchsia-400'}`}></i>
                                                        {isMultiplayerByGameId[game.id] ? 'Multiplayer' : 'Singleplayer'}
                                                    </button>
                                                    <div className="h-px bg-gray-700 mx-2"></div>
                                                    <button
                                                        className={`flex items-center gap-3 px-4 py-3 text-sm text-left transition-all hover:translate-x-px cursor-pointer ${
                                                            buyLoadingByGameId[game.id]
                                                                ? 'opacity-60 cursor-not-allowed text-gray-300'
                                                                : isBoughtByGameId[game.id]
                                                                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                                                    : 'text-gray-200 hover:bg-white/10'
                                                        }`}
                                                        disabled={Boolean(buyLoadingByGameId[game.id])}
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            void handleToggleBought(game.id);
                                                        }}
                                                    >
                                                        <i className={`pi ${buyLoadingByGameId[game.id] ? 'pi-spin pi-spinner' : 'pi-shopping-cart'} text-xs ${isBoughtByGameId[game.id] ? 'text-white' : 'text-emerald-400'}`}></i>
                                                        {isBoughtByGameId[game.id] ? 'Comprado' : 'Comprar'}
                                                    </button>
                                                </>
                                            )}
                                        />
                                            );
                                        })()}
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                void handleToggleBought(game.id);
                                            }}
                                            disabled={Boolean(buyLoadingByGameId[game.id])}
                                            className={`hidden md:flex absolute bottom-2 right-2 z-30 rounded-md border bg-black/75 h-7 min-w-23 px-2 py-1 text-[11px] font-semibold shadow-sm items-center justify-center gap-1 transition-colors cursor-pointer md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:transition-all md:duration-300 ${
                                                buyLoadingByGameId[game.id]
                                                    ? 'border-gray-500/60 text-gray-300 cursor-not-allowed'
                                                    : isBoughtByGameId[game.id]
                                                        ? 'border-emerald-400/60 text-emerald-300 hover:border-emerald-300 hover:text-emerald-200'
                                                        : 'border-[#ff4200]/70 text-[#ff9b75] hover:border-[#ff4200] hover:text-[#ffb290]'
                                            }`}
                                            title={isBoughtByGameId[game.id] ? "Quitar de comprados" : "Marcar como comprado"}
                                        >
                                            <i className={`pi ${buyLoadingByGameId[game.id] ? 'pi-spin pi-spinner' : 'pi-shopping-cart'} text-[10px]`}></i>
                                            {isBoughtByGameId[game.id] ? 'Comprado' : 'Comprar'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                void handleToggleMultiplayer(game.id);
                                            }}
                                            disabled={Boolean(multiplayerLoadingByGameId[game.id])}
                                            className={`hidden md:flex absolute right-0 top-1/2 z-30 -translate-y-1/2 rounded-md border bg-black/75 h-7 min-w-23 px-2 py-1 text-[11px] font-semibold shadow-sm items-center justify-center gap-1 transition-colors cursor-pointer md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:transition-all md:duration-300 ${
                                                multiplayerLoadingByGameId[game.id]
                                                    ? 'border-gray-500/60 text-gray-300 cursor-not-allowed'
                                                    : isMultiplayerByGameId[game.id]
                                                        ? 'border-fuchsia-400/70 text-fuchsia-300 hover:border-fuchsia-300 hover:text-fuchsia-200'
                                                        : 'border-amber-400/70 text-amber-300 hover:border-amber-300 hover:text-amber-200'
                                            }`}
                                            title={
                                                isMultiplayerByGameId[game.id]
                                                    ? "Cambiar a un jugador"
                                                    : "Cambiar a multijugador"
                                            }
                                        >
                                            <i className={`pi ${multiplayerLoadingByGameId[game.id] ? 'pi-spin pi-spinner' : isMultiplayerByGameId[game.id] ? 'pi-users' : 'pi-user'} text-[11px]`}></i>
                                            <span className="whitespace-nowrap">
                                                {isMultiplayerByGameId[game.id] ? 'Mltiplayer' : 'Singeplayer'}
                                            </span>
                                        </button>
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
