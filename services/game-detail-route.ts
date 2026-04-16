type GameRouteInput = {
    slug?: string | null;
};

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

export const getGameDetailHref = ({ slug }: GameRouteInput): string => {
    const normalized = normalizeSlug(slug);
    return `/game?slug=${encodeURIComponent(normalized || 'replaced')}`;
};
