export interface CatalogItem {
    id: number;
    name: string;
    slug: string;
}

export interface StoreCatalogItem extends CatalogItem {
    domain?: string;
}

export interface GenreGamePreview {
    id: number;
    slug: string;
    name: string;
    added: number;
}

export interface GenreCatalogItem extends CatalogItem {
    games_count: number;
    image_background: string;
    games: GenreGamePreview[];
}

export interface PlatformCatalogItem extends CatalogItem {
    games_count: number;
    image_background: string;
    image: string | null;
    year_start: number | null;
    year_end: number | null;
    games: GenreGamePreview[];
}

export const genresCatalog: GenreCatalogItem[] = [
    {
        id: 4,
        name: "Action",
        slug: "action",
        games_count: 191438,
        image_background: "https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 }
        ]
    },
    {
        id: 51,
        name: "Indie",
        slug: "indie",
        games_count: 86241,
        image_background: "https://media.rawg.io/media/games/942/9424d6bb763dc38d9378b488603c87fa.jpg",
        games: [
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 },
            { id: 422, slug: "terraria", name: "Terraria", added: 13489 },
            { id: 3272, slug: "rocket-league", name: "Rocket League", added: 12828 },
            { id: 9767, slug: "hollow-knight", name: "Hollow Knight", added: 11819 },
            { id: 654, slug: "stardew-valley", name: "Stardew Valley", added: 10974 },
            { id: 3612, slug: "hotline-miami", name: "Hotline Miami", added: 10891 }
        ]
    },
    {
        id: 3,
        name: "Adventure",
        slug: "adventure",
        games_count: 151622,
        image_background: "https://media.rawg.io/media/games/1f4/1f47a270b8f241e4676b14d39ec620f7.jpg",
        games: [
            { id: 3439, slug: "life-is-strange-episode-1-2", name: "Life is Strange", added: 15882 },
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 },
            { id: 23027, slug: "the-walking-dead", name: "The Walking Dead: Season 1", added: 11658 },
            { id: 41, slug: "little-nightmares", name: "Little Nightmares", added: 11646 },
            { id: 19487, slug: "alan-wake", name: "Alan Wake", added: 10486 },
            { id: 9721, slug: "garrys-mod", name: "Garry's Mod", added: 10429 }
        ]
    },
    {
        id: 5,
        name: "RPG",
        slug: "role-playing-games-rpg",
        games_count: 61908,
        image_background: "https://media.rawg.io/media/games/b7d/b7d3f1715fa8381a4e780173a197a615.jpg",
        games: [
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 802, slug: "borderlands-2", name: "Borderlands 2", added: 15983 },
            { id: 3070, slug: "fallout-4", name: "Fallout 4", added: 14255 },
            { id: 41494, slug: "cyberpunk-2077", name: "Cyberpunk 2077", added: 13893 },
            { id: 766, slug: "warframe", name: "Warframe", added: 13135 }
        ]
    },
    {
        id: 10,
        name: "Strategy",
        slug: "strategy",
        games_count: 62357,
        image_background: "https://media.rawg.io/media/games/eeb/eeb9e668da5fd07bab9f655acfbbe579.jpg",
        games: [
            { id: 10243, slug: "company-of-heroes-2", name: "Company of Heroes 2", added: 9873 },
            { id: 13633, slug: "civilization-v", name: "Sid Meier's Civilization V", added: 9763 },
            { id: 11147, slug: "ark-survival-of-the-fittest", name: "ARK: Survival Of The Fittest", added: 8919 },
            { id: 10065, slug: "cities-skylines", name: "Cities: Skylines", added: 8643 },
            { id: 13910, slug: "xcom-enemy-unknown", name: "XCOM: Enemy Unknown", added: 8515 },
            { id: 5525, slug: "brutal-legend", name: "Brutal Legend", added: 8417 }
        ]
    },
    {
        id: 2,
        name: "Shooter",
        slug: "shooter",
        games_count: 59618,
        image_background: "https://media.rawg.io/media/games/120/1201a40e4364557b124392ee50317b99.jpg",
        games: [
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 13537, slug: "half-life-2", name: "Half-Life 2", added: 16054 },
            { id: 802, slug: "borderlands-2", name: "Borderlands 2", added: 15983 }
        ]
    },
    {
        id: 40,
        name: "Casual",
        slug: "casual",
        games_count: 67580,
        image_background: "https://media.rawg.io/media/games/388/388935d851846f8ec747fffc7c765800.jpg",
        games: [
            { id: 9721, slug: "garrys-mod", name: "Garry's Mod", added: 10429 },
            { id: 326292, slug: "fall-guys", name: "Fall Guys: Ultimate Knockout", added: 8913 },
            { id: 9830, slug: "brawlhalla", name: "Brawlhalla", added: 8281 },
            { id: 356714, slug: "among-us", name: "Among Us", added: 7928 },
            { id: 42187, slug: "the-sims-4", name: "The Sims 4", added: 6546 },
            { id: 817974, slug: "wallpaper-engine", name: "Wallpaper Engine", added: 6544 }
        ]
    },
    {
        id: 14,
        name: "Simulation",
        slug: "simulation",
        games_count: 76765,
        image_background: "https://media.rawg.io/media/games/e74/e74458058b35e01c1ae3feeb39a3f724.jpg",
        games: [
            { id: 654, slug: "stardew-valley", name: "Stardew Valley", added: 10974 },
            { id: 10035, slug: "hitman", name: "Hitman", added: 10871 },
            { id: 9721, slug: "garrys-mod", name: "Garry's Mod", added: 10429 },
            { id: 9882, slug: "dont-starve-together", name: "Don't Starve Together", added: 9951 },
            { id: 22509, slug: "minecraft", name: "Minecraft", added: 8898 },
            { id: 10065, slug: "cities-skylines", name: "Cities: Skylines", added: 8643 }
        ]
    },
    {
        id: 7,
        name: "Puzzle",
        slug: "puzzle",
        games_count: 97389,
        image_background: "https://media.rawg.io/media/games/cfe/cfe114c081281960bd79ace5209c0a4a.jpg",
        games: [
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 },
            { id: 19709, slug: "half-life-2-episode-two", name: "Half-Life 2: Episode Two", added: 11270 },
            { id: 1450, slug: "inside", name: "INSIDE", added: 8379 },
            { id: 3853, slug: "trine-2-complete-story", name: "Trine 2: Complete Story", added: 7444 }
        ]
    },
    {
        id: 11,
        name: "Arcade",
        slug: "arcade",
        games_count: 22684,
        image_background: "https://media.rawg.io/media/games/cfe/cfe114c081281960bd79ace5209c0a4a.jpg",
        games: [
            { id: 3612, slug: "hotline-miami", name: "Hotline Miami", added: 10891 },
            { id: 17540, slug: "injustice-gods-among-us-ultimate-edition", name: "Injustice: Gods Among Us Ultimate Edition", added: 9859 },
            { id: 22509, slug: "minecraft", name: "Minecraft", added: 8898 },
            { id: 4003, slug: "grid-2", name: "GRID 2", added: 7713 },
            { id: 3408, slug: "hotline-miami-2-wrong-number", name: "Hotline Miami 2: Wrong Number", added: 6437 },
            { id: 58753, slug: "forza-horizon-4", name: "Forza Horizon 4", added: 6315 }
        ]
    },
    {
        id: 83,
        name: "Platformer",
        slug: "platformer",
        games_count: 100921,
        image_background: "https://media.rawg.io/media/games/594/59487800889ebac294c7c2c070d02356.jpg",
        games: [
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 },
            { id: 422, slug: "terraria", name: "Terraria", added: 13489 },
            { id: 9767, slug: "hollow-knight", name: "Hollow Knight", added: 11819 },
            { id: 41, slug: "little-nightmares", name: "Little Nightmares", added: 11646 },
            { id: 3144, slug: "super-meat-boy", name: "Super Meat Boy", added: 9685 },
            { id: 17572, slug: "batman-aa-goty", name: "Batman: Arkham Asylum Game of the Year Edition", added: 8583 }
        ]
    },
    {
        id: 59,
        name: "Massively Multiplayer",
        slug: "massively-multiplayer",
        games_count: 4249,
        image_background: "https://media.rawg.io/media/screenshots/6d3/6d367773c06886535620f2d7fb1cb866.jpg",
        games: [
            { id: 10213, slug: "dota-2", name: "Dota 2", added: 13166 },
            { id: 766, slug: "warframe", name: "Warframe", added: 13135 },
            { id: 10142, slug: "playerunknowns-battlegrounds", name: "PlayerUnknown’s Battlegrounds", added: 10687 },
            { id: 10533, slug: "path-of-exile", name: "Path of Exile", added: 10635 },
            { id: 362, slug: "for-honor", name: "For Honor", added: 9673 },
            { id: 11147, slug: "ark-survival-of-the-fittest", name: "ARK: Survival Of The Fittest", added: 8919 }
        ]
    },
    {
        id: 1,
        name: "Racing",
        slug: "racing",
        games_count: 25765,
        image_background: "https://media.rawg.io/media/games/27b/27b02ffaab6b250cc31bf43baca1fc34.jpg",
        games: [
            { id: 3272, slug: "rocket-league", name: "Rocket League", added: 12828 },
            { id: 4003, slug: "grid-2", name: "GRID 2", added: 7713 },
            { id: 2572, slug: "dirt-rally", name: "DiRT Rally", added: 7002 },
            { id: 58753, slug: "forza-horizon-4", name: "Forza Horizon 4", added: 6315 },
            { id: 5578, slug: "grid", name: "GRID (2008)", added: 5421 },
            { id: 19491, slug: "burnout-paradise-the-ultimate-box", name: "Burnout Paradise: The Ultimate Box", added: 4848 }
        ]
    },
    {
        id: 15,
        name: "Sports",
        slug: "sports",
        games_count: 22619,
        image_background: "https://media.rawg.io/media/games/be5/be51faf9bec778b4ea1b06e9b084792c.jpg",
        games: [
            { id: 3272, slug: "rocket-league", name: "Rocket League", added: 12828 },
            { id: 326292, slug: "fall-guys", name: "Fall Guys: Ultimate Knockout", added: 8913 },
            { id: 2572, slug: "dirt-rally", name: "DiRT Rally", added: 7002 },
            { id: 53341, slug: "jet-set-radio-2012", name: "Jet Set Radio", added: 5308 },
            { id: 9575, slug: "vrchat", name: "VRChat", added: 5123 },
            { id: 36, slug: "tekken-7", name: "TEKKEN 7", added: 4196 }
        ]
    },
    {
        id: 6,
        name: "Fighting",
        slug: "fighting",
        games_count: 11777,
        image_background: "https://media.rawg.io/media/games/35b/35b47c4d85cd6e08f3e2ca43ea5ce7bb.jpg",
        games: [
            { id: 17540, slug: "injustice-gods-among-us-ultimate-edition", name: "Injustice: Gods Among Us Ultimate Edition", added: 9859 },
            { id: 108, slug: "mortal-kombat-x", name: "Mortal Kombat X", added: 9027 },
            { id: 28179, slug: "sega-mega-drive-and-genesis-classics", name: "SEGA Mega Drive and Genesis Classics", added: 8401 },
            { id: 9830, slug: "brawlhalla", name: "Brawlhalla", added: 8281 },
            { id: 274480, slug: "mortal-kombat-11", name: "Mortal Kombat 11", added: 5727 },
            { id: 44525, slug: "yakuza-kiwami", name: "Yakuza Kiwami", added: 4721 }
        ]
    },
    {
        id: 19,
        name: "Family",
        slug: "family",
        games_count: 5416,
        image_background: "https://media.rawg.io/media/games/a87/a8743bdee8627c55bb9f2f01b9136ac1.jpg",
        games: [
            { id: 3254, slug: "journey", name: "Journey", added: 8614 },
            { id: 3729, slug: "lego-the-hobbit", name: "LEGO The Hobbit", added: 5481 },
            { id: 3350, slug: "broken-age", name: "Broken Age", added: 5142 },
            { id: 1259, slug: "machinarium", name: "Machinarium", added: 4768 },
            { id: 1140, slug: "world-of-goo", name: "World of Goo", added: 4608 },
            { id: 4331, slug: "sonic-generations", name: "Sonic Generations", added: 4315 }
        ]
    },
    {
        id: 28,
        name: "Board Games",
        slug: "board-games",
        games_count: 8394,
        image_background: "https://media.rawg.io/media/screenshots/2d9/2d9f74addd8f5b5f83459c2cb700aaf4.jpg",
        games: [
            { id: 23557, slug: "gwent-the-witcher-card-game", name: "Gwent: The Witcher Card Game", added: 5067 },
            { id: 327999, slug: "dota-underlords", name: "Dota Underlords", added: 4253 },
            { id: 2055, slug: "adventure-capitalist", name: "AdVenture Capitalist", added: 3576 },
            { id: 758, slug: "hue", name: "Hue", added: 2811 },
            { id: 3187, slug: "armello", name: "Armello", added: 2124 },
            { id: 2306, slug: "poker-night-2", name: "Poker Night 2", added: 2113 }
        ]
    },
    {
        id: 17,
        name: "Card",
        slug: "card",
        games_count: 4545,
        image_background: "https://media.rawg.io/media/games/742/7424c1f7d0a8da9ae29cd866f985698b.jpg",
        games: [
            { id: 28121, slug: "slay-the-spire", name: "Slay the Spire", added: 5250 },
            { id: 23557, slug: "gwent-the-witcher-card-game", name: "Gwent: The Witcher Card Game", added: 5067 },
            { id: 18852, slug: "poker-night-at-the-inventory", name: "Poker Night at the Inventory", added: 2812 },
            { id: 332, slug: "the-elder-scrolls-legends", name: "The Elder Scrolls: Legends", added: 2279 },
            { id: 8923, slug: "faeria", name: "Faeria", added: 2228 },
            { id: 2306, slug: "poker-night-2", name: "Poker Night 2", added: 2113 }
        ]
    },
    {
        id: 34,
        name: "Educational",
        slug: "educational",
        games_count: 15719,
        image_background: "https://media.rawg.io/media/games/60a/60a0b8f88184f25621b498c2ee1ebb05.jpg",
        games: [
            { id: 1358, slug: "papers-please", name: "Papers, Please", added: 7244 },
            { id: 1140, slug: "world-of-goo", name: "World of Goo", added: 4608 },
            { id: 2778, slug: "surgeon-simulator-cpr", name: "Surgeon Simulator", added: 4087 },
            { id: 9768, slug: "gameguru", name: "GameGuru", added: 2673 },
            { id: 13777, slug: "sid-meiers-civilization-iv-colonization", name: "Sid Meier's Civilization IV: Colonization", added: 2426 },
            { id: 6885, slug: "pirates-3", name: "Sid Meier's Pirates!", added: 2366 }
        ]
    }
];

export const platformsCatalog: PlatformCatalogItem[] = [
    {
        id: 4,
        name: "PC",
        slug: "pc",
        games_count: 560336,
        image_background: "https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 }
        ]
    },
    {
        id: 187,
        name: "PlayStation 5",
        slug: "playstation5",
        games_count: 1435,
        image_background: "https://media.rawg.io/media/games/709/709bf81f874ce5d25d625b37b014cb63.jpg",
        image: null,
        year_start: 2020,
        year_end: null,
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 32, slug: "destiny-2", name: "Destiny 2", added: 14572 },
            { id: 3070, slug: "fallout-4", name: "Fallout 4", added: 14255 },
            { id: 41494, slug: "cyberpunk-2077", name: "Cyberpunk 2077", added: 13893 }
        ]
    },
    {
        id: 1,
        name: "Xbox One",
        slug: "xbox-one",
        games_count: 5729,
        image_background: "https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 28, slug: "red-dead-redemption-2", name: "Red Dead Redemption 2", added: 16779 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 }
        ]
    },
    {
        id: 18,
        name: "PlayStation 4",
        slug: "playstation4",
        games_count: 6976,
        image_background: "https://media.rawg.io/media/games/b45/b45575f34285f2c4479c9a5f719d972e.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 28, slug: "red-dead-redemption-2", name: "Red Dead Redemption 2", added: 16779 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 3439, slug: "life-is-strange-episode-1-2", name: "Life is Strange", added: 15882 }
        ]
    },
    {
        id: 186,
        name: "Xbox Series S/X",
        slug: "xbox-series-x",
        games_count: 1227,
        image_background: "https://media.rawg.io/media/games/718/71891d2484a592d871e91dc826707e1c.jpg",
        image: null,
        year_start: 2020,
        year_end: null,
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 32, slug: "destiny-2", name: "Destiny 2", added: 14572 },
            { id: 41494, slug: "cyberpunk-2077", name: "Cyberpunk 2077", added: 13893 },
            { id: 766, slug: "warframe", name: "Warframe", added: 13135 }
        ]
    },
    {
        id: 7,
        name: "Nintendo Switch",
        slug: "nintendo-switch",
        games_count: 5754,
        image_background: "https://media.rawg.io/media/games/be0/be01c3d7d8795a45615da139322ca080.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 },
            { id: 2454, slug: "doom", name: "DOOM (2016)", added: 13996 }
        ]
    },
    {
        id: 3,
        name: "iOS",
        slug: "ios",
        games_count: 77431,
        image_background: "https://media.rawg.io/media/games/283/283e7e600366b0da7021883d27159b27.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 3439, slug: "life-is-strange-episode-1-2", name: "Life is Strange", added: 15882 },
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 },
            { id: 422, slug: "terraria", name: "Terraria", added: 13489 },
            { id: 766, slug: "warframe", name: "Warframe", added: 13135 },
            { id: 416, slug: "grand-theft-auto-san-andreas", name: "Grand Theft Auto: San Andreas", added: 12065 },
            { id: 23027, slug: "the-walking-dead", name: "The Walking Dead: Season 1", added: 11658 }
        ]
    },
    {
        id: 21,
        name: "Android",
        slug: "android",
        games_count: 52499,
        image_background: "https://media.rawg.io/media/games/e04/e04963f3ac4c4fa83a1dc0b9231e50db.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 13537, slug: "half-life-2", name: "Half-Life 2", added: 16054 },
            { id: 802, slug: "borderlands-2", name: "Borderlands 2", added: 15983 },
            { id: 3439, slug: "life-is-strange-episode-1-2", name: "Life is Strange", added: 15882 },
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 },
            { id: 422, slug: "terraria", name: "Terraria", added: 13489 }
        ]
    },
    {
        id: 8,
        name: "Nintendo 3DS",
        slug: "nintendo-3ds",
        games_count: 1682,
        image_background: "https://media.rawg.io/media/games/041/041026016869e440fb1fb2b6be5222c4.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 422, slug: "terraria", name: "Terraria", added: 13489 },
            { id: 22509, slug: "minecraft", name: "Minecraft", added: 8898 },
            { id: 2597, slug: "lego-lord-of-the-rings", name: "LEGO The Lord of the Rings", added: 5983 },
            { id: 250, slug: "the-binding-of-isaac-rebirth", name: "The Binding of Isaac: Rebirth", added: 5750 },
            { id: 3729, slug: "lego-the-hobbit", name: "LEGO The Hobbit", added: 5481 },
            { id: 4012, slug: "resident-evil-revelations-biohazard-revelations", name: "Resident Evil Revelations", added: 4478 }
        ]
    },
    {
        id: 9,
        name: "Nintendo DS",
        slug: "nintendo-ds",
        games_count: 2486,
        image_background: "https://media.rawg.io/media/screenshots/4f2/4f2246a85225b7a91d63990fe540b7c4.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 865, slug: "call-of-duty-black-ops", name: "Call of Duty: Black Ops", added: 6962 },
            { id: 3486, slug: "syberia", name: "Syberia", added: 6831 },
            { id: 2597, slug: "lego-lord-of-the-rings", name: "LEGO The Lord of the Rings", added: 5983 },
            { id: 5578, slug: "grid", name: "GRID (2008)", added: 5421 },
            { id: 4869, slug: "tomb-raider-underworld", name: "Tomb Raider: Underworld", added: 4956 },
            { id: 5528, slug: "call-of-duty-world-at-war", name: "Call of Duty: World at War", added: 4622 }
        ]
    },
    {
        id: 13,
        name: "Nintendo DSi",
        slug: "nintendo-dsi",
        games_count: 37,
        image_background: "https://media.rawg.io/media/screenshots/078/078629e997421ca28e9098bd7a87cb10.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 19309, slug: "plants-vs-zombies-goty-edition", name: "Plants vs. Zombies GOTY Edition", added: 3957 },
            { id: 949, slug: "cut-the-rope", name: "Cut the Rope", added: 683 },
            { id: 223378, slug: "ace-attorney-investigations-miles-edgeworth", name: "Ace Attorney Investigations - Miles Edgeworth", added: 206 },
            { id: 22727, slug: "jagged-alliance", name: "Jagged Alliance", added: 152 },
            { id: 53802, slug: "dragons-lair", name: "Dragon's Lair", added: 83 },
            { id: 25953, slug: "mario-vs-donkey-kong-minis-march-again", name: "Mario vs. Donkey Kong: Minis March Again!", added: 37 }
        ]
    },
    {
        id: 5,
        name: "macOS",
        slug: "macos",
        games_count: 107985,
        image_background: "https://media.rawg.io/media/games/46d/46d98e6910fbc0706e2948a7cc9b10c5.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 },
            { id: 13537, slug: "half-life-2", name: "Half-Life 2", added: 16054 }
        ]
    },
    {
        id: 6,
        name: "Linux",
        slug: "linux",
        games_count: 80340,
        image_background: "https://media.rawg.io/media/games/b7b/b7b8381707152afc7d91f5d95de70e39.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 13537, slug: "half-life-2", name: "Half-Life 2", added: 16054 }
        ]
    },
    {
        id: 14,
        name: "Xbox 360",
        slug: "xbox360",
        games_count: 2809,
        image_background: "https://media.rawg.io/media/games/562/562553814dd54e001a541e4ee83a591c.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 }
        ]
    },
    {
        id: 80,
        name: "Xbox",
        slug: "xbox-old",
        games_count: 745,
        image_background: "https://media.rawg.io/media/games/7e8/7e8890a662539b1bdefcf57409aef765.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 13537, slug: "half-life-2", name: "Half-Life 2", added: 16054 },
            { id: 416, slug: "grand-theft-auto-san-andreas", name: "Grand Theft Auto: San Andreas", added: 12065 },
            { id: 430, slug: "grand-theft-auto-vice-city", name: "Grand Theft Auto: Vice City", added: 9855 },
            { id: 19301, slug: "counter-strike", name: "Counter-Strike", added: 9301 },
            { id: 2361, slug: "psychonauts", name: "Psychonauts", added: 8316 },
            { id: 432, slug: "grand-theft-auto-iii", name: "Grand Theft Auto III", added: 7298 }
        ]
    },
    {
        id: 16,
        name: "PlayStation 3",
        slug: "playstation3",
        games_count: 3164,
        image_background: "https://media.rawg.io/media/games/bc0/bc06a29ceac58652b684deefe7d56099.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 }
        ]
    },
    {
        id: 15,
        name: "PlayStation 2",
        slug: "playstation2",
        games_count: 2073,
        image_background: "https://media.rawg.io/media/games/791/791abcd56601482964f0fee6d8ab6a61.jpeg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 416, slug: "grand-theft-auto-san-andreas", name: "Grand Theft Auto: San Andreas", added: 12065 },
            { id: 18080, slug: "half-life", name: "Half-Life", added: 11497 },
            { id: 430, slug: "grand-theft-auto-vice-city", name: "Grand Theft Auto: Vice City", added: 9855 },
            { id: 2361, slug: "psychonauts", name: "Psychonauts", added: 8316 },
            { id: 432, slug: "grand-theft-auto-iii", name: "Grand Theft Auto III", added: 7298 },
            { id: 56184, slug: "resident-evil-4", name: "Resident Evil 4 (2005)", added: 7017 }
        ]
    },
    {
        id: 27,
        name: "PlayStation",
        slug: "playstation1",
        games_count: 1684,
        image_background: "https://media.rawg.io/media/games/786/786f9a212646c793ccbad196cba2cf36.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 5159, slug: "resident-evil-2", name: "Resident Evil 2 (1998)", added: 6421 },
            { id: 5193, slug: "oddworld-abes-oddysee", name: "Oddworld: Abe's Oddysee", added: 5758 },
            { id: 3449, slug: "resident-evil", name: "Resident Evil", added: 5448 },
            { id: 52939, slug: "final-fantasy-vii", name: "Final Fantasy VII (1997)", added: 4364 },
            { id: 20569, slug: "ufo-enemy-unknown", name: "X-COM: UFO Defense", added: 3649 },
            { id: 57908, slug: "tomb-raider-ii", name: "Tomb Raider II", added: 3280 }
        ]
    },
    {
        id: 19,
        name: "PS Vita",
        slug: "ps-vita",
        games_count: 1458,
        image_background: "https://media.rawg.io/media/games/8d6/8d69eb6c32ed6acfd75f82d532144993.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 802, slug: "borderlands-2", name: "Borderlands 2", added: 15983 },
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 },
            { id: 422, slug: "terraria", name: "Terraria", added: 13489 },
            { id: 23027, slug: "the-walking-dead", name: "The Walking Dead: Season 1", added: 11658 },
            { id: 654, slug: "stardew-valley", name: "Stardew Valley", added: 10974 },
            { id: 3612, slug: "hotline-miami", name: "Hotline Miami", added: 10891 }
        ]
    },
    {
        id: 17,
        name: "PSP",
        slug: "psp",
        games_count: 1377,
        image_background: "https://media.rawg.io/media/games/932/93221053809511fde4a0c6a9fddaf558.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 13886, slug: "star-wars-battlefront-ii-2", name: "Star Wars: Battlefront II (2005)", added: 4880 },
            { id: 5298, slug: "tomb-raider-legend", name: "Tomb Raider: Legend", added: 4523 },
            { id: 5297, slug: "tomb-raider-anniversary", name: "Tomb Raider: Anniversary", added: 4422 },
            { id: 58890, slug: "need-for-speed-most-wanted", name: "Need For Speed: Most Wanted", added: 3264 },
            { id: 16543, slug: "lego-batman", name: "LEGO Batman", added: 3243 },
            { id: 13926, slug: "prince-of-persia-the-two-thrones", name: "Prince of Persia: The Two Thrones", added: 2902 }
        ]
    },
    {
        id: 10,
        name: "Wii U",
        slug: "wii-u",
        games_count: 1114,
        image_background: "https://media.rawg.io/media/games/cc1/cc196a5ad763955d6532cdba236f730c.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 422, slug: "terraria", name: "Terraria", added: 13489 },
            { id: 3841, slug: "assassins-creed-iv-black-flag", name: "Assassin’s Creed IV: Black Flag", added: 9748 },
            { id: 3144, slug: "super-meat-boy", name: "Super Meat Boy", added: 9685 },
            { id: 22509, slug: "minecraft", name: "Minecraft", added: 8898 },
            { id: 3687, slug: "watch-dogs", name: "Watch Dogs", added: 8396 },
            { id: 3876, slug: "deus-ex-human-revolution-directors-cut", name: "Deus Ex: Human Revolution - Director's Cut", added: 7770 }
        ]
    },
    {
        id: 11,
        name: "Wii",
        slug: "wii",
        games_count: 2208,
        image_background: "https://media.rawg.io/media/games/693/693952316d4b90984a92e7ab0f5c9b81.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 56184, slug: "resident-evil-4", name: "Resident Evil 4 (2005)", added: 7017 },
            { id: 865, slug: "call-of-duty-black-ops", name: "Call of Duty: Black Ops", added: 6962 },
            { id: 11276, slug: "call-of-duty-modern-warfare-3", name: "Call of Duty: Modern Warfare 3", added: 6361 },
            { id: 2597, slug: "lego-lord-of-the-rings", name: "LEGO The Lord of the Rings", added: 5983 },
            { id: 4869, slug: "tomb-raider-underworld", name: "Tomb Raider: Underworld", added: 4956 },
            { id: 5528, slug: "call-of-duty-world-at-war", name: "Call of Duty: World at War", added: 4622 }
        ]
    },
    {
        id: 105,
        name: "GameCube",
        slug: "gamecube",
        games_count: 636,
        image_background: "https://media.rawg.io/media/games/83b/83b59a9d512bec8bc8bda6b539b215b2.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 56184, slug: "resident-evil-4", name: "Resident Evil 4 (2005)", added: 7017 },
            { id: 5159, slug: "resident-evil-2", name: "Resident Evil 2 (1998)", added: 6421 },
            { id: 19592, slug: "hitman-2-silent-assassin", name: "Hitman 2: Silent Assassin", added: 4653 },
            { id: 5298, slug: "tomb-raider-legend", name: "Tomb Raider: Legend", added: 4523 },
            { id: 12018, slug: "star-wars-jedi-knight-ii-jedi-outcast", name: "Star Wars Jedi Knight II: Jedi Outcast", added: 3804 },
            { id: 13909, slug: "prince-of-persia-the-sands-of-time", name: "Prince of Persia: The Sands of Time", added: 3494 }
        ]
    },
    {
        id: 83,
        name: "Nintendo 64",
        slug: "nintendo-64",
        games_count: 363,
        image_background: "https://media.rawg.io/media/screenshots/61f/61f183e3d12c7846ed6bd3c027a9fa47.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 5159, slug: "resident-evil-2", name: "Resident Evil 2 (1998)", added: 6421 },
            { id: 54491, slug: "quake", name: "Quake", added: 3303 },
            { id: 20466, slug: "worms-armageddon", name: "Worms Armageddon", added: 3172 },
            { id: 54492, slug: "quake-2", name: "Quake II", added: 2799 },
            { id: 25097, slug: "the-legend-of-zelda-ocarina-of-time", name: "The Legend of Zelda: Ocarina of Time", added: 1874 },
            { id: 22900, slug: "daikatana", name: "John Romero's Daikatana", added: 1608 }
        ]
    },
    {
        id: 24,
        name: "Game Boy Advance",
        slug: "game-boy-advance",
        games_count: 956,
        image_background: "https://media.rawg.io/media/games/373/373a9a1f664de6e4c31f08644729e2db.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 53341, slug: "jet-set-radio-2012", name: "Jet Set Radio", added: 5308 },
            { id: 17975, slug: "doom-ii", name: "DOOM II", added: 3356 },
            { id: 53446, slug: "need-for-speed-underground-2-2", name: "Need for Speed: Underground 2", added: 2324 },
            { id: 19646, slug: "splinter-cell", name: "Tom Clancy's Splinter Cell", added: 2284 },
            { id: 4005, slug: "wolfenstein-3d", name: "Wolfenstein 3D", added: 1939 },
            { id: 5265, slug: "need-for-speed-carbon", name: "Need For Speed Carbon", added: 1764 }
        ]
    },
    {
        id: 43,
        name: "Game Boy Color",
        slug: "game-boy-color",
        games_count: 428,
        image_background: "https://media.rawg.io/media/games/360/360f00cbb4b4364b9af0e7ff8e397b65.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 20466, slug: "worms-armageddon", name: "Worms Armageddon", added: 3172 },
            { id: 57607, slug: "metal-gear-solid-1", name: "Metal Gear Solid", added: 2307 },
            { id: 52997, slug: "grand-theft-auto-2-1999", name: "Grand Theft Auto 2", added: 2021 },
            { id: 52998, slug: "grand-theft-auto-1998", name: "Grand Theft Auto", added: 1940 },
            { id: 25080, slug: "super-mario-bros", name: "Super Mario Bros.", added: 1532 },
            { id: 24030, slug: "super-mario-bros-3", name: "Super Mario Bros. 3", added: 1208 }
        ]
    },
    {
        id: 26,
        name: "Game Boy",
        slug: "game-boy",
        games_count: 617,
        image_background: "https://media.rawg.io/media/games/057/0573c1c9e1f2414c1f4acabe86ee9fd9.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 5383, slug: "worms", name: "Worms", added: 2137 },
            { id: 52998, slug: "grand-theft-auto-1998", name: "Grand Theft Auto", added: 1940 },
            { id: 52175, slug: "battletoads", name: "Battletoads", added: 1886 },
            { id: 54285, slug: "mortal-kombat", name: "Mortal Kombat", added: 1793 },
            { id: 14829, slug: "turok", name: "Turok: Dinosaur Hunter", added: 1427 },
            { id: 23762, slug: "pokemon-red", name: "Pokémon Red, Blue, Yellow", added: 1104 }
        ]
    },
    {
        id: 79,
        name: "SNES",
        slug: "snes",
        games_count: 991,
        image_background: "https://media.rawg.io/media/screenshots/52b/52b958a7b263d4f264648b710e76a236.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 5383, slug: "worms", name: "Worms", added: 2137 },
            { id: 4005, slug: "wolfenstein-3d", name: "Wolfenstein 3D", added: 1939 },
            { id: 54285, slug: "mortal-kombat", name: "Mortal Kombat", added: 1793 },
            { id: 52884, slug: "doom-2", name: "DOOM", added: 1691 },
            { id: 1063, slug: "final-fantasy-vi", name: "FINAL FANTASY VI", added: 1569 },
            { id: 24899, slug: "super-mario-world", name: "Super Mario World", added: 1548 }
        ]
    },
    {
        id: 49,
        name: "NES",
        slug: "nes",
        games_count: 1025,
        image_background: "https://media.rawg.io/media/screenshots/656/6566c32aebb7b23af0573091132c2f2c.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 54122, slug: "ultima-4-quest-of-the-avatar", name: "Ultima IV: Quest of the Avatar", added: 2271 },
            { id: 52175, slug: "battletoads", name: "Battletoads", added: 1886 },
            { id: 25080, slug: "super-mario-bros", name: "Super Mario Bros.", added: 1532 },
            { id: 24030, slug: "super-mario-bros-3", name: "Super Mario Bros. 3", added: 1208 },
            { id: 24881, slug: "pac-man", name: "Pac-Man", added: 830 },
            { id: 24072, slug: "the-legend-of-zelda", name: "The Legend of Zelda", added: 771 }
        ]
    },
    {
        id: 55,
        name: "Classic Macintosh",
        slug: "macintosh",
        games_count: 674,
        image_background: "https://media.rawg.io/media/games/38a/38af969459ad6e5de116ec8a4a84218c.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 13554, slug: "fallout-a-post-nuclear-role-playing-game", name: "Fallout", added: 8492 },
            { id: 2518, slug: "max-payne", name: "Max Payne", added: 5838 },
            { id: 12018, slug: "star-wars-jedi-knight-ii-jedi-outcast", name: "Star Wars Jedi Knight II: Jedi Outcast", added: 3804 },
            { id: 17975, slug: "doom-ii", name: "DOOM II", added: 3356 },
            { id: 54491, slug: "quake", name: "Quake", added: 3303 },
            { id: 57908, slug: "tomb-raider-ii", name: "Tomb Raider II", added: 3280 }
        ]
    },
    {
        id: 41,
        name: "Apple II",
        slug: "apple-ii",
        games_count: 424,
        image_background: "https://media.rawg.io/media/games/941/94139518bc51a86b9e1b762e0b8b62c8.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 30119, slug: "wasteland", name: "Wasteland", added: 2285 },
            { id: 54122, slug: "ultima-4-quest-of-the-avatar", name: "Ultima IV: Quest of the Avatar", added: 2271 },
            { id: 22991, slug: "akalabeth-world-of-doom-2", name: "Akalabeth: World of Doom", added: 1526 },
            { id: 24881, slug: "pac-man", name: "Pac-Man", added: 830 },
            { id: 29908, slug: "another-world", name: "Another World", added: 823 },
            { id: 51175, slug: "leisure-suit-larry-1-in-the-land-of-the-lounge-l-2", name: "Leisure Suit Larry 1 - In the Land of the Lounge Lizards", added: 761 }
        ]
    },
    {
        id: 166,
        name: "Commodore / Amiga",
        slug: "commodore-amiga",
        games_count: 2084,
        image_background: "https://media.rawg.io/media/screenshots/101/1015fe740ce5654eb97c9140f6da3c3e.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 20569, slug: "ufo-enemy-unknown", name: "X-COM: UFO Defense", added: 3649 },
            { id: 54491, slug: "quake", name: "Quake", added: 3303 },
            { id: 54492, slug: "quake-2", name: "Quake II", added: 2799 },
            { id: 22734, slug: "beneath-a-steel-sky", name: "Beneath a Steel Sky", added: 2704 },
            { id: 30119, slug: "wasteland", name: "Wasteland", added: 2285 },
            { id: 54122, slug: "ultima-4-quest-of-the-avatar", name: "Ultima IV: Quest of the Avatar", added: 2271 }
        ]
    },
    {
        id: 28,
        name: "Atari 7800",
        slug: "atari-7800",
        games_count: 64,
        image_background: "https://media.rawg.io/media/screenshots/565/56504b28b184dbc630a7de118e39d822.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 3802, slug: "double-dragon", name: "Double Dragon", added: 481 },
            { id: 52512, slug: "arcade-archives-donkey-kong", name: "Donkey Kong", added: 440 },
            { id: 52434, slug: "mario-bros-1983", name: "Mario Bros. (1983)", added: 322 },
            { id: 28279, slug: "joust", name: "Joust", added: 187 },
            { id: 52513, slug: "donkey-kong-jr", name: "Donkey Kong Jr.", added: 150 },
            { id: 53830, slug: "galaga-1981", name: "Galaga (1981)", added: 148 }
        ]
    },
    {
        id: 31,
        name: "Atari 5200",
        slug: "atari-5200",
        games_count: 64,
        image_background: "https://media.rawg.io/media/screenshots/678/6786598cba3939d48ed60cbd1a3723f4.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 24881, slug: "pac-man", name: "Pac-Man", added: 830 },
            { id: 52434, slug: "mario-bros-1983", name: "Mario Bros. (1983)", added: 322 },
            { id: 28279, slug: "joust", name: "Joust", added: 187 },
            { id: 52423, slug: "galaxian", name: "Galaxian", added: 178 },
            { id: 52444, slug: "space-invaders-1978", name: "Space Invaders (1978)", added: 162 },
            { id: 52418, slug: "dig-dug-1982", name: "Dig Dug (1982)", added: 133 }
        ]
    },
    {
        id: 23,
        name: "Atari 2600",
        slug: "atari-2600",
        games_count: 294,
        image_background: "https://media.rawg.io/media/screenshots/ff6/ff623993a854663931c1e78d72a16a5a.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 24881, slug: "pac-man", name: "Pac-Man", added: 830 },
            { id: 52623, slug: "tetris-1984", name: "Tetris (1984)", added: 649 },
            { id: 3802, slug: "double-dragon", name: "Double Dragon", added: 481 },
            { id: 52512, slug: "arcade-archives-donkey-kong", name: "Donkey Kong", added: 440 },
            { id: 52434, slug: "mario-bros-1983", name: "Mario Bros. (1983)", added: 322 },
            { id: 52467, slug: "track-field", name: "Track & Field", added: 214 }
        ]
    },
    {
        id: 22,
        name: "Atari Flashback",
        slug: "atari-flashback",
        games_count: 30,
        image_background: "https://media.rawg.io/media/screenshots/2aa/2aa07f58491e14b0183333f8956bc802.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 53138, slug: "pong-1972", name: "Pong (1972)", added: 125 },
            { id: 52391, slug: "adventure-game-atari", name: "Adventure", added: 65 },
            { id: 52563, slug: "pitfall-1982", name: "Pitfall! (1982)", added: 61 },
            { id: 52402, slug: "breakout-1976", name: "Breakout (1976)", added: 58 },
            { id: 52436, slug: "missile-command-1980", name: "Missile Command (1980)", added: 51 },
            { id: 52409, slug: "combat-1977", name: "Combat (1977)", added: 45 }
        ]
    },
    {
        id: 25,
        name: "Atari 8-bit",
        slug: "atari-8-bit",
        games_count: 309,
        image_background: "https://media.rawg.io/media/games/876/8764efc52fba503a00af64a2cd51f66c.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 54122, slug: "ultima-4-quest-of-the-avatar", name: "Ultima IV: Quest of the Avatar", added: 2271 },
            { id: 24881, slug: "pac-man", name: "Pac-Man", added: 830 },
            { id: 52512, slug: "arcade-archives-donkey-kong", name: "Donkey Kong", added: 440 },
            { id: 52434, slug: "mario-bros-1983", name: "Mario Bros. (1983)", added: 322 },
            { id: 28279, slug: "joust", name: "Joust", added: 187 },
            { id: 25161, slug: "lode-runner", name: "Lode Runner", added: 183 }
        ]
    },
    {
        id: 34,
        name: "Atari ST",
        slug: "atari-st",
        games_count: 836,
        image_background: "https://media.rawg.io/media/games/e6a/e6a509fed4879271d7d7eaba04349d10.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 54122, slug: "ultima-4-quest-of-the-avatar", name: "Ultima IV: Quest of the Avatar", added: 2271 },
            { id: 22733, slug: "lure-of-the-temptress", name: "Lure of the Temptress", added: 1791 },
            { id: 29908, slug: "another-world", name: "Another World", added: 823 },
            { id: 16122, slug: "loom", name: "LOOM", added: 799 },
            { id: 31542, slug: "indiana-jones-and-the-last-crusade", name: "Indiana Jones and the Last Crusade: The Graphic Adventure", added: 776 },
            { id: 51175, slug: "leisure-suit-larry-1-in-the-land-of-the-lounge-l-2", name: "Leisure Suit Larry 1 - In the Land of the Lounge Lizards", added: 761 }
        ]
    },
    {
        id: 46,
        name: "Atari Lynx",
        slug: "atari-lynx",
        games_count: 57,
        image_background: "https://media.rawg.io/media/screenshots/d71/d71b68d3f6b1810bc9d64d7aea746d30.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 29391, slug: "eye-of-the-beholder", name: "Eye of the Beholder", added: 1189 },
            { id: 3802, slug: "double-dragon", name: "Double Dragon", added: 481 },
            { id: 30501, slug: "chips-challenge", name: "Chip's Challenge", added: 465 },
            { id: 53467, slug: "paperboy", name: "Paperboy", added: 205 },
            { id: 52438, slug: "ms-pac-man", name: "Ms. Pac-Man", added: 116 },
            { id: 53975, slug: "ninja-gaiden-iii-the-ancient-ship-of-doom", name: "Ninja Gaiden III: The Ancient Ship of Doom (1991)", added: 114 }
        ]
    },
    {
        id: 50,
        name: "Atari XEGS",
        slug: "atari-xegs",
        games_count: 22,
        image_background: "https://media.rawg.io/media/screenshots/769/7691726d70c23c029903df08858df001.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 52512, slug: "arcade-archives-donkey-kong", name: "Donkey Kong", added: 440 },
            { id: 52434, slug: "mario-bros-1983", name: "Mario Bros. (1983)", added: 322 },
            { id: 34571, slug: "lode-runner-1983", name: "Lode Runner (1983)", added: 139 },
            { id: 53687, slug: "archon-the-light-and-the-dark", name: "Archon: The Light and the Dark", added: 21 },
            { id: 52605, slug: "summer-games", name: "Summer Games", added: 25 },
            { id: 52413, slug: "crossbow", name: "Crossbow", added: 15 }
        ]
    },
    {
        id: 167,
        name: "Genesis",
        slug: "genesis",
        games_count: 850,
        image_background: "https://media.rawg.io/media/screenshots/f7a/f7a70f1b271de9b92a9714db33e4c8ba.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 5383, slug: "worms", name: "Worms", added: 2137 },
            { id: 52175, slug: "battletoads", name: "Battletoads", added: 1886 },
            { id: 54285, slug: "mortal-kombat", name: "Mortal Kombat", added: 1793 },
            { id: 53551, slug: "sonic-the-hedgehog", name: "Sonic the Hedgehog (1991)", added: 1601 },
            { id: 2552, slug: "sonic-the-hedgehog-2", name: "Sonic the Hedgehog 2", added: 1380 },
            { id: 28510, slug: "duke-nukem-3d", name: "Duke Nukem 3D", added: 1017 }
        ]
    },
    {
        id: 107,
        name: "SEGA Saturn",
        slug: "sega-saturn",
        games_count: 376,
        image_background: "https://media.rawg.io/media/screenshots/862/862f0a3da04a5e2d5146b35e75e0d85b.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 3449, slug: "resident-evil", name: "Resident Evil", added: 5448 },
            { id: 54491, slug: "quake", name: "Quake", added: 3303 },
            { id: 28300, slug: "nights-into-dreams", name: "NiGHTS into dreams...", added: 2747 },
            { id: 5383, slug: "worms", name: "Worms", added: 2137 },
            { id: 52790, slug: "castlevania-sotn", name: "Castlevania: Symphony of the Night", added: 1769 },
            { id: 52884, slug: "doom-2", name: "DOOM", added: 1691 }
        ]
    },
    {
        id: 119,
        name: "SEGA CD",
        slug: "sega-cd",
        games_count: 163,
        image_background: "https://media.rawg.io/media/screenshots/9a0/9a01b32ce1a3e0576018a2580e32cf26.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 1559, slug: "sonic-cd", name: "Sonic CD", added: 2345 },
            { id: 54285, slug: "mortal-kombat", name: "Mortal Kombat", added: 1793 },
            { id: 29391, slug: "eye-of-the-beholder", name: "Eye of the Beholder", added: 1189 },
            { id: 25663, slug: "earthworm-jim", name: "Earthworm Jim", added: 838 },
            { id: 45957, slug: "prince-of-persia-nes", name: "Prince of Persia (1989)", added: 687 },
            { id: 4377, slug: "myst", name: "Myst", added: 520 }
        ]
    },
    {
        id: 117,
        name: "SEGA 32X",
        slug: "sega-32x",
        games_count: 46,
        image_background: "https://media.rawg.io/media/screenshots/d9f/d9f308b5d824ae8f047edc0a998a587b.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 52884, slug: "doom-2", name: "DOOM", added: 1691 },
            { id: 29426, slug: "mortal-kombat-2", name: "Mortal Kombat 2", added: 527 },
            { id: 5463, slug: "rayman", name: "Rayman", added: 348 },
            { id: 53781, slug: "darkwing-duck", name: "Disney's Darkwing Duck", added: 268 },
            { id: 32519, slug: "wwf-wrestlemania-the-arcade-game", name: "WWF WrestleMania: The Arcade Game", added: 160 },
            { id: 53975, slug: "ninja-gaiden-iii-the-ancient-ship-of-doom", name: "Ninja Gaiden III: The Ancient Ship of Doom (1991)", added: 114 }
        ]
    },
    {
        id: 74,
        name: "SEGA Master System",
        slug: "sega-master-system",
        games_count: 239,
        image_background: "https://media.rawg.io/media/screenshots/347/347e1979dcf9b62dc48202b73317a186.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 54122, slug: "ultima-4-quest-of-the-avatar", name: "Ultima IV: Quest of the Avatar", added: 2271 },
            { id: 54285, slug: "mortal-kombat", name: "Mortal Kombat", added: 1793 },
            { id: 4678, slug: "streets-of-rage-2", name: "Streets of Rage 2", added: 931 },
            { id: 914, slug: "wonder-boy-the-dragons-trap", name: "Wonder Boy: The Dragon's Trap", added: 836 },
            { id: 25663, slug: "earthworm-jim", name: "Earthworm Jim", added: 838 },
            { id: 53207, slug: "comix-zone-1995", name: "Comix Zone", added: 810 }
        ]
    },
    {
        id: 106,
        name: "Dreamcast",
        slug: "dreamcast",
        games_count: 364,
        image_background: "https://media.rawg.io/media/games/838/838b3e1f39cb8e60c9287cc88607bf52.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 18080, slug: "half-life", name: "Half-Life", added: 11497 },
            { id: 19542, slug: "half-life-blue-shift", name: "Half-Life: Blue Shift", added: 7026 },
            { id: 5159, slug: "resident-evil-2", name: "Resident Evil 2 (1998)", added: 6421 },
            { id: 53341, slug: "jet-set-radio-2012", name: "Jet Set Radio", added: 5308 },
            { id: 20466, slug: "worms-armageddon", name: "Worms Armageddon", added: 3172 },
            { id: 54629, slug: "crazy-taxi", name: "Crazy Taxi (1999)", added: 2777 }
        ]
    },
    {
        id: 111,
        name: "3DO",
        slug: "3do",
        games_count: 101,
        image_background: "https://media.rawg.io/media/games/47b/47b50d880be8453bf9cda6e5c007bc26.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 4005, slug: "wolfenstein-3d", name: "Wolfenstein 3D", added: 1939 },
            { id: 52884, slug: "doom-2", name: "DOOM", added: 1691 },
            { id: 29908, slug: "another-world", name: "Another World", added: 823 },
            { id: 53432, slug: "ultimate-mortal-kombat-3", name: "Ultimate Mortal Kombat 3", added: 720 },
            { id: 4377, slug: "myst", name: "Myst", added: 520 },
            { id: 15512, slug: "alone-in-the-dark-1", name: "Alone in the Dark 1", added: 377 }
        ]
    },
    {
        id: 112,
        name: "Jaguar",
        slug: "jaguar",
        games_count: 40,
        image_background: "https://media.rawg.io/media/games/8fc/8fcc2ff5c7bcdb58199b1a4326817ceb.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 5383, slug: "worms", name: "Worms", added: 2137 },
            { id: 4005, slug: "wolfenstein-3d", name: "Wolfenstein 3D", added: 1939 },
            { id: 52884, slug: "doom-2", name: "DOOM", added: 1691 },
            { id: 29908, slug: "another-world", name: "Another World", added: 823 },
            { id: 4377, slug: "myst", name: "Myst", added: 520 },
            { id: 5463, slug: "rayman", name: "Rayman", added: 348 }
        ]
    },
    {
        id: 77,
        name: "Game Gear",
        slug: "game-gear",
        games_count: 229,
        image_background: "https://media.rawg.io/media/games/687/687c7ac926491e65dcb8f0c9d45cab07.jpg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 52175, slug: "battletoads", name: "Battletoads", added: 1886 },
            { id: 54285, slug: "mortal-kombat", name: "Mortal Kombat", added: 1793 },
            { id: 53551, slug: "sonic-the-hedgehog", name: "Sonic the Hedgehog (1991)", added: 1601 },
            { id: 2552, slug: "sonic-the-hedgehog-2", name: "Sonic the Hedgehog 2", added: 1380 },
            { id: 4678, slug: "streets-of-rage-2", name: "Streets of Rage 2", added: 931 },
            { id: 25663, slug: "earthworm-jim", name: "Earthworm Jim", added: 838 }
        ]
    },
    {
        id: 12,
        name: "Neo Geo",
        slug: "neogeo",
        games_count: 125,
        image_background: "https://media.rawg.io/media/screenshots/4cc/4ccee6c3e367f4dd94d19d4857dfc1c9.jpeg",
        image: null,
        year_start: null,
        year_end: null,
        games: [
            { id: 1488, slug: "metal-slug-3", name: "METAL SLUG 3", added: 2729 },
            { id: 4808, slug: "metal-slug-x", name: "Metal Slug X", added: 1348 },
            { id: 14948, slug: "metal-slug", name: "METAL SLUG", added: 1298 },
            { id: 23669, slug: "the-king-of-fighters-2002", name: "THE KING OF FIGHTERS 2002", added: 919 },
            { id: 24881, slug: "pac-man", name: "Pac-Man", added: 830 },
            { id: 6256, slug: "metal-slug-2", name: "METAL SLUG 2", added: 804 }
        ]
    }
];

export interface TagCatalogItem extends CatalogItem {
    games_count: number;
    image_background: string;
    language: string;
    games: GenreGamePreview[];
}

export const tagsCatalog: TagCatalogItem[] = [
    {
        id: 31,
        name: "Singleplayer",
        slug: "singleplayer",
        games_count: 250715,
        image_background: "https://media.rawg.io/media/games/d82/d82990b9c67ba0d2d09d4e6fa88885a7.jpg",
        language: "eng",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 }
        ]
    },
    {
        id: 40847,
        name: "Steam Achievements",
        slug: "steam-achievements",
        games_count: 51662,
        image_background: "https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg",
        language: "eng",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 }
        ]
    },
    {
        id: 7,
        name: "Multiplayer",
        slug: "multiplayer",
        games_count: 42530,
        image_background: "https://media.rawg.io/media/games/d0f/d0f91fe1d92332147e5db74e207cfc7a.jpg",
        language: "eng",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 },
            { id: 28, slug: "red-dead-redemption-2", name: "Red Dead Redemption 2", added: 16779 }
        ]
    },
    {
        id: 40836,
        name: "Full controller support",
        slug: "full-controller-support",
        games_count: 24114,
        image_background: "https://media.rawg.io/media/games/310/3106b0e012271c5ffb16497b070be739.jpg",
        language: "eng",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 }
        ]
    },
    {
        id: 40849,
        name: "Steam Cloud",
        slug: "steam-cloud",
        games_count: 25700,
        image_background: "https://media.rawg.io/media/games/490/49016e06ae2103881ff6373248843069.jpg",
        language: "eng",
        games: [
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 13537, slug: "half-life-2", name: "Half-Life 2", added: 16054 },
            { id: 802, slug: "borderlands-2", name: "Borderlands 2", added: 15983 }
        ]
    },
    {
        id: 13,
        name: "Atmospheric",
        slug: "atmospheric",
        games_count: 39690,
        image_background: "https://media.rawg.io/media/games/6cd/6cd653e0aaef5ff8bbd295bf4bcb12eb.jpg",
        language: "eng",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 }
        ]
    },
    {
        id: 7808,
        name: "steam-trading-cards",
        slug: "steam-trading-cards",
        games_count: 7568,
        image_background: "https://media.rawg.io/media/games/e6d/e6de699bd788497f4b52e2f41f9698f2.jpg",
        language: "eng",
        games: [
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 13537, slug: "half-life-2", name: "Half-Life 2", added: 16054 }
        ]
    },
    {
        id: 42,
        name: "Great Soundtrack",
        slug: "great-soundtrack",
        games_count: 3451,
        image_background: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg",
        language: "eng",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 28, slug: "red-dead-redemption-2", name: "Red Dead Redemption 2", added: 16779 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 }
        ]
    },
    {
        id: 24,
        name: "RPG",
        slug: "rpg",
        games_count: 26600,
        image_background: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
        language: "eng",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 802, slug: "borderlands-2", name: "Borderlands 2", added: 15983 }
        ]
    },
    {
        id: 18,
        name: "Co-op",
        slug: "co-op",
        games_count: 14378,
        image_background: "https://media.rawg.io/media/games/da1/da1b267764d77221f07a4386b6548e5a.jpg",
        language: "eng",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 },
            { id: 28, slug: "red-dead-redemption-2", name: "Red Dead Redemption 2", added: 16779 },
            { id: 802, slug: "borderlands-2", name: "Borderlands 2", added: 15983 }
        ]
    }
];

export interface DetailedStoreCatalogItem extends StoreCatalogItem {
    games_count: number;
    image_background: string;
    games: GenreGamePreview[];
}

export const storesCatalog: DetailedStoreCatalogItem[] = [
    {
        id: 1,
        name: "Steam",
        domain: "store.steampowered.com",
        slug: "steam",
        games_count: 123100,
        image_background: "https://media.rawg.io/media/games/b7d/b7d3f1715fa8381a4e780173a197a615.jpg",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 }
        ]
    },
    {
        id: 3,
        name: "PlayStation Store",
        domain: "store.playstation.com",
        slug: "playstation-store",
        games_count: 8071,
        image_background: "https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 }
        ]
    },
    {
        id: 2,
        name: "Xbox Store",
        domain: "microsoft.com",
        slug: "xbox-store",
        games_count: 4934,
        image_background: "https://media.rawg.io/media/games/da1/da1b267764d77221f07a4386b6548e5a.jpg",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 28, slug: "red-dead-redemption-2", name: "Red Dead Redemption 2", added: 16779 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 802, slug: "borderlands-2", name: "Borderlands 2", added: 15983 }
        ]
    },
    {
        id: 4,
        name: "App Store",
        domain: "apps.apple.com",
        slug: "apple-appstore",
        games_count: 75589,
        image_background: "https://media.rawg.io/media/games/8a0/8a02f84a5916ede2f923b88d5f8217ba.jpg",
        games: [
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 802, slug: "borderlands-2", name: "Borderlands 2", added: 15983 },
            { id: 3439, slug: "life-is-strange-episode-1-2", name: "Life is Strange", added: 15882 },
            { id: 4286, slug: "bioshock", name: "BioShock", added: 14740 },
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 }
        ]
    },
    {
        id: 5,
        name: "GOG",
        domain: "gog.com",
        slug: "gog",
        games_count: 7177,
        image_background: "https://media.rawg.io/media/games/8e4/8e4de3f54ac659e08a7ba6a2b731682a.jpg",
        games: [
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 3439, slug: "life-is-strange-episode-1-2", name: "Life is Strange", added: 15882 },
            { id: 58175, slug: "god-of-war-2", name: "God of War (2018)", added: 14484 },
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 },
            { id: 2454, slug: "doom", name: "DOOM (2016)", added: 13996 },
            { id: 41494, slug: "cyberpunk-2077", name: "Cyberpunk 2077", added: 13893 }
        ]
    },
    {
        id: 6,
        name: "Nintendo Store",
        domain: "nintendo.com",
        slug: "nintendo",
        games_count: 9147,
        image_background: "https://media.rawg.io/media/games/e04/e04963f3ac4c4fa83a1dc0b9231e50db.jpg",
        games: [
            { id: 3328, slug: "the-witcher-3-wild-hunt", name: "The Witcher 3: Wild Hunt", added: 22113 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 3939, slug: "payday-2", name: "PAYDAY 2", added: 14127 },
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 },
            { id: 2454, slug: "doom", name: "DOOM (2016)", added: 13996 }
        ]
    },
    {
        id: 7,
        name: "Xbox 360 Store",
        domain: "marketplace.xbox.com",
        slug: "xbox360",
        games_count: 1915,
        image_background: "https://media.rawg.io/media/games/bc0/bc06a29ceac58652b684deefe7d56099.jpg",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 4200, slug: "portal-2", name: "Portal 2", added: 20822 },
            { id: 4291, slug: "counter-strike-global-offensive", name: "Counter-Strike: Global Offensive", added: 18339 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 12020, slug: "left-4-dead-2", name: "Left 4 Dead 2", added: 17474 },
            { id: 5679, slug: "the-elder-scrolls-v-skyrim", name: "The Elder Scrolls V: Skyrim", added: 16805 }
        ]
    },
    {
        id: 8,
        name: "Google Play",
        domain: "play.google.com",
        slug: "google-play",
        games_count: 17124,
        image_background: "https://media.rawg.io/media/games/1bd/1bd2657b81eb0c99338120ad444b24ff.jpg",
        games: [
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 13536, slug: "portal", name: "Portal", added: 17748 },
            { id: 13537, slug: "half-life-2", name: "Half-Life 2", added: 16054 },
            { id: 802, slug: "borderlands-2", name: "Borderlands 2", added: 15983 },
            { id: 3439, slug: "life-is-strange-episode-1-2", name: "Life is Strange", added: 15882 },
            { id: 1030, slug: "limbo", name: "Limbo", added: 14120 }
        ]
    },
    {
        id: 9,
        name: "itch.io",
        domain: "itch.io",
        slug: "itch",
        games_count: 654184,
        image_background: "https://media.rawg.io/media/games/052/052f9afc7aaeea3e2c5d46eafa92c64e.jpg",
        games: [
            { id: 613, slug: "bastion", name: "Bastion", added: 8745 },
            { id: 5525, slug: "brutal-legend", name: "Brutal Legend", added: 8417 },
            { id: 356714, slug: "among-us", name: "Among Us", added: 7928 },
            { id: 1010, slug: "transistor", name: "Transistor", added: 7829 },
            { id: 11726, slug: "dead-cells", name: "Dead Cells", added: 7274 },
            { id: 1358, slug: "papers-please", name: "Papers, Please", added: 7244 }
        ]
    },
    {
        id: 11,
        name: "Epic Games",
        domain: "epicgames.com",
        slug: "epic-games",
        games_count: 1441,
        image_background: "https://media.rawg.io/media/games/310/3106b0e012271c5ffb16497b070be739.jpg",
        games: [
            { id: 3498, slug: "grand-theft-auto-v", name: "Grand Theft Auto V", added: 22475 },
            { id: 5286, slug: "tomb-raider", name: "Tomb Raider (2013)", added: 17772 },
            { id: 28, slug: "red-dead-redemption-2", name: "Red Dead Redemption 2", added: 16779 },
            { id: 4062, slug: "bioshock-infinite", name: "BioShock Infinite", added: 16078 },
            { id: 32, slug: "destiny-2", name: "Destiny 2", added: 14572 },
            { id: 58175, slug: "god-of-war-2", name: "God of War (2018)", added: 14484 }
        ]
    }
];
