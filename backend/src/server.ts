import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import usersRouter from './routes/users.js';

const app = express();

const PORT = 8000;
const MONGO_URL = 'mongodb://127.0.0.1:27017/recipe-book';

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);

const run = async () => {
    await mongoose.connect(MONGO_URL);

    console.log('MongoDB connected');

    app.listen(PORT, () => {
        console.log(`Server started on port :${PORT}`);
    });
};

run().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});