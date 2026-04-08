import { BaseService } from './BaseService';
import { GamePlatform, GameResultModel, normalizeGamePlatform } from '@/models/GameResultModel';
import { extractMessageFromApiBody, isDailyLimitErrorMessage } from './api-error';
import { getBaseUrl } from './config';
import { RawgPaginatedResponse, SearchGamesParams } from './GameService';

export interface GameResultFilterResponse {
    results: GameResultModel[];
    count?: number;
}

export type UserCollectionSearchResponse = RawgPaginatedResponse<GameResultModel> | {
    items?: GameResultModel[];
    results?: GameResultModel[];
    totalCount?: number;
    count?: number;
    page?: number;
    pageSize?: number;
};

class GameResultService extends BaseService {
    constructor() {
        super('gms/games');
    }

    protected async handleResponse<T>(response: Response): Promise<T> {
        if (response.status === 401) {
            const responseText = await response.clone().text();
            const responseMessage = extractMessageFromApiBody(responseText) || '';
            const isDailyLimit401 = isDailyLimitErrorMessage(responseMessage);

            if (typeof window !== 'undefined') {
                if (!isDailyLimit401) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                    sessionStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }
        }
        return super.handleResponse<T>(response);
    }

    async getAll(): Promise<GameResultModel[]> {
        return this.get<GameResultModel[]>('/getAll');
    }

    async getById(id: string): Promise<GameResultModel> {
        return this.get<GameResultModel>(`/getById/${encodeURIComponent(id)}`);
    }

    async getPlayedGamesIdsList(): Promise<string[]> {
        const response = await fetch(`${getBaseUrl()}/api/games/PlayedGames/ids`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        const result = await this.handleResponse<unknown>(response);
        return Array.isArray(result)
            ? result
                .map((item) => String(item ?? '').trim())
                .filter((item) => item.length > 0)
            : [];
    }

    async getWishlistGamesIdsList(): Promise<string[]> {
        const parseIds = (result: unknown): string[] => {
            return Array.isArray(result)
                ? result
                    .map((item) => String(item ?? '').trim())
                    .filter((item) => item.length > 0)
                : [];
        };

        const executeRequest = async (collectionPath: string): Promise<string[]> => {
            const response = await fetch(`${getBaseUrl()}/api/games/${collectionPath}/ids`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const result = await this.handleResponse<unknown>(response);
            return parseIds(result);
        };

        try {
            return await executeRequest('WishlistGames');
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 404) {
                return executeRequest('WhistlistGames');
            }
            throw error;
        }
    }

    async search(q?: string, skip: number = 0, take: number = 50): Promise<GameResultModel[]> {
        const query = new URLSearchParams();
        if (q && q.trim()) {
            query.set('q', q.trim());
        }
        query.set('skip', String(skip));
        query.set('take', String(take));

        return this.get<GameResultModel[]>(`/search?${query.toString()}`);
    }

    async searchUserCollection(
        collection: 'PlayedGames' | 'WishlistGames',
        params: SearchGamesParams = {}
    ): Promise<UserCollectionSearchResponse> {
        const query = new URLSearchParams();

        query.set('page_size', String(params.pageSize ?? 20));
        query.set('page', String(params.page ?? 1));

        if (params.search?.trim()) {
            query.set('search', params.search.trim());
        }

        if (typeof params.searchPrecise === 'boolean') {
            query.set('search_precise', String(params.searchPrecise));
        }

        if (typeof params.searchExact === 'boolean') {
            query.set('search_exact', String(params.searchExact));
        }

        if (params.genres?.trim()) {
            query.set('genres', params.genres.trim());
        }

        if (params.platforms?.trim()) {
            query.set('platforms', params.platforms.trim());
        }

        if (params.stores?.trim()) {
            query.set('stores', params.stores.trim());
        }

        if (params.ordering?.trim()) {
            query.set('ordering', params.ordering.trim());
        }

        if (params.dates?.trim()) {
            query.set('dates', params.dates.trim());
        }

        const executeRequest = async (collectionPath: string): Promise<UserCollectionSearchResponse> => {
            const response = await fetch(`${getBaseUrl()}/api/games/${collectionPath}/search?${query.toString()}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            return this.handleResponse<UserCollectionSearchResponse>(response);
        };

        try {
            return await executeRequest(collection);
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (collection === 'WishlistGames' && status === 404) {
                return executeRequest('WhistlistGames');
            }
            throw error;
        }
    }

    async filter(
        name?: string,
        isPlayed?: boolean,
        isWishlist?: boolean,
        isMultiplayer?: boolean,
        isBought?: boolean,
        platforms?: GamePlatform[],
        skip: number = 0,
        take: number = 50
    ): Promise<GameResultModel[] | GameResultFilterResponse> {
        const query = new URLSearchParams();

        if (name && name.trim()) {
            query.set('name', name.trim());
        }

        if (typeof isPlayed === 'boolean') {
            query.set('isPlayed', String(isPlayed));
        }

        if (typeof isWishlist === 'boolean') {
            query.set('isWishlist', String(isWishlist));
        }

        if (typeof isMultiplayer === 'boolean') {
            query.set('isMultiplayer', String(isMultiplayer));
        }

        if (typeof isBought === 'boolean') {
            query.set('isBought', String(isBought));
        }

        if (Array.isArray(platforms) && platforms.length > 0) {
            const normalizedPlatforms = Array.from(new Set(platforms.map((platform) => normalizeGamePlatform(platform))));
            normalizedPlatforms.forEach((platform) => {
                query.append('platforms', String(platform));
            });
        }

        query.set('skip', String(skip));
        query.set('take', String(take));

        return this.get<GameResultModel[] | GameResultFilterResponse>(`/filter?${query.toString()}`);
    }

    async update(id: string, model: GameResultModel): Promise<string> {
        return this.put<string>(`/update?id=${encodeURIComponent(id)}`, model);
    }

    async setGameAsPlayed(gameMongoId: string | number): Promise<boolean> {
        return this.addSavedGame('PlayedGames', gameMongoId);
    }

    async setGameAsNotPlayed(gameMongoId: string | number): Promise<string> {
        return this.deleteSavedGame('PlayedGames', gameMongoId);
    }

    async setGameAsWishlist(gameMongoId: string | number): Promise<boolean> {
        try {
            return await this.addSavedGame('WishlistGames', gameMongoId);
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 404) {
                return this.addSavedGame('WhistlistGames', gameMongoId);
            }
            throw error;
        }
    }

    async setGameAsNotWishlist(gameMongoId: string | number): Promise<string> {
        try {
            return await this.deleteSavedGame('WishlistGames', gameMongoId);
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 404) {
                return this.deleteSavedGame('WhistlistGames', gameMongoId);
            }
            throw error;
        }
    }

    private async addSavedGame(collection: 'PlayedGames' | 'WishlistGames' | 'WhistlistGames', gameMongoId: string | number): Promise<boolean> {
        const response = await fetch(`${getBaseUrl()}/api/games/${collection}/${encodeURIComponent(String(gameMongoId))}`, {
            method: 'POST',
            headers: this.getHeaders(),
        });

        await this.handleResponse<unknown>(response);
        return true;
    }

    private async deleteSavedGame(collection: 'PlayedGames' | 'WishlistGames' | 'WhistlistGames', id: number | string): Promise<string> {
        const response = await fetch(`${getBaseUrl()}/api/games/${collection}/${encodeURIComponent(String(id))}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });

        await this.handleResponse<unknown>(response);
        return 'ok';
    }

    async setPriority(gameId: number | string): Promise<string> {
        return this.put<string>(`/setPriority/${gameId}`, {});
    }

    async unsetPriority(gameId: number | string): Promise<string> {
        return this.put<string>(`/unsetPriority/${gameId}`, {});
    }

    async setBought(gameId: number | string): Promise<string> {
        return this.put<string>(`/setBought/${gameId}`, {});
    }

    async setNotBought(gameId: number | string): Promise<string> {
        return this.put<string>(`/setNotBought/${gameId}`, {});
    }

    async setMultiplayer(gameId: number | string): Promise<string> {
        return this.put<string>(`/setMultiplayer/${gameId}`, {});
    }

    async setSingleplayer(gameId: number | string): Promise<string> {
        return this.put<string>(`/setSingleplayer/${gameId}`, {});
    }

    async changePlatform(gameId: number | string, platform: GamePlatform): Promise<string> {
        const query = new URLSearchParams({ platform: String(platform) });
        return this.put<string>(`/changePlatform/${gameId}?${query.toString()}`, {});
    }

    async deleteGame(id: string): Promise<boolean> {
        return this.delete<boolean>(`/${encodeURIComponent(id)}`);
    }
}

export const gameResultService = new GameResultService();
