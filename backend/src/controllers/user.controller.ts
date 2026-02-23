import { Request, Response } from 'express';
import db from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, email, role, avatar_url, bio, created_at FROM users WHERE id = $1',
      [req.user?.userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, avatar_url } = req.body;
    const { rows } = await db.query(
      'UPDATE users SET name = $1, bio = $2, avatar_url = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email, bio, avatar_url',
      [name, bio, avatar_url, req.user?.userId]
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};