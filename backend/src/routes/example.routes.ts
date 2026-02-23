import { Router } from 'express';
import { getServerTime, testDatabase } from '../controllers/example.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/time', getServerTime);
router.get('/test-db', testDatabase);

// Protected route
router.get('/protected', authenticateToken, (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    user: req.user
  });
});

export default router;