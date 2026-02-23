import { Router } from 'express';
import { updateLessonProgress, getCourseProgress } from '../controllers/progress.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.post('/', authenticateToken, updateLessonProgress);
router.get('/course/:courseId', authenticateToken, getCourseProgress);

export default router;