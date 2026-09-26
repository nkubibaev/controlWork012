import { type SubmitEvent, useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Divider,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipe, type Recipe } from '../services/recipes';
import { type Comment, createComment, deleteComment, getComments } from '../services/comments';
import { useUserStore } from '../store/userStore';

const RecipePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);
    const token = useUserStore((state) => state.token);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentError, setCommentError] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }

        const loadData = async () => {
            try {
                const [recipeData, commentsData] = await Promise.all([
                    getRecipe(id),
                    getComments(id),
                ]);

                setRecipe(recipeData);
                setComments(commentsData);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const submitComment = async (e: SubmitEvent) => {
        e.preventDefault();
        setCommentError('');

        if (!id || !token || !text.trim()) {
            return;
        }

        try {
            const comment = await createComment(
                id,
                text.trim(),
                token,
            );

            setComments((currentComments) => [
                ...currentComments,
                comment,
            ]);

            setText('');
        } catch (error) {
            if (error instanceof Error) {
                setCommentError(error.message);
            }
        }
    };

    const removeComment = async (commentId: string) => {
        if (!token) {
            return;
        }

        try {
            await deleteComment(commentId, token);

            setComments((currentComments) =>
                currentComments.filter(
                    (comment) => comment._id !== commentId,
                ),
            );
        } catch (error) {
            if (error instanceof Error) {
                setCommentError(error.message);
            }
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 5, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !recipe) {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">
                    {error || 'Recipe not found'}
                </Alert>
            </Container>
        );
    }

    const canDeleteComment = (comment: Comment) => {
        if (!user) {
            return false;
        }

        return (
            comment.user._id === user._id ||
            recipe.user._id === user._id
        );
    };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Card>
                <CardMedia
                    component="img"
                    image={`http://localhost:8000${recipe.image}`}
                    alt={recipe.title}
                    sx={{
                        maxHeight: 500,
                        objectFit: 'cover',
                    }}
                />
                <CardContent>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                    >
                        {recipe.title}
                    </Typography>
                    <Button
                        onClick={() =>
                            navigate(`/users/${recipe.user._id}`)
                        }
                        sx={{ mb: 3 }}
                    >
                        Автор: {recipe.user.displayName}
                    </Button>
                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: 'pre-line',
                            lineHeight: 1.8,
                        }}
                    >
                        {recipe.recipe}
                    </Typography>
                </CardContent>
            </Card>
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Комментарии
                </Typography>

                {commentError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {commentError}
                    </Alert>
                )}

                {user && token ? (
                    <Box
                        component="form"
                        onSubmit={submitComment}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mb: 4,
                        }}
                    >
                        <TextField
                            label="Ваш комментарий"
                            value={text}
                            onChange={(event) =>
                                setText(event.target.value)
                            }
                            multiline
                            minRows={3}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            Добавить комментарий
                        </Button>
                    </Box>
                ) : (
                    <Alert severity="info" sx={{ mb: 4 }}>
                        Чтобы оставить комментарий, войдите в аккаунт.
                    </Alert>
                )}

                {comments.length === 0 ? (
                    <Typography color="text.secondary">
                        Комментариев пока нет.
                    </Typography>
                ) : (
                    comments.map((comment) => (
                        <Box key={comment._id} sx={{ mb: 3 }}>
                            <Typography variant="subtitle1">
                                {comment.user.displayName}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{ mt: 1 }}
                            >
                                {comment.text}
                            </Typography>

                            {canDeleteComment(comment) && (
                                <Button
                                    color="error"
                                    size="small"
                                    onClick={() =>
                                        removeComment(comment._id)
                                    }
                                    sx={{ mt: 1 }}
                                >
                                    Удалить
                                </Button>
                            )}

                            <Divider sx={{ mt: 2 }} />
                        </Box>
                    ))
                )}
            </Box>
        </Container>
    );
};

export default RecipePage;