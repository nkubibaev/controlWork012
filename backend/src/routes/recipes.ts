import { Router } from 'express';
import { createRecipe, deleteRecipe, getRecipe, getRecipes } from '../controllers/recipes.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', auth, createRecipe);
router.delete('/:id', auth, deleteRecipe);

export default router;