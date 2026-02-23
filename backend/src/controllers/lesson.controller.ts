import { Request, Response } from 'express';
import db from '../config/db';

export const getCourseModules = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    
    const { rows: modules } = await db.query(`
      SELECT m.*, 
        (SELECT COUNT(*) FROM lessons l WHERE l.module_id = m.id) as lesson_count
      FROM modules m 
      WHERE m.course_id = $1 
      ORDER BY m.order_index
    `, [courseId]);

    // Get lessons for each module
    for (const module of modules) {
      const { rows: lessons } = await db.query(`
        SELECT * FROM lessons 
        WHERE module_id = $1 
        ORDER BY order_index
      `, [module.id]);
      module.lessons = lessons;
    }

    res.json({
      success: true,
      data: modules
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course modules',
      error: error.message
    });
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const { rows } = await db.query(`
      SELECT l.*, m.title as module_title, m.course_id, c.title as course_title
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      WHERE l.id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson',
      error: error.message
    });
  }
};