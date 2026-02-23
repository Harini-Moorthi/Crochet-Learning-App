import { Request, Response } from 'express';
import * as exampleModel from '../models/example.model';
import * as userModel from '../models/user.model';

export const getServerTime = async (req: Request, res: Response) => {
  try {
    const time = await exampleModel.getCurrentTime();
    res.json({ 
      success: true,
      message: 'Server time retrieved successfully',
      data: { time }
    });
  } catch (error) {
    console.error('Error getting server time:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get server time'
    });
  }
};

export const testDatabase = async (req: Request, res: Response) => {
  try {
    const result = await userModel.testConnection();
    res.json({ 
      success: true,
      message: 'Database connection successful',
      data: result
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
};