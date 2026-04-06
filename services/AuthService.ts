import { BaseService } from './BaseService';
import { LoginRequest } from '@/models/LoginRequest';
import { User } from '@/models/User';

class AuthService extends BaseService {
    constructor() {
        super('user'); // Appends '/user' to base URL
    }

    async login(credentials: LoginRequest): Promise<User> {
        return this.post<User>('/login?proyect=gms', credentials);
    }

    async logout(): Promise<void> {
        // Implement logout logic here, e.g., call an endpoint or clear local storage
        // If it's a server-side logout:
        // return this.post<void>('/logout', {});
        // For client-side only (token removal is handled in AuthContext usually), 
        // but if you need an API call:
        return Promise.resolve();
    }
    

    async register(userData: LoginRequest): Promise<User> {
        return this.post<User>('/register', userData);
    }

    async getCurrentUser(): Promise<User> {
        return this.get<User>('/me');
    }

    async checkUser(): Promise<boolean> {
        return this.get<boolean>('/CheckUser');
    }

}

export const authService = new AuthService();
