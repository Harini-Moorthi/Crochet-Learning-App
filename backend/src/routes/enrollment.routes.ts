import { Router } from 'express';
import { enrollInCourse, getUserEnrollments } from '../controllers/enrollment.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
router.post('/', authenticateToken, enrollInCourse);
router.get('/my-courses', authenticateToken, getUserEnrollments);

export default router;