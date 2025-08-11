class TokenManager {
    static ACCESS_TOKEN = 'access_token';
    static REFRESH_TOKEN = 'refresh_token';

    static accessToken = null;
    static refreshToken = null;

    /**
     * @param accessToken
     * @param refreshToken
     */
    static setTokens (accessToken, refreshToken) {
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
}