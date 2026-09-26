export interface RecipeUser {
    _id: string;
    username: string;
    displayName: string;
    avatar: string | null;
}

export interface Recipe {
    _id: string;
    user: RecipeUser;
    title: string;
    recipe: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

const API_URL = 'http://localhost:8000/api';

export const getRecipes = async () => {
    const response = await fetch(`${API_URL}/recipes`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to load recipes');
    }

    return data as Recipe[];
};

export const getRecipe = async (id: string) => {
    const response = await fetch(`${API_URL}/recipes/${id}`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to load recipe');
    }

    return data as Recipe;
};

export const getRecipesByUser = async (userId: string) => {
    const response = await fetch(
        `${API_URL}/recipes?user=${userId}`,
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || 'Failed to load user recipes',
        );
    }

    return data as Recipe[];
};