import { type RecipeUser } from './recipes';

export interface Comment {
    _id: string;
    user: RecipeUser;
    recipe: string;
    text: string;
    createdAt: string;
    updatedAt: string;
}

const API_URL = 'http://localhost:8000/api';

export const getComments = async (recipeId: string) => {
    const response = await fetch(
        `${API_URL}/comments/recipe/${recipeId}`,
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to load comments');
    }

    return data as Comment[];
};

export const createComment = async (
    recipeId: string,
    text: string,
    token: string,
) => {
    const response = await fetch(
        `${API_URL}/comments/recipe/${recipeId}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
                text,
            }),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to create comment');
    }

    return data as Comment;
};

export const deleteComment = async (
    commentId: string,
    token: string,
) => {
    const response = await fetch(
        `${API_URL}/comments/${commentId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Token ${token}`,
            },
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to delete comment');
    }

    return data;
};