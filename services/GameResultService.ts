import { BaseService } from './BaseService';
import { GamePlatform, GameResultModel, normalizeGamePlatform } from '@/models/GameResultModel';
import { extractMessageFromApiBody, isDailyLimitErrorMessage } from './api-error';

export interface GameResultFilterResponse {
    results: GameResultModel[];
    count?: number;
}

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

    async search(q?: string, skip: number = 0, take: number = 50): Promise<GameResultModel[]> {
        const query = new URLSearchParams();
        if (q && q.trim()) {
            query.set('q', q.trim());
        }
        query.set('skip', String(skip));
        query.set('take', String(take));

        return this.get<GameResultModel[]>(`/search?${query.toString()}`);
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

    async setGameAsPlayed(model: GameResultModel): Promise<boolean> {
        return this.put<boolean>('/setGameAsPlayed', model);
    }

    async setGameAsNotPlayed(gameId: number | string): Promise<string> {
        return this.put<string>(`/setGameAsNotPlayed/${gameId}`, {});
    }

    async setGameAsWishlist(model: GameResultModel): Promise<boolean> {
        return this.put<boolean>('/setGameAsWishlist', model);
    }

    async setGameAsNotWishlist(gameId: number | string): Promise<string> {
        return this.put<string>(`/setGameAsNotWishlist/${gameId}`, {});
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
