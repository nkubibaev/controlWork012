import {type ReactNode, useEffect, useState} from 'react';
import { getMe } from '../services/users';
import { useUserStore } from '../store/userStore';

interface AuthLoaderProps {
    children: ReactNode;
}

const AuthLoader = ({ children }: AuthLoaderProps) => {
    const token = useUserStore((state) => state.token);
    const setUser = useUserStore((state) => state.setUser);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const user = await getMe(token);
                setUser(user, token);
            } catch {
                useUserStore.getState().logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token, setUser]);

    if (loading) {
        return null;
    }

    return children;
};

export default AuthLoader;