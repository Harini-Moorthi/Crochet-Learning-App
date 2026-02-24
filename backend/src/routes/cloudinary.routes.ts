import { Router } from 'express';
import { uploadImage, deleteImage } from '../controllers/cloudinary.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All upload routes require authentication
router.post('/upload', authenticateToken, uploadImage);
router.delete('/delete', authenticateToken, deleteImage);

export default router;
