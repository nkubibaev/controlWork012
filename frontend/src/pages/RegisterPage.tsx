import { type SubmitEvent, useState } from 'react';
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/users';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();
        setError('');

        try {
            await registerUser(
                username,
                displayName,
                email,
                password,
            );

            navigate('/login');
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
                    Регистрация
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    label="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                />
                <TextField
                    label="Имя"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    required
                />
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
                    Зарегистрироваться
                </Button>
                <Button
                    type="button"
                    onClick={() => navigate('/login')}
                >
                    Уже есть аккаунт?
                </Button>
            </Box>
        </Container>
    );
};

export default RegisterPage;