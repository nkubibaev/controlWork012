import { useEffect, useState } from 'react';
import {
    Alert,
    Avatar, Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipesByUser, type Recipe } from '../services/recipes';
import {useUserStore} from "../store/userStore.ts";
import { deleteRecipe } from '../services/recipes';

const UserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }

        const loadRecipes = async () => {
            try {
                const data = await getRecipesByUser(id);
                setRecipes(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        loadRecipes();
    }, [id]);

    if (loading) {
        return (
            <Container sx={{ mt: 5, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    const author = recipes[0]?.user;
    const isOwnPage = currentUser?._id === id;

    return (
        <Container sx={{ py: 5 }}>
            {author && (
                <Card sx={{ mb: 4 }}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Avatar
                            src={
                                author.avatar
                                    ? `http://localhost:8000${author.avatar}`
                                    : ''
                            }
                        >
                            {author.displayName[0]}
                        </Avatar>
                        <Typography variant="h4">
                            {author.displayName}
                        </Typography>
                    </CardContent>
                </Card>
            )}
            {isOwnPage && (
                <Button
                    variant="contained"
                    onClick={() => navigate('/recipes/create')}
                    sx={{ mb: 3 }}
                >
                    Создать новый рецепт
                </Button>
            )}
            <Typography
                variant="h4"
                component="h1"
                sx={{ mb: 4 }}
            >
                Рецепты автора
            </Typography>

            {recipes.length === 0 ? (
                <Typography color="text.secondary">
                    У этого пользователя пока нет рецептов.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {recipes.map((recipe) => (
                        <Grid
                            key={recipe._id}
                            size={{ xs: 12, sm: 6, md: 4 }}
                        >
                            <Card>
                                <CardActionArea
                                    onClick={() =>
                                        navigate(`/recipes/${recipe._id}`)
                                    }
                                >
                                    <CardMedia
                                        component="img"
                                        height="220"
                                        image={`http://localhost:8000${recipe.image}`}
                                        alt={recipe.title}
                                    />

                                    <CardContent>
                                        <Typography
                                            variant="h5"
                                            component="h2"
                                        >
                                            {recipe.title}
                                        </Typography>

                                        {isOwnPage && token && (
                                            <Button
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteRecipe(recipe._id, token)
                                                        .then(() => {
                                                            setRecipes((currentRecipes) =>
                                                                currentRecipes.filter(
                                                                    (item) => item._id !== recipe._id,
                                                                ),
                                                            );
                                                        })
                                                        .catch((error) => {
                                                            if (error instanceof Error) {
                                                                setError(error.message);
                                                            }
                                                        });
                                                }}
                                                sx={{ mt: 2 }}
                                            >
                                                Удалить
                                            </Button>
                                        )}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default UserPage;