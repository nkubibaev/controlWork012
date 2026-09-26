import { Router } from 'express';
import { createRecipe, deleteRecipe, getRecipe, getRecipes } from '../controllers/recipes.js';
import { auth } from '../middleware/auth.js';
import {upload} from "../middleware/upload";

const router = Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', auth, upload.single('image'), createRecipe);
router.delete('/:id', auth, deleteRecipe);

export default router;