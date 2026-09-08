import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodType } from 'zod';
import { AppError } from './error.middleware.js';

export type ValidationSource = 'body' | 'params' | 'query';

interface ValidationErrorDetail {
  path: string;
  message: string;
  code: string;
}

/**
 * Validates and normalizes a request source before the controller runs.
 * Parsed values are written back so trimming, coercion and defaults are
 * consistently reflected in the service layer.
 */
export const validateRequest = (
  schema: ZodType<Record<string, unknown>>,
  source: ValidationSource = 'body'
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const validationErrors: ValidationErrorDetail[] = result.error.issues.map((issue) => ({
        path: issue.path.join('.') || source,
        message: issue.message,
        code: issue.code,
      }));

      next(new AppError('Request validation failed.', 400, { validationErrors }));
      return;
    }

    if (source === 'body') {
      req.body = result.data;
    } else {
      const destination = req[source] as Record<string, unknown>;
      for (const key of Object.keys(destination)) {
        delete destination[key];
      }
      Object.assign(destination, result.data);
    }

    next();
  };
};
