export class TokenManager {
    private static instance: TokenManager;
    private accessToken: string | null = null;
    private refreshTokenEndpoint: string;
    private baseURL: string;

    private constructor(baseURL: string, refreshTokenEndpoint: string = '/auth/refresh') {
        this.baseURL = baseURL;
        this.refreshTokenEndpoint = refreshTokenEndpoint;
        this.loadTokenFromStorage();
    }

    public static getInstance(baseURL?: string): TokenManager {
        if (!TokenManager.instance && baseURL) {
            TokenManager.instance = new TokenManager(baseURL);
        }
        return TokenManager.instance;
    }

    private loadTokenFromStorage(): void {
        if (typeof window !== 'undefined') {
            this.accessToken = sessionStorage.getItem('accessToken');
        }
    }

    public setAccessToken(token: string | null): void {
        this.accessToken = token;

        if (typeof window !== 'undefined') {
            if (token) {
                sessionStorage.setItem('accessToken', token);
            } else {
                sessionStorage.removeItem('accessToken');
            }
        }
    }

    public getAccessToken(): string | null {
        return this.accessToken;
    }

    public hasToken(): boolean {
        return !!this.accessToken;
    }

    public async refreshToken(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseURL}${this.refreshTokenEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Token refresh failed: ${response.status}`);
            }

            const data = await response.json();
            const { accessToken: newAccessToken } = data;

            if (newAccessToken) {
                this.setAccessToken(newAccessToken);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearToken();
            return false;
        }
    }

    public clearToken(): void {
        this.setAccessToken(null);
    }

    public getAuthHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.accessToken) {
            headers.Authorization = `Bearer ${this.accessToken}`;
        }

        return headers;
    }

    public async authenticatedRequest(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getAuthHeaders(),
                ...options.headers,
            },
            credentials: 'include',
        };

        let response = await fetch(url, config);

        if (response.status === 401 && this.hasToken()) {
            const refreshSuccess = await this.refreshToken();

            if (refreshSuccess) {
                config.headers = {
                    ...this.getAuthHeaders(),
                    ...options.headers,
                };

                response = await fetch(url, config);
            }
        }

        return response;
    }

    public async request(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
        };

        return fetch(url, config);
    }
}