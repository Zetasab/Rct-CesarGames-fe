export enum GamePlatform {
        None = 0,
        Steam = 1,
        EpicGames = 2,
        GOG = 3,
        EA = 4,
        Ubisoft = 5,
        Battlenet = 6,
        Rockstar = 7,
        Microsoft = 8,
        RiotGames = 9,
}

export interface GamePlatformOption {
        value: GamePlatform;
        label: string;
        iconUrl?: string;
}

export const gamePlatformOptions: GamePlatformOption[] = [
        { value: GamePlatform.None, label: 'Sin plataforma' },
        { value: GamePlatform.Steam, label: 'Steam', iconUrl: 'https://cdn.simpleicons.org/steam/ffffff' },
        { value: GamePlatform.EpicGames, label: 'Epic Games', iconUrl: 'https://cdn.simpleicons.org/epicgames/ffffff' },
        { value: GamePlatform.GOG, label: 'GOG', iconUrl: 'https://cdn.simpleicons.org/gogdotcom/ffffff' },
        { value: GamePlatform.EA, label: 'EA', iconUrl: 'https://cdn.simpleicons.org/ea/ffffff' },
        { value: GamePlatform.Ubisoft, label: 'Ubisoft', iconUrl: 'https://cdn.simpleicons.org/ubisoft/ffffff' },
        { value: GamePlatform.Battlenet, label: 'Battle.net', iconUrl: 'https://cdn.simpleicons.org/blizzard/ffffff' },
        { value: GamePlatform.Rockstar, label: 'Rockstar', iconUrl: 'https://cdn.simpleicons.org/rockstargames/ffffff' },
        { value: GamePlatform.Microsoft, label: 'Microsoft', iconUrl: 'https://cdn.simpleicons.org/xbox/ffffff' },
        { value: GamePlatform.RiotGames, label: 'Riot Games', iconUrl: 'https://cdn.simpleicons.org/riotgames/ffffff' },
];

const gamePlatformAliases: Record<string, GamePlatform> = {
        none: GamePlatform.None,
        steam: GamePlatform.Steam,
        epicgames: GamePlatform.EpicGames,
        gog: GamePlatform.GOG,
        gogcom: GamePlatform.GOG,
        ea: GamePlatform.EA,
        ubisoft: GamePlatform.Ubisoft,
        battlenet: GamePlatform.Battlenet,
        battledotnet: GamePlatform.Battlenet,
        rockstar: GamePlatform.Rockstar,
        rockstargames: GamePlatform.Rockstar,
        microsoft: GamePlatform.Microsoft,
        xbox: GamePlatform.Microsoft,
        riotgames: GamePlatform.RiotGames,
};

export const getGamePlatformOption = (platform: GamePlatform): GamePlatformOption => {
        return gamePlatformOptions.find((option) => option.value === platform) || gamePlatformOptions[0];
};

export const getGamePlatformLabel = (platform: GamePlatform): string => {
        return getGamePlatformOption(platform).label;
};

export const normalizeGamePlatform = (value: unknown): GamePlatform => {
        if (typeof value === 'number' && Number.isInteger(value) && value >= GamePlatform.None && value <= GamePlatform.RiotGames) {
                return value as GamePlatform;
        }

        if (value && typeof value === 'object') {
                const record = value as Record<string, unknown>;
                const nestedValue = record.value ?? record.platform ?? record.gamePlaform ?? record.gamePlatform;
                if (nestedValue !== undefined) {
                        return normalizeGamePlatform(nestedValue);
                }
                const nestedLabel = record.label ?? record.name;
                if (typeof nestedLabel === 'string') {
                        return normalizeGamePlatform(nestedLabel);
                }
        }

        if (typeof value === 'string') {
                const trimmed = value.trim();
                if (!trimmed) {
                        return GamePlatform.None;
                }

                const numericValue = Number(trimmed);
                if (Number.isInteger(numericValue) && numericValue >= GamePlatform.None && numericValue <= GamePlatform.RiotGames) {
                        return numericValue as GamePlatform;
                }

                const normalizedKey = trimmed.replace(/[\s._-]/g, '').toLowerCase();
                return gamePlatformAliases[normalizedKey] ?? GamePlatform.None;
        }

        return GamePlatform.None;
};

export interface GameResultModel {
        game_id: number;
        IsPlayed: boolean;
        IsWishlist: boolean;
        IsBought: boolean;
        gamePlaform: GamePlatform;
        IsMultiplayer?: boolean;
        Priority: boolean;
        name?: string;
        released?: string;
        tba: boolean;
        background_image?: string;
        rating: number;
       
}
