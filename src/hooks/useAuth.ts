import { useState, useEffect } from 'react';
import { authService } from '../services/localStorage.service';
import type { User, AuthResponse } from '../types';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        setIsLoading(false);
    }, []);

    const register = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): AuthResponse => {
        const response = authService.register(userData);
        if (response.success && response.user) {
            setCurrentUser(response.user);
        }
        return response;
    };

    const login = (email: string, password: string): AuthResponse => {
        const response = authService.login(email, password);
        if (response.success && response.user) {
            setCurrentUser(response.user);
        }
        return response;
    };

    const logout = () => {
        authService.logout();
        setCurrentUser(null);
    };

    const isAuthenticated = (): boolean => {
        return currentUser !== null;
    };

    return {
        currentUser,
        isLoading,
        isAuthenticated: isAuthenticated(),
        register,
        login,
        logout
    };
};
