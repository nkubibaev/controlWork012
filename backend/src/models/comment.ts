import mongoose from 'mongoose';

export interface CommentFields {
    user: mongoose.Types.ObjectId;
    recipe: mongoose.Types.ObjectId;
    text: string;
}

const CommentSchema = new mongoose.Schema<CommentFields>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Comment = mongoose.model<CommentFields>(
    'Comment',
    CommentSchema,
);