import { type User } from '../store/userStore';

const API_URL = 'http://localhost:8000/api/users';

export const loginUser = async (
    email: string,
    password: string,
) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }

    return data as {
        message: string;
        user: User;
        token: string;
    };
};

export const googleLogin = async (
    credential: string,
) => {
    const response = await fetch(`${API_URL}/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            credential,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || 'Google login failed',
        );
    }

    return data as {
        message: string;
        user: User;
        token: string;
    };
};

export const registerUser = async (
    username: string,
    displayName: string,
    email: string,
    password: string,
) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            displayName,
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
    }

    return data as User;
};

export const getMe = async (token: string) => {
    const response = await fetch(`${API_URL}/me`, {
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
    }

    return data as User;
};

export const logoutUser = async (token: string) => {
    const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Logout failed');
    }

    return data;
};