import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../models/user.js';
import {randomUUID} from "crypto";
import {RequestWithUser} from "../middleware/auth";

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