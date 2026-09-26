import { type SubmitEvent, useState } from 'react';
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser, googleLogin } from '../services/users';
import { useUserStore } from '../store/userStore';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const navigate = useNavigate();
    const setUser = useUserStore((state) => state.setUser);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = await loginUser(email, password);

            setUser(data.user, data.token);
            navigate('/');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    const googleSuccess = async (credential: string) => {
        setError('');

        try {
            const data = await googleLogin(credential);

            setUser(data.user, data.token);
            navigate('/');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={submitHandler}
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant="h4">
                    Вход
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <TextField
                    label="Пароль"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                >
                    Войти
                </Button>
                <Button
                    type="button"
                    onClick={() => navigate('/register')}
                >
                    Регистрация
                </Button>
                <GoogleLogin
                    onSuccess={(response) => {
                        if (response.credential) {
                            googleSuccess(response.credential);
                        }
                    }}
                    onError={() => {
                        setError('Не удалось войти через Google');
                    }}
                />
            </Box>
        </Container>
    );
};

export default LoginPage;