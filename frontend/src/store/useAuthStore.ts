import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    subscription?: {
        plan: string;
        status: string;
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    fetchMe: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/login', credentials);
                    const { access_token, user } = response.data;
                    localStorage.setItem('token', access_token);
                    set({ user, token: access_token, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Login failed',
                        isLoading: false
                    });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/auth/register', userData);
                    const { access_token, user } = response.data;
                    localStorage.setItem('token', access_token);
                    set({ user, token: access_token, isAuthenticated: true, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Registration failed',
                        isLoading: false
                    });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
            },

            fetchMe: async () => {
                if (!localStorage.getItem('token')) return;
                try {
                    const response = await api.get('/users/profile');
                    set({ user: response.data, isAuthenticated: true });
                } catch (error) {
                    get().logout();
                }
            },

            updateProfile: async (updates) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.patch('/users/profile', updates);
                    set({ user: response.data, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.message || 'Update failed',
                        isLoading: false
                    });
                    throw error;
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);
