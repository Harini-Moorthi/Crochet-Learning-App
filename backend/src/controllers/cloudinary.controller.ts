import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dr8dpzvmf',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret'
});

export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    const { file } = req.body;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided. Please provide a base64 encoded image string.'
      });
    }

    // Validate that file is a base64 string
    if (typeof file !== 'string' || !file.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Please provide a base64 encoded image.'
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: 'courses',
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' }
      ]
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response) => {
  try {
    const { publicId } = req.body;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'No public ID provided'
      });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: 'Image deleted successfully',
      result: result
    });

  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
};
