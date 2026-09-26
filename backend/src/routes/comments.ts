import { Router } from 'express';
import { createComment, deleteComment, getComments } from '../controllers/comments.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/recipe/:recipeId', getComments);
router.post('/recipe/:recipeId', auth, createComment);
router.delete('/:id', auth, deleteComment);

export default router;