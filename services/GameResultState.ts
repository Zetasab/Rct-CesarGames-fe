import { GamePlatform, GameResultModel } from '@/models/GameResultModel';
import { gameResultService } from './GameResultService';

const GAME_ID_KEYS = [
    'game_id',
    'Game_Id',
    'gameId',
    'GameId',
    'rawgId',
    'RawgId',
    'externalId',
    'ExternalId',
    'id',
];
const PLAYED_KEYS = ['isPlayed', 'IsPlayed', 'played', 'Played', 'hasPlayed', 'jugado'];
const WISHLIST_KEYS = [
    'isWishlist',
    'IsWishlist',
    'isWhistList',
    'IsWhistList',
    'wishlist',
    'Wishlist',
    'isWhistliked',
    'IsWhistliked',
    'whistliked',
    'Whistliked',
    'inWishlist',
    'previsto',
];

let cachedGameResults: GameResultModel[] | null = null;
let gameResultsRequest: Promise<GameResultModel[]> | null = null;

const toBoolean = (value: unknown): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        return normalized === 'true' || normalized === '1' || normalized === 'yes';
    }

    return false;
};

const getBooleanByKeys = (source: Record<string, unknown>, keys: string[]): boolean => {
    for (const key of keys) {
        if (key in source) {
            return toBoolean(source[key]);
        }
    }
    return false;
};

const getIdByKeys = (source: Record<string, unknown>, keys: string[]): string | null => {
    for (const key of keys) {
        const rawValue = source[key];

        if (rawValue === undefined || rawValue === null) {
            continue;
        }

        const normalized = String(rawValue).trim();
        if (normalized.length > 0) {
            return normalized;
        }
    }

    return null;
};

export const getGameResultFlags = (model: GameResultModel | null | undefined): { isPlayed: boolean; isWishlist: boolean } => {
    if (!model) {
        return { isPlayed: false, isWishlist: false };
    }

    const record = model as unknown as Record<string, unknown>;
    return {
        isPlayed: getBooleanByKeys(record, PLAYED_KEYS),
        isWishlist: getBooleanByKeys(record, WISHLIST_KEYS),
    };
};

export const getGameResultGameId = (model: GameResultModel | null | undefined): string | null => {
    if (!model) {
        return null;
    }

    return getIdByKeys(model as unknown as Record<string, unknown>, GAME_ID_KEYS);
};

export const loadGameResultList = async (forceRefresh: boolean = false): Promise<GameResultModel[]> => {
    if (forceRefresh) {
        cachedGameResults = null;
        gameResultsRequest = null;
    }

    if (cachedGameResults) {
        return cachedGameResults;
    }

    if (!gameResultsRequest) {
        gameResultsRequest = gameResultService
            .getAll()
            .then((results) => {
                cachedGameResults = Array.isArray(results) ? results : [];
                return cachedGameResults;
            })
            .catch((error) => {
                gameResultsRequest = null;
                throw error;
            });
    }

    return gameResultsRequest;
};

export const findGameResultByGameId = (
    list: GameResultModel[],
    gameId: string | number
): GameResultModel | undefined => {
    const target = String(gameId);
    return list.find((item) => getGameResultGameId(item) === target);
};

export const updateCachedGameResultFlags = (
    gameId: string | number,
    flags: { isPlayed?: boolean; isWishlist?: boolean }
) => {
    if (!cachedGameResults) {
        return;
    }

    const target = String(gameId);
    const existing = cachedGameResults.find((item) => getGameResultGameId(item) === target);

    if (existing) {
        const mutable = existing as unknown as Record<string, unknown>;
        if (typeof flags.isPlayed === 'boolean') {
            mutable.isPlayed = flags.isPlayed;
        }
        if (typeof flags.isWishlist === 'boolean') {
            mutable.isWishlist = flags.isWishlist;
        }
        return;
    }

    const parsedGameId = Number(target);
    const normalizedGameId = Number.isFinite(parsedGameId) ? parsedGameId : 0;

    const newModel: GameResultModel = {
        game_id: normalizedGameId,
        IsPlayed: Boolean(flags.isPlayed),
        IsWishlist: Boolean(flags.isWishlist),
        IsBought: false,
        gamePlaform: GamePlatform.None,
        Priority: false,
        tba: false,
        rating: 0,
    };

    if (typeof flags.isPlayed === 'boolean') {
        (newModel as unknown as Record<string, unknown>).isPlayed = flags.isPlayed;
    }
    if (typeof flags.isWishlist === 'boolean') {
        (newModel as unknown as Record<string, unknown>).isWishlist = flags.isWishlist;
    }

    cachedGameResults.push(newModel);
};
