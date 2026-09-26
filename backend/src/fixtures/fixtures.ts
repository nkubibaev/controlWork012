import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User } from '../models/user.js';
import { Recipe } from '../models/recipe.js';

const MONGO_URL = 'mongodb://127.0.0.1:27017/recipe-book';

const run = async () => {
    await mongoose.connect(MONGO_URL);

    await User.deleteMany({});
    await Recipe.deleteMany({});

    const password = await bcrypt.hash('123456', 10);

    const user1 = await User.create({
        username: 'john',
        displayName: 'John Smith',
        email: 'john@gmail.com',
        password,
        avatar: null,
        token: null,
    });

    const user2 = await User.create({
        username: 'anna',
        displayName: 'Anna Brown',
        email: 'anna@gmail.com',
        password,
        avatar: null,
        token: null,
    });

    await Recipe.create([
        {
            user: user1._id,
            title: 'Pasta Carbonara',
            recipe: 'Boil the pasta. Fry the bacon. Add eggs and cheese, then mix everything together.',
            image: '/uploads/recipes/pasta.jpeg',
        },
        {
            user: user1._id,
            title: 'Chicken Soup',
            recipe: 'Cook the chicken with vegetables until everything is ready.',
            image: '/uploads/recipes/soup.jpeg',
        },
        {
            user: user2._id,
            title: 'Apple Pie',
            recipe: 'Prepare the dough, add apples and bake until golden brown.',
            image: '/uploads/recipes/apple-pie.jpeg',
        },
    ]);

    console.log('Fixtures created');

    await mongoose.disconnect();
};

run().catch(async (error) => {
    console.error('Fixture error:', error);
    await mongoose.disconnect();
    process.exit(1);
});