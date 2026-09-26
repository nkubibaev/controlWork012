import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {User} from "./models/user";
import bcrypt from 'bcrypt';

const app = express();

const PORT = 8000;
const MONGO_URL = 'mongodb://127.0.0.1:27017/recipe-book';

app.use(cors());
app.use(express.json());

app.get('/api', (_req, res) => {
    res.json({
        message: 'Recipe Book API',
    });
});

const run = async () => {
    await mongoose.connect(MONGO_URL);

    console.log('MongoDB connected');

    app.listen(PORT, () => {
        console.log(`Server started on port :${PORT}`);
    });
};

app.post('/api/users', async (req, res) => {
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
});

run().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});