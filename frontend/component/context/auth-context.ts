import React from "react";

class TokenManager {
    static ACCESS_TOKEN = 'access_token';
    static REFRESH_TOKEN = 'refresh_token';

    static accessToken: null | string = null;
    static refreshToken: null | string = null;

    /**
     * @param accessToken
     * @param refreshToken
     */
    static setTokens (accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        if(typeof window !== 'undefined') {
            sessionStorage.setItem('access_token', accessToken);
            if (refreshToken) {
               sessionStorage.setItem('refresh_token', refreshToken);
            }
        }
    }

    static getAccessToken () {
        if (this.accessToken) {
            return this.accessToken;
        }
        if (typeof window !== 'undefined') {
            this.accessToken = sessionStorage.getItem(this.ACCESS_TOKEN);
            return this.accessToken;
        }
        return null;
    }

    static getRefreshToken () {
        if (this.refreshToken) {
            return this.refreshToken;
        }
        if (typeof window !== 'undefined') {
            this.refreshToken = sessionStorage.getItem(this.REFRESH_TOKEN);
            return this.refreshToken;
        }
        return null;
    }

    static clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;

        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(this.ACCESS_TOKEN);
            sessionStorage.removeItem(this.REFRESH_TOKEN);
        }
    }
}

const authContext = React.createContext(null);

// export const AuthProvider ({children}) {
//
// }