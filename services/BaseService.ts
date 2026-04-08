import { getBaseUrl } from './config';
import { extractMessageFromApiBody } from './api-error';

export class BaseService {
    private baseUrl: string;

    constructor(endpoint: string, baseUrl?: string) {
        this.baseUrl = baseUrl ? `${baseUrl}${endpoint}` : `${getBaseUrl()}/${endpoint}`;
    }

    protected async get<T>(path: string = ''): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    protected async post<T>(path: string = '', body: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    protected async put<T>(path: string = '', body: any): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    }

    protected async delete<T>(path: string = ''): Promise<T> {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'X-Tracking-Sensitive-Consent': 'accepted',
        };
        
        // Add auth token if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    }

    protected async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
            const parsedErrorMessage = extractMessageFromApiBody(errorText);
            const error = new Error(parsedErrorMessage || `API Error: ${response.status}`) as Error & { status?: number; rawBody?: string };
            error.status = response.status;
            error.rawBody = errorText;
            throw error;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
             return response.json();
        }
        
        // Handle text/plain or other types
        return response.text() as unknown as T;
    }
}
