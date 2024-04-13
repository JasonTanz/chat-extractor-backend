import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import { size } from 'lodash';

// Configure multer storage and file name
const storage = multer.memoryStorage();

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Use multer upload instance & maximum 10 files
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Retrieve uploaded files
    const files = (req.files as Express.Multer.File[]) || [];
    const errors: string[] = [];

    if (size(files) === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Validate file types and sizes
    files?.forEach((file) => {
      const allowedTypes = ['text/plain'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      // If file type is not text/plain
      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      // If File size is greater than 5MB
      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Attach files to the request object
    req.body.files = files;

    // Proceed to the next middleware or route handler
    next();
  });
};

export default uploadMiddleware;
