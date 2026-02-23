import { Router } from 'express';
import { getAllPatterns, createPattern, toggleFavorite } from '../controllers/pattern.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.get('/', getAllPatterns);
router.post('/', authenticateToken, createPattern);
router.post('/favorite', authenticateToken, toggleFavorite);

export default router;
export { router };