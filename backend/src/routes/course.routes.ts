import { Router } from 'express';
import { getAllCourses, getCourseById } from '../controllers/course.controller';

const router = Router();
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

export default router;