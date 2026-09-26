import { create } from 'zustand';

export interface User {
    _id: string;
    username: string;
    displayName: string;
    email: string;
    avatar: string | null;
}

interface UserState {
    user: User | null;
    token: string | null;
    setUser: (user: User, token: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),

    setUser: (user, token) => {
        localStorage.setItem('token', token);

        set({
            user,
            token,
        });
    },

    logout: () => {
        localStorage.removeItem('token');

        set({
            user: null,
            token: null,
        });
    },
}));