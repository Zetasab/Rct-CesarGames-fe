import { BaseService } from './BaseService';
import { infoService } from './InfoService';

import { Game } from '../models/Game';

let apiKey = '';

export interface RawgPaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface SearchGamesParams {
    search?: string;
    searchPrecise?: boolean;
    searchExact?: boolean;
    genres?: string;
    platforms?: string;
    tags?: string;
    ordering?: string;
    metacritic?: string;
    dates?: string;
    page?: number;
    pageSize?: number;
}

class GameService extends BaseService {
    constructor() {
        super('/games', 'https://api.rawg.io/api'); 
    }

    setApiKey(key: string): void {
        const normalizedKey = this.normalizeApiKey(key);
        apiKey = normalizedKey;
        if (typeof window !== 'undefined') {
            if (normalizedKey) {
                localStorage.setItem('gameApiKey', normalizedKey);
            } else {
                localStorage.removeItem('gameApiKey');
            }
            sessionStorage.removeItem('gameApiKey');
        }
    }

    private normalizeApiKey(key: unknown): string {
        if (typeof key === 'string') {
            const trimmed = key.trim();

            if (!trimmed || trimmed === '[object Object]') {
                return '';
            }

            if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
                return trimmed.slice(1, -1).trim();
            }

            return trimmed;
        }

        if (key && typeof key === 'object') {
            const candidate = (key as Record<string, unknown>).apiKey
                ?? (key as Record<string, unknown>).key
                ?? (key as Record<string, unknown>).value
                ?? (key as Record<string, unknown>).token;

            if (typeof candidate === 'string') {
                return this.normalizeApiKey(candidate);
            }
        }

        return '';
    }

    private async resolveApiKey(): Promise<string> {
        if (apiKey) {
            return apiKey;
        }

        if (typeof window !== 'undefined') {
            const storedKey = this.normalizeApiKey(localStorage.getItem('gameApiKey') || sessionStorage.getItem('gameApiKey') || '');
            if (storedKey) {
                apiKey = storedKey;
                if (sessionStorage.getItem('gameApiKey')) {
                    sessionStorage.removeItem('gameApiKey');
                }
                localStorage.setItem('gameApiKey', storedKey);
                return storedKey;
            }

            try {
                const fetchedKey = this.normalizeApiKey(await infoService.getGameApi());
                if (fetchedKey) {
                    this.setApiKey(fetchedKey);
                    return fetchedKey;
                }
            } catch {
                return '';
            }
        }

        return '';
    }

    async getGames(): Promise<{ results: Game[] }> {
        const key = await this.resolveApiKey();
        return this.get<{ results: Game[] }>(`?key=${key}`);
    }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    async getTopRatedGames(pageSize: number = 20): Promise<{ results: Game[] }> {
        const key = await this.resolveApiKey();
        return this.get<{ results: Game[] }>(`?ordering=-rating&page_size=${pageSize}&key=${key}`);
    }

    async getRecentlyReleasedGames(pageSize: number = 20): Promise<{ results: Game[] }> {
        const key = await this.resolveApiKey();
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        const dates = `${this.formatDate(sixMonthsAgo)},${this.formatDate(today)}`;
        return this.get<{ results: Game[] }>(`?dates=${dates}&ordering=-released&page_size=${pageSize}&key=${key}`);
    }

    async getUpcomingGames(pageSize: number = 20): Promise<{ results: Game[] }> {
        const key = await this.resolveApiKey();
        const today = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(today.getMonth() + 6);

        const dates = `${this.formatDate(today)},${this.formatDate(sixMonthsFromNow)}`;
        return this.get<{ results: Game[] }>(`?dates=${dates}&ordering=released&page_size=${pageSize}&key=${key}`);
    }

    async getMostAnticipatedUpcomingGames(pageSize: number = 20): Promise<{ results: Game[] }> {
        const key = await this.resolveApiKey();
        const today = new Date();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(today.getFullYear() + 1);

        const dates = `${this.formatDate(today)},${this.formatDate(oneYearFromNow)}`;
        return this.get<{ results: Game[] }>(`?dates=${dates}&ordering=-added&page_size=${pageSize}&key=${key}`);
    }

    async getGamesByGenre(genre: string, pageSize: number = 20): Promise<{ results: Game[] }> {
        const key = await this.resolveApiKey();
        return this.get<{ results: Game[] }>(`?genres=${encodeURIComponent(genre)}&ordering=-added&page_size=${pageSize}&key=${key}`);
    }

    async getTrendingGames(pageSize: number = 20): Promise<{ results: Game[] }> {
        const key = await this.resolveApiKey();
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const dates = `${this.formatDate(oneYearAgo)},${this.formatDate(today)}`;

        return this.get<{ results: Game[] }>(`?dates=${dates}&ordering=-added&page_size=${pageSize}&key=${key}`);
    }

    async searchGames(params: SearchGamesParams = {}): Promise<RawgPaginatedResponse<Game>> {
        const key = await this.resolveApiKey();
        const query = new URLSearchParams();

        query.set('key', key);
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

        if (params.tags?.trim()) {
            query.set('tags', params.tags.trim());
        }

        if (params.ordering?.trim()) {
            query.set('ordering', params.ordering.trim());
        }

        if (params.metacritic?.trim()) {
            query.set('metacritic', params.metacritic.trim());
        }

        if (params.dates?.trim()) {
            query.set('dates', params.dates.trim());
        }

        if (typeof window !== 'undefined') {
            console.log('[GameService.searchGames] RAWG query:', `https://api.rawg.io/api/games?${query.toString()}`);
        }

        return this.get<RawgPaginatedResponse<Game>>(`?${query.toString()}`);
    }

    async getGameById(id: string | number): Promise<Game> {
        const key = await this.resolveApiKey();
        return this.get<Game>(`/${id}?key=${key}`);
    }

    async getGameMovies(id: string | number): Promise<{ results: import('../models/Game').Movie[] }> {
        const key = await this.resolveApiKey();
        return this.get<{ results: import('../models/Game').Movie[] }>(`/${id}/movies?key=${key}`);
    }

    async getGameScreenshots(id: string | number): Promise<{ results: import('../models/Game').Screenshot[] }> {
        const key = await this.resolveApiKey();
        return this.get<{ results: import('../models/Game').Screenshot[] }>(`/${id}/screenshots?key=${key}`);
    }

    async getGameSeries(id: string | number): Promise<{ results: Game[] }> {
        const key = await this.resolveApiKey();
        return this.get<{ results: Game[] }>(`/${id}/game-series?key=${key}`);
    }

    async getGameSuggested(id: string | number): Promise<{ results: Game[] }> {
        const key = await this.resolveApiKey();
        return this.get<{ results: Game[] }>(`/${id}/suggested?key=${key}`);
    }
}

export const gameService = new GameService();
