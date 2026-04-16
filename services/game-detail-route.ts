import {
    genresCatalog,
    platformsCatalog,
    storesCatalog,
    tagsCatalog,
} from '@/app/static/catalog-data';

type GameRouteInput = {
    slug?: string | null;
};

const STATIC_GAME_SLUGS = (() => {
    const set = new Set<string>();

    const collect = (slug: unknown) => {
        if (typeof slug !== 'string') {
            return;
        }

        const normalized = slug.trim();
        if (!normalized) {
            return;
        }

        set.add(normalized);
    };

    genresCatalog.forEach((item) => item.games.forEach((game) => collect(game.slug)));
    platformsCatalog.forEach((item) => item.games.forEach((game) => collect(game.slug)));
    tagsCatalog.forEach((item) => item.games.forEach((game) => collect(game.slug)));
    storesCatalog.forEach((item) => item.games.forEach((game) => collect(game.slug)));

    // Keep this in sync with generateStaticParams special-case slugs.
    collect('mouse-3');
    collect('replaced');

    return set;
})();

const normalizeSlug = (value: string | null | undefined): string | null => {
    if (!value) {
        return null;
    }

    const normalized = value.trim();
    if (!normalized) {
        return null;
    }

    return normalized;
};

export const getStaticGameSlug = (value: string | null | undefined): string | null => {
    const normalized = normalizeSlug(value);
    if (!normalized) {
        return null;
    }

    return STATIC_GAME_SLUGS.has(normalized) ? normalized : null;
};

export const getGameDetailHref = ({ slug }: GameRouteInput): string => {
    const normalized = normalizeSlug(slug);
    return `/game/${normalized || 'replaced'}`;
};
