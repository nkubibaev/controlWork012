import { type ChangeEvent, type SubmitEvent, useState } from 'react';
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const CreateRecipePage = () => {
    const navigate = useNavigate();
    const token = useUserStore((state) => state.token);
    const user = useUserStore((state) => state.user);
    const [title, setTitle] = useState('');
    const [recipe, setRecipe] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const imageChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);
        }
    };

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();
        setError('');

        if (!token || !user) {
            setError('Необходимо войти в аккаунт');
            return;
        }

        if (!title.trim() || !recipe.trim() || !image) {
            setError('Все поля обязательны');
            return;
        }

        const formData = new FormData();

        formData.append('title', title.trim());
        formData.append('recipe', recipe.trim());
        formData.append('image', image);

        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:8000/api/recipes',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                    body: formData,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || 'Не удалось создать рецепт',
                );
            }

            navigate(`/recipes/${data._id}`);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 5 }}>
            <Box
                component="form"
                onSubmit={submitHandler}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Typography variant="h4" component="h1">
                    Создать новый рецепт
                </Typography>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Название рецепта"
                    value={title}
                    onChange={(event) =>
                        setTitle(event.target.value)
                    }
                    required
                />
                <TextField
                    label="Рецепт"
                    value={recipe}
                    onChange={(event) =>
                        setRecipe(event.target.value)
                    }
                    multiline
                    minRows={8}
                    required
                />
                <Button
                    variant="outlined"
                    component="label"
                >
                    Выбрать изображение
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={imageChangeHandler}
                    />
                </Button>

                {image && (
                    <Typography color="text.secondary">
                        Выбрано: {image.name}
                    </Typography>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {loading
                        ? 'Создание...'
                        : 'Создать рецепт'}
                </Button>
            </Box>
        </Container>
    );
};

export default CreateRecipePage;