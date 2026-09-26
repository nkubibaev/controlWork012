import { NextFunction, Request, Response } from 'express';
import { User } from '../models/user.js';

export interface RequestWithUser extends Request {
    user?: Awaited<ReturnType<typeof User.findOne>>;
}

export const auth = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authorization = req.get('Authorization');

        if (!authorization) {
            return res.status(401).json({
                error: 'Unauthenticated',
            });
        }

        const [type, token] = authorization.split(' ');

        if (type !== 'Token' || !token) {
            return res.status(401).json({
                error: 'Unauthenticated',
            });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                error: 'Unauthenticated',
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: 'Internal server error',
        });
    }
};