export const DAILY_LIMIT_ERROR_MESSAGE = 'Has alcanzado el límite diario de 150 peticiones a la API de juegos. Vuelve mañana o cree una cuenta nueva.';

const parseMessageFromJson = (value: unknown): string | null => {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const candidate = value as Record<string, unknown>;

    if (typeof candidate.message === 'string' && candidate.message.trim()) {
        return candidate.message.trim();
    }

    if (typeof candidate.error === 'string' && candidate.error.trim()) {
        return candidate.error.trim();
    }

    if (typeof candidate.title === 'string' && candidate.title.trim()) {
        return candidate.title.trim();
    }

    return null;
};

export const extractMessageFromApiBody = (body: string): string | null => {
    const trimmedBody = body.trim();
    if (!trimmedBody) {
        return null;
    }

    try {
        const parsed = JSON.parse(trimmedBody);
        return parseMessageFromJson(parsed) || trimmedBody;
    } catch {
        return trimmedBody;
    }
};

export const extractErrorMessage = (error: unknown, fallback: string): string => {
    if (error && typeof error === 'object') {
        const candidate = error as Record<string, unknown>;
        if (typeof candidate.message === 'string' && candidate.message.trim()) {
            const extracted = extractMessageFromApiBody(candidate.message);
            return extracted || candidate.message.trim();
        }

        if (typeof candidate.error === 'string' && candidate.error.trim()) {
            return candidate.error.trim();
        }
    }

    if (typeof error === 'string' && error.trim()) {
        return extractMessageFromApiBody(error) || error.trim();
    }

    return fallback;
};

export const isDailyLimitErrorMessage = (message: string): boolean => {
    const normalized = message.trim();
    if (!normalized) {
        return false;
    }

    return normalized.includes(DAILY_LIMIT_ERROR_MESSAGE);
};