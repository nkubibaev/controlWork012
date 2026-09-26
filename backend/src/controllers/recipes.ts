import { Request, Response } from 'express';
import { Recipe } from '../models/recipe.js';
import { RequestWithUser } from '../middleware/auth.js';

export const getRecipes = async (_req: Request, res: Response) => {
    try {
        const recipes = await Recipe.find()
            .populate('user', 'username displayName avatar')
            .sort({ createdAt: -1 });

        return res.json(recipes);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};

export const getRecipe = async (req: Request, res: Response) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('user', 'username displayName avatar');

        if (!recipe) {
            return res.status(404).json({
                error: 'Recipe not found',
            });
        }

        return res.json(recipe);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};

export const createRecipe = async (
    req: RequestWithUser,
    res: Response,
) => {
    try {
        const { title, recipe } = req.body;

        if (!title || !recipe || !req.file) {
            return res.status(400).json({
                error: 'All fields are required',
            });
        }

        const newRecipe = await Recipe.create({
            user: req.user!._id,
            title,
            recipe,
            image: `/uploads/recipes/${req.file.filename}`,
        });

        return res.status(201).json(newRecipe);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};

export const deleteRecipe = async (
    req: RequestWithUser,
    res: Response,
) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                error: 'Recipe not found',
            });
        }

        if (recipe.user.toString() !== req.user!._id.toString()) {
            return res.status(403).json({
                error: 'Not authorized',
            });
        }

        await recipe.deleteOne();

        return res.json({
            message: 'Recipe deleted',
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};