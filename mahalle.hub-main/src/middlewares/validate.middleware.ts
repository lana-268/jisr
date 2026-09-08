import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware.js';

export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing: string[] = [];
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return next(
        new AppError(
          `Missing required fields: ${missing.join(', ')}`,
          400,
          { missingFields: missing }
        )
      );
    }

    next();
  };
};
