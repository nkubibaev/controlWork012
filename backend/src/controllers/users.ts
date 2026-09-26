import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/user.js';
import {randomUUID} from "crypto";
import {RequestWithUser} from "../middleware/auth";
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = '723403873149-8pu77hu0nsmsgv5fg15nk3b9sgn5ku56.apps.googleusercontent.com';
const googleClient = new OAuth2Client( GOOGLE_CLIENT_ID);

export const register = async (req: Request, res: Response) => {
    try {
        const { username, displayName, email, password } = req.body;

        if (!username || !displayName || !email || !password) {
            return res.status(400).json({
                error: 'All fields are required',
            });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'Username or email already exists',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            displayName,
            email,
            password: hashedPassword,
            avatar: null,
            token: null,
        });

        return res.status(201).json({
            _id: user._id,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            avatar: user.avatar,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required',
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: 'Email or password is incorrect',
            });
        }

        if (!user.password) {
            return res.status(401).json({
                error: 'Invalid email or password',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password,
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                error: 'Email or password is incorrect',
            });
        }

        const token = randomUUID();

        user.token = token;

        await user.save();

        return res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                avatar: user.avatar,
            },
            token,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};

export const logout = async (
    req: RequestWithUser,
    res: Response,
) => {
    try {
        req.user!.token = null;

        await req.user!.save();

        return res.json({
            message: 'Logout successful',
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};

export const getMe = async (
    req: RequestWithUser,
    res: Response,
) => {
    return res.json({
        _id: req.user!._id,
        username: req.user!.username,
        displayName: req.user!.displayName,
        email: req.user!.email,
        avatar: req.user!.avatar,
    });
};

export const googleLogin = async (
    req: Request,
    res: Response,
) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                error: 'Google credential is required',
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.sub || !payload.email) {
            return res.status(400).json({
                error: 'Invalid Google credential',
            });
        }

        let user = await User.findOne({
            googleId: payload.sub,
        });

        if (!user) {
            user = await User.findOne({
                email: payload.email,
            });
        }

        if (!user) {
            user = await User.create({
                username: payload.email.split('@')[0],
                displayName: payload.name || payload.email,
                email: payload.email,
                password: null,
                avatar: payload.picture || null,
                googleId: payload.sub,
                token: null,
            });
        }

        const token = randomUUID();

        user.token = token;

        if (!user.googleId) {
            user.googleId = payload.sub;
        }

        if (!user.avatar && payload.picture) {
            user.avatar = payload.picture;
        }

        await user.save();

        return res.json({
            message: 'Google login successful',
            user: {
                _id: user._id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                avatar: user.avatar,
            },
            token,
        });
    } catch (error) {
        console.error('Google login error:', error);

        return res.status(401).json({
            error: 'Invalid Google credential',
        });
    }
};