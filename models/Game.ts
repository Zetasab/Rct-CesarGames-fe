export interface GameListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Game[];
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    seo_h1: string;
    noindex: boolean;
    nofollow: boolean;
    description: string;
    filters: Filters;
    nofollow_collections: string[];
}

export interface Game {
    id: number;
    slug: string;
    name: string;
    Priority?: boolean;
    description_raw?: string;
    description?: string;
    website?: string;
    released: string;
    tba: boolean;
    background_image: string;
    rating: number;
    rating_top: number;
    ratings: Rating[];
    ratings_count: number;
    reviews_text_count: number;
    added: number;
    added_by_status: AddedByStatus;
    metacritic: number;
    playtime: number;
    suggestions_count: number;
    updated: string;
    user_game: null | string; // Type unclear from JSON, assuming null or string based on usual patterns
    reviews_count: number;
    saturated_color: string;
    dominant_color: string;
    platforms: PlatformRelease[];
    parent_platforms: ParentPlatform[];
    genres: Genre[];
    stores: StoreRelease[];
    clip: null | string; // Type unclear
    tags: Tag[];
    esrb_rating: EsrbRating | null;
    short_screenshots: ShortScreenshot[];
}

export interface Rating {
    id: number;
    title: string;
    count: number;
    percent: number;
}

export interface AddedByStatus {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped: number;
    playing: number;
}

export interface PlatformRelease {
    platform: Platform;
    released_at: string;
    requirements_en: Requirements | null;
    requirements_ru: Requirements | null;
}

export interface Requirements {
    minimum: string;
    recommended?: string;
}

export interface Platform {
    id: number;
    name: string;
    slug: string;
    image: null | string;
    year_end: null | number;
    year_start: null | number;
    games_count: number;
    image_background: string;
}

export interface ParentPlatform {
    platform: {
        id: number;
        name: string;
        slug: string;
    };
}

export interface Genre {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
}

export interface StoreRelease {
    id: number;
    store: Store;
}

export interface Store {
    id: number;
    name: string;
    slug: string;
    domain: string;
    games_count: number;
    image_background: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: number;
    image_background: string;
}

export interface EsrbRating {
    id: number;
    name: string;
    slug: string;
}

export interface ShortScreenshot {
    id: number;
    image: string;
}

export interface Filters {
    years: YearFilter[];
}

export interface YearFilter {
    from: number;
    to: number;
    filter: string;
    decade: number;
    years: YearCount[];
    nofollow: boolean;
    count: number;
}

export interface YearCount {
    year: number;
    count: number;
    nofollow: boolean;
}

export interface Movie {
    id: number;
    name: string;
    preview: string;
    data: {
        480: string;
        max: string;
    };
}

export interface Screenshot {
    id: number;
    image: string;
    width: number;
    height: number;
    is_deleted: boolean;
}
