import { loginReqParams, registerReqParams } from "@/type/auth.type";
import { apiRequest, ApiResponse } from "@/api";

export function setAccessToken(token: string | null) {
    if (typeof window !== 'undefined') {
        if (token) {
            sessionStorage.setItem('accessToken', token);
        } else {
            sessionStorage.removeItem('accessToken');
        }
    }
    return token;
}

export async function login({ email, password }: loginReqParams): Promise<ApiResponse> {
    const hashLoginParams = btoa(`${email}:${password}`);

    return apiRequest('/auth/login', {
        method: 'POST',
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${hashLoginParams}`,
        },
    });
}

export async function register({ email, password, nickname }: registerReqParams): Promise<ApiResponse> {
    const hashLoginParams = btoa(`${email}:${password}`);

    return apiRequest('/auth/register', {
        method: 'POST',
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${hashLoginParams}`
        },
        body: JSON.stringify({
            nickname,
        })
    });
}

export async function refreshToken(): Promise<ApiResponse> {
    return apiRequest('/auth/refresh', {
        method: 'POST',
    });
}