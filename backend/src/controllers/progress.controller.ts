import { Request, Response } from 'express';
import db from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const updateLessonProgress = async (req: AuthRequest, res: Response) => {
  try {
    // Handle both lessonId and lesson_id for compatibility
    const { lessonId, lesson_id, progressPercentage, completed } = req.body;
    const userId = req.user?.userId;
    
    const finalLessonId = lessonId || lesson_id;
    
    if (!finalLessonId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Lesson ID and user ID are required'
      });
    }

    console.log('Updating progress:', { userId, lessonId: finalLessonId, completed });

    const { rows } = await db.query(`
      INSERT INTO user_progress (user_id, lesson_id, progress_percentage, completed, completed_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, lesson_id) 
      DO UPDATE SET 
        progress_percentage = $3,
        completed = $4,
        completed_at = $5,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [userId, finalLessonId, progressPercentage, completed, completed ? new Date() : null]);

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: rows[0]
    });
  } catch (error: any) {
    console.error('Progress update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message
    });
  }
};

export const getCourseProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.userId;

    const { rows } = await db.query(`
      SELECT up.*, l.title as lesson_title, l.order_index, m.title as module_title
      FROM user_progress up
      JOIN lessons l ON up.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      WHERE up.user_id = $1 AND c.id = $2
      ORDER BY m.order_index, l.order_index
    `, [userId, courseId]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress',
      error: error.message
    });
  }
};