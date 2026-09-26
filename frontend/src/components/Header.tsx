import { useState, type MouseEvent } from 'react';
import { AppBar, Avatar, Box, Button, Container, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/users';
import { useUserStore } from '../store/userStore';

const Header = () => {
    const navigate = useNavigate();

    const user = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);
    const logout = useUserStore((state) => state.logout);

    const [anchorEl, setAnchorEl] =
        useState<null | HTMLElement>(null);

    const openMenu = (e: MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const logoutHandler = async () => {
        if (token) {
            await logoutUser(token);
        }

        logout();
        closeMenu();
        navigate('/');
    };

    return (
        <AppBar position="static">
            <Container>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        component="button"
                        onClick={() => navigate('/')}
                        sx={{
                            color: 'inherit',
                            background: 'none',
                            border: 0,
                            cursor: 'pointer',
                            font: 'inherit',
                        }}
                    >
                        Recipe Book
                    </Typography>

                    {user ? (
                        <Box>
                            <Button
                                color="inherit"
                                onClick={openMenu}
                                startIcon={
                                    <Avatar
                                        src={
                                            user.avatar
                                                ? `http://localhost:8000${user.avatar}`
                                                : ''
                                        }
                                        sx={{ width: 32, height: 32 }}
                                    >
                                        {user.displayName[0]}
                                    </Avatar>
                                }
                            >
                                {user.displayName}
                            </Button>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={closeMenu}
                            >
                                <MenuItem
                                    onClick={() => {
                                        closeMenu();
                                        navigate(`/users/${user._id}`);
                                    }}
                                >
                                    Мои рецепты
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        closeMenu();
                                        navigate('/recipes/create');
                                    }}
                                >
                                    Создать новый рецепт
                                </MenuItem>

                                <MenuItem onClick={logoutHandler}>
                                    Выйти
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box>
                            <Button
                                color="inherit"
                                onClick={() => navigate('/login')}
                            >
                                Войти
                            </Button>

                            <Button
                                color="inherit"
                                onClick={() => navigate('/register')}
                            >
                                Регистрация
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;