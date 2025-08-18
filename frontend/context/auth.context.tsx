'use client';

import React, { ReactNode, useContext, useEffect, useState, useCallback } from "react";

import { UserType } from "@/type/user.type";
import { TokenManager } from "@/util/TokenManager";
import { login as authLogin, findUserByEmail } from "@/api/auth/auth";

export interface AuthContextType {
    user: UserType | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
    tokenManager: TokenManager;
}

const authContext = React.createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
    const context = useContext(authContext);

    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }

    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const tokenManager = TokenManager.getInstance('http://localhost:3000');

    const loadUserProfile = useCallback(async () => {
        try {
            const token = tokenManager.getAccessToken();
            if (!token) return;

            const response = await tokenManager.authenticatedRequest('/auth/profile');
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                tokenManager.clearToken();
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to load user profile:', error);
            tokenManager.clearToken();
            setUser(null);
        }
    }, [tokenManager]);

    const initializeAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = tokenManager.getAccessToken();
            if (token) {
                await loadUserProfile();
            }
        } catch (error) {
            console.error('Auth initialization failed:', error);
        } finally {
            setIsLoading(false);
            setIsInitialized(true);
        }
    }, [tokenManager, loadUserProfile]);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const result = await authLogin({ email, password });
            
            if (result.ok && result.data?.accessToken) {
                tokenManager.setAccessToken(result.data.accessToken);
                
                const userResult = await findUserByEmail(email);
                if (userResult.ok) {
                    setUser(userResult.data);
                }
                
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setIsLoading(true);
        try {
            await tokenManager.request('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            tokenManager.clearToken();
            setUser(null);
            setIsLoading(false);
        }
    };

    const refreshToken = async (): Promise<boolean> => {
        try {
            const success = await tokenManager.refreshToken();
            if (success) {
                await loadUserProfile();
            } else {
                setUser(null);
            }
            return success;
        } catch (error) {
            console.error('Token refresh failed:', error);
            setUser(null);
            return false;
        }
    };

    const isAuthenticated = !!user && tokenManager.hasToken();

    const contextValue: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshToken,
        tokenManager,
    };

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    return (
        <authContext.Provider value={contextValue}>
            {children}
        </authContext.Provider>
    );
};