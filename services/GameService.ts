import { BaseService } from './BaseService';
import { getBaseUrl } from './config';

import { Game } from '../models/Game';

export interface RawgPaginatedResponse<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export interface SearchGamesParams {
    search?: string;
    searchPrecise?: boolean;
    searchExact?: boolean;
    genres?: string;
    platforms?: string;
    stores?: string;
    ordering?: string;
    dates?: string;
    page?: number;
    pageSize?: number;
}

export interface GenrePreviewGame {
    id: number;
    slug: string;
    name: string;
    added: number;
}

export interface GenreListItem {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
    games: GenrePreviewGame[];
}

export interface StoreListItem {
    id: number;
    name: string;
    domain: string;
    slug: string;
    games_count: number;
    image_background: string;
    games: GenrePreviewGame[];
}

export interface PlatformListItem {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
    image: string | null;
    year_start: number | null;
    year_end: number | null;
    games: GenrePreviewGame[];
}

class GameService extends BaseService {
    constructor() {
        super('api/games');
    }

    async getGames(): Promise<{ results: Game[] }> {
        return this.get<{ results: Game[] }>('');
    }

    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    async getTopRatedGames(pageSize: number = 20): Promise<{ results: Game[] }> {
        return this.get<{ results: Game[] }>(`?ordering=-rating&page_size=${pageSize}`);
    }

    async getRecentlyReleasedGames(pageSize: number = 20): Promise<{ results: Game[] }> {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);

        const dates = `${this.formatDate(sixMonthsAgo)},${this.formatDate(today)}`;
        return this.get<{ results: Game[] }>(`?dates=${dates}&ordering=-released&page_size=${pageSize}`);
    }

    async getUpcomingGames(pageSize: number = 20): Promise<{ results: Game[] }> {
        const today = new Date();
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(today.getMonth() + 6);

        const dates = `${this.formatDate(today)},${this.formatDate(sixMonthsFromNow)}`;
        return this.get<{ results: Game[] }>(`?dates=${dates}&ordering=released&page_size=${pageSize}`);
    }

    async getMostAnticipatedUpcomingGames(pageSize: number = 20): Promise<{ results: Game[] }> {
        const today = new Date();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(today.getFullYear() + 1);

        const dates = `${this.formatDate(today)},${this.formatDate(oneYearFromNow)}`;
        return this.get<{ results: Game[] }>(`?dates=${dates}&ordering=-added&page_size=${pageSize}`);
    }

    async getGamesByGenre(genre: string, pageSize: number = 20): Promise<{ results: Game[] }> {
        return this.get<{ results: Game[] }>(`?genres=${encodeURIComponent(genre)}&ordering=-added&page_size=${pageSize}`);
    }

    async getGenres(): Promise<GenreListItem[]> {
        return this.get<GenreListItem[]>('/genres');
    }

    async getStores(): Promise<StoreListItem[]> {
        return this.get<StoreListItem[]>('/stores');
    }

    async getPlatforms(): Promise<PlatformListItem[]> {
        return this.get<PlatformListItem[]>('/platforms');
    }

    async getTrendingGames(pageSize: number = 20): Promise<{ results: Game[] }> {
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const dates = `${this.formatDate(oneYearAgo)},${this.formatDate(today)}`;

        return this.get<{ results: Game[] }>(`?dates=${dates}&ordering=-added&page_size=${pageSize}`);
    }

    async searchGames(params: SearchGamesParams = {}): Promise<RawgPaginatedResponse<Game>> {
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

        if (typeof window !== 'undefined') {
            console.log('[GameService.searchGames] API query:', `${getBaseUrl()}api/games/search?${query.toString()}`);
        }

        return this.get<RawgPaginatedResponse<Game>>(`/search?${query.toString()}`);
    }

    async getGameById(id: string | number): Promise<Game> {
        return this.get<Game>(`/${id}`);
    }

    async getGameBySlug(slug: string): Promise<Game> {
        return this.get<Game>(`/slug/${encodeURIComponent(slug)}`);
    }

    async getGameMovies(id: string | number): Promise<{ results: import('../models/Game').Movie[] }> {
        return this.get<{ results: import('../models/Game').Movie[] }>(`/${id}/movies`);
    }

    async getGameScreenshots(id: string | number): Promise<{ results: import('../models/Game').Screenshot[] }> {
        return this.get<{ results: import('../models/Game').Screenshot[] }>(`/${id}/screenshots`);
    }

    async getGameSeries(id: string | number): Promise<{ results: Game[] }> {
        return this.get<{ results: Game[] }>(`/${id}/game-series`);
    }

    async getGameSuggested(id: string | number): Promise<{ results: Game[] }> {
        return this.get<{ results: Game[] }>(`/${id}/suggested`);
    }
}

export const gameService = new GameService();
