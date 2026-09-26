import mongoose from 'mongoose';

export interface RecipeFields {
    user: mongoose.Types.ObjectId;
    title: string;
    recipe: string;
    image: string;
}

const RecipeSchema = new mongoose.Schema<RecipeFields>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        recipe: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Recipe = mongoose.model<RecipeFields>('Recipe', RecipeSchema);