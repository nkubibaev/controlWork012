import { Request, Response } from 'express';
import { Comment } from '../models/comment.js';
import { Recipe } from '../models/recipe.js';
import { RequestWithUser } from '../middleware/auth.js';

export const getComments = async (
    req: Request,
    res: Response,
) => {
    try {
        const comments = await Comment.find({
            recipe: req.params.recipeId,
        })
            .populate('user', 'username displayName avatar')
            .sort({ createdAt: 1 });

        return res.json(comments);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};

export const createComment = async (
    req: RequestWithUser,
    res: Response,
) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                error: 'Comment text is required',
            });
        }

        const recipe = await Recipe.findById(req.params.recipeId);

        if (!recipe) {
            return res.status(404).json({
                error: 'Recipe not found',
            });
        }

        const comment = await Comment.create({
            user: req.user!._id,
            recipe: recipe._id,
            text,
        });

        await comment.populate(
            'user',
            'username displayName avatar',
        );

        return res.status(201).json(comment);
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};

export const deleteComment = async (
    req: RequestWithUser,
    res: Response,
) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                error: 'Comment not found',
            });
        }

        const recipe = await Recipe.findById(comment.recipe);

        if (!recipe) {
            return res.status(404).json({
                error: 'Recipe not found',
            });
        }

        const isCommentAuthor =
            comment.user.toString() === req.user!._id.toString();

        const isRecipeOwner =
            recipe.user.toString() === req.user!._id.toString();

        if (!isCommentAuthor && !isRecipeOwner) {
            return res.status(403).json({
                error: 'Not authorized',
            });
        }

        await comment.deleteOne();

        return res.json({
            message: 'Comment deleted',
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};