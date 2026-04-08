import { User } from '@/models/User';

export enum UserRole {
    Viewer = 0,
    User = 1,
    Admin = 2,
}

const parseRoleValue = (rawRole: unknown): UserRole | null => {
    if (typeof rawRole === 'number' && Number.isInteger(rawRole) && rawRole in UserRole) {
        return rawRole as UserRole;
    }

    if (typeof rawRole !== 'string') {
        return null;
    }

    const normalized = rawRole.trim();
    if (!normalized) {
        return null;
    }

    const numeric = Number(normalized);
    if (Number.isInteger(numeric) && numeric in UserRole) {
        return numeric as UserRole;
    }

    switch (normalized.toLowerCase()) {
        case 'viewer':
            return UserRole.Viewer;
        case 'user':
            return UserRole.User;
        case 'admin':
            return UserRole.Admin;
        default:
            return null;
    }
};

export const getUserRole = (user: User | null | undefined): UserRole | null => {
    if (!user) {
        return null;
    }

    return parseRoleValue(user.role ?? user.Role);
};

export const isViewerUser = (user: User | null | undefined): boolean => {
    return getUserRole(user) === UserRole.Viewer;
};
