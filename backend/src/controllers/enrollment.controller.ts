import { Request, Response } from 'express';
import db from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { course_id, courseId } = req.body;
    const userId = req.user?.userId;
    
    // Handle both course_id and courseId for compatibility
    const finalCourseId = course_id || courseId;

    if (!finalCourseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    console.log('Enrolling user:', userId, 'in course:', finalCourseId);

    // Check if already enrolled
    const { rows: existingEnrollment } = await db.query(
      'SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [userId, finalCourseId]
    );

    console.log('Existing enrollments found:', existingEnrollment.length);
    console.log('Existing enrollment details:', existingEnrollment);

    if (existingEnrollment.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const { rows } = await db.query(
      'INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *',
      [userId, finalCourseId]
    );

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: rows[0]
    });
  } catch (error: any) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: error.message
    });
  }
};

export const getUserEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT e.*, c.title, c.thumbnail_url, c.level, cat.name as category_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE e.user_id = $1
      ORDER BY e.enrolled_at DESC
    `, [req.user?.userId]);

    res.json({
      success: true,
      data: rows
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message
    });
  }
};