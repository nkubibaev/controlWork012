import mongoose from 'mongoose';

export interface UserFields {
    username: string;
    displayName: string;
    email: string;
    password: string;
    avatar: string | null;
    googleId?: string;
    token: string | null;
}

const UserSchema = new mongoose.Schema<UserFields>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    googleId: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: null,
    },
});

export const User = mongoose.model<UserFields>('User', UserSchema);