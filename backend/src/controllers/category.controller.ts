import { Request, Response } from 'express';
import db from '../config/db';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY name');
    res.json({
      success: true,
      data: rows
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};