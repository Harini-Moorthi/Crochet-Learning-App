import { Request, Response } from 'express';
import db from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getAllPatterns = async (req: Request, res: Response) => {
  try {
    const { difficulty } = req.query;
    let query = 'SELECT p.*, u.name as created_by_name FROM patterns p LEFT JOIN users u ON p.created_by = u.id WHERE p.is_public = true';
    let params: any[] = [];
    
    if (difficulty) {
      query += ' AND p.difficulty = $1';
      params.push(difficulty);
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    const { rows } = await db.query(query, params);
    res.json({
      success: true,
      data: rows
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patterns',
      error: error.message
    });
  }
};

export const createPattern = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, difficulty, image_urls, yarn_weight, hook_size } = req.body;
    const userId = req.user?.userId;

    const { rows } = await db.query(
      'INSERT INTO patterns (title, description, difficulty, image_urls, yarn_weight, hook_size, created_by, is_public) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *',
      [title, description, difficulty, image_urls, yarn_weight, hook_size, userId]
    );

    res.status(201).json({
      success: true,
      message: 'Pattern created successfully',
      data: rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create pattern',
      error: error.message
    });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { patternId } = req.body;
    const userId = req.user?.userId;

    // Check if already favorited
    const { rows: existing } = await db.query(
      'SELECT * FROM user_favorites WHERE user_id = $1 AND pattern_id = $2',
      [userId, patternId]
    );

    if (existing.length > 0) {
      // Remove from favorites
      await db.query(
        'DELETE FROM user_favorites WHERE user_id = $1 AND pattern_id = $2',
        [userId, patternId]
      );
      return res.json({
        success: true,
        message: 'Pattern removed from favorites',
        favorited: false
      });
    } else {
      // Add to favorites
      await db.query(
        'INSERT INTO user_favorites (user_id, pattern_id) VALUES ($1, $2)',
        [userId, patternId]
      );
      return res.json({
        success: true,
        message: 'Pattern added to favorites',
        favorited: true
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite',
      error: error.message
    });
  }
};