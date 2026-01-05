import { useState, useEffect } from 'react';
import { authService } from '../services/localStorage.service';
import type { User, AuthResponse } from '../types';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const user = authService.getCurrentUser();
        console.log('useAuth: Initial user check:', user?.email || 'No user');
        setCurrentUser(user);
        setIsLoading(false);
    }, []);

    const register = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): AuthResponse => {
        console.log('useAuth: Registering user:', userData.email);
        const response = authService.register(userData);
        if (response.success && response.user) {
            console.log('useAuth: Registration successful, user:', response.user.email);
            setCurrentUser(response.user);
        }
        return response;
    };

    const login = (email: string, password: string): AuthResponse => {
        console.log('useAuth: Attempting login for:', email);
        const response = authService.login(email, password);
        if (response.success && response.user) {
            console.log('useAuth: Login successful, user:', response.user.email, 'type:', response.user.userType);
            setCurrentUser(response.user);
        } else {
            console.error('useAuth: Login failed:', response.message);
        }
        return response;
    };

    const logout = () => {
        console.log('useAuth: Logging out');
        authService.logout();
        setCurrentUser(null);
    };

    // Compute isAuthenticated based on currentUser state (reactive)
    const isAuthenticated = currentUser !== null;

    return {
        currentUser,
        isLoading,
        isAuthenticated,
        register,
        login,
        logout
    };
};
