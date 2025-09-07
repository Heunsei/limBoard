const API_BASE_URL = `http://${process.env.NEXT_PUBLIC_API_URL}`;

export interface ApiResponse<T = any> {
    ok: boolean;
    status: number;
    data?: T;
    error?: string;
}

export function getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem('accessToken');
    }
    return null;
}

export function getAuthHeaders(): Record<string, string> {
    const accessToken = getAccessToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return headers;
}

export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            credentials: 'include',
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers,
            },
        });

        const data = await response.json();

        return {
            ok: response.ok,
            status: response.status,
            data,
        };
    } catch (error) {
        return {
            ok: false,
            status: 0,
            error: error instanceof Error ? error.message : 'API 요청 중 오류가 발생했습니다',
        };
    }
}