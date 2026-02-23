import { Request, Response } from 'express';
import db from '../config/db';

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT c.*, cat.name as category_name 
      FROM courses c 
      LEFT JOIN categories cat ON c.category_id = cat.id 
      WHERE c.is_published = true 
      ORDER BY c.created_at DESC
    `);
    res.json({
      success: true,
      data: rows
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT c.*, cat.name as category_name 
      FROM courses c 
      LEFT JOIN categories cat ON c.category_id = cat.id 
      WHERE c.id = $1 AND c.is_published = true
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
      error: error.message
    });
  }
};