import { useEffect, useState } from 'react';
import {
    Alert,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRecipes, type Recipe } from '../services/recipes';

const HomePage = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const data = await getRecipes();
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
    }, []);

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

    return (
        <Container sx={{ py: 5 }}>
            <Typography
                variant="h3"
                component="h1"
                sx={{ mb: 4 }}
            >
                Рецепты
            </Typography>
            <Grid container spacing={3}>
                {recipes.map((recipe) => (
                    <Grid key={recipe._id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card>
                            <CardActionArea
                                onClick={() => navigate(`/recipes/${recipe._id}`)}
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
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mt: 1 }}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            navigate(`/users/${recipe.user._id}`);
                                        }}
                                    >
                                        Автор: {recipe.user.displayName}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HomePage;