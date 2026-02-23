import { Router } from 'express';
import { getCourseModules, getLessonById } from '../controllers/lesson.controller';

const router = Router();
router.get('/course/:courseId/modules', getCourseModules);
router.get('/:id', getLessonById);

export default router;