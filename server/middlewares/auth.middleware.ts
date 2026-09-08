import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase.js';
import { AuthUser, UserRole, AdminType } from '../types/index.js';
import { AppError } from './error.middleware.js';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Resolves user role and admin type from Firestore if not specified in dev claims
 */
async function resolveUserProfile(uid: string): Promise<{ role: UserRole; adminType?: AdminType } | null> {
  // Check admin first
  const adminDoc = await db.collection('admins').doc(uid).get();
  if (adminDoc.exists) {
    const data = adminDoc.data();
    return { role: 'ADMIN', adminType: data.adminType as AdminType };
  }

  // Check provider
  const providerDoc = await db.collection('providers').doc(uid).get();
  if (providerDoc.exists) {
    return { role: 'PROVIDER' };
  }

  // Check customer
  const customerDoc = await db.collection('customers').doc(uid).get();
  if (customerDoc.exists) {
    return { role: 'CUSTOMER' };
  }

  return null;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const devUserId = req.headers['x-user-id'] as string;
    const devUserRole = req.headers['x-user-role'] as UserRole;
    const devAdminType = req.headers['x-admin-type'] as AdminType;

    let token: string | undefined;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split('Bearer ')[1].trim();
    }

    // 1. Check Dev Header or Dev Token (Extremely convenient for Hackathon demos & automated tests)
    const isDevAllowed = process.env.ALLOW_DEV_AUTH === 'true' || process.env.NODE_ENV === 'development';

    if (isDevAllowed) {
      if (devUserId) {
        let role = devUserRole;
        let adminType: AdminType | undefined = devAdminType;

        if (!role) {
          const profile = await resolveUserProfile(devUserId);
          if (profile) {
            role = profile.role;
            adminType = profile.adminType;
          } else {
            role = 'CUSTOMER'; // default fallback
          }
        }

        req.user = {
          uid: devUserId,
          role: role || 'CUSTOMER',
          ...(role === 'ADMIN' ? { adminType: adminType || 'SUPER_ADMIN' } : {}),
        };
        return next();
      }

      if (token && token.startsWith('dev-')) {
        // e.g. dev-customer-cust123, dev-provider-prov456, dev-admin-super, dev-admin-support
        const parts = token.split('-');
        const rolePart = parts[1]?.toUpperCase();
        let role: UserRole = 'CUSTOMER';
        let adminType: AdminType | undefined;
        let uid = parts.slice(2).join('-') || `user_${Date.now()}`;

        if (rolePart === 'ADMIN') {
          role = 'ADMIN';
          adminType = parts[2]?.toUpperCase() === 'SUPPORT' ? 'SUPPORT_ADMIN' : 'SUPER_ADMIN';
          uid = parts.slice(3).join('-') || (adminType === 'SUPPORT_ADMIN' ? 'admin_support_1' : 'admin_super_1');
        } else if (rolePart === 'PROVIDER') {
          role = 'PROVIDER';
        } else if (rolePart === 'CUSTOMER') {
          role = 'CUSTOMER';
        }

        // If UID exists in db, verify or pull details
        const profile = await resolveUserProfile(uid);
        if (profile) {
          role = profile.role;
          adminType = profile.adminType;
        }

        req.user = {
          uid,
          role,
          ...(adminType ? { adminType } : {}),
        };
        return next();
      }
    }

    // 2. Real Firebase ID Token Authentication
    if (!token) {
      throw new AppError('Authentication required. Missing Bearer token.', 401);
    }

    if (auth) {
      const decodedToken = await auth.verifyIdToken(token);
      const uid = decodedToken.uid;
      const email = decodedToken.email;

      // Determine role from custom claims or Firestore collections
      let role = (decodedToken.role as UserRole) || null;
      let adminType: AdminType | undefined = (decodedToken.adminType as AdminType) || undefined;

      if (!role) {
        const profile = await resolveUserProfile(uid);
        if (profile) {
          role = profile.role;
          adminType = profile.adminType;
        } else {
          // If not found in collections yet, check if token specifies customer or provider
          role = 'CUSTOMER';
        }
      }

      req.user = {
        uid,
        email,
        role,
        ...(adminType ? { adminType } : {}),
      };
      return next();
    }

    // Never treat an unverified bearer token as a user identity. Local demo
    // access remains available only through the explicit development flow above.
    throw new AppError('Authentication service is unavailable. Configure Firebase Auth or enable explicit development authentication.', 503);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return next(error);
    }
    const message = error instanceof Error ? error.message : 'Unknown authentication error';
    return next(new AppError(`Authentication failed: ${message}`, 401));
  }
};

/**
 * Middleware to require one of the specified roles
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Forbidden. Access restricted to: ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
          403
        )
      );
    }

    next();
  };
};

/**
 * Middleware to restrict to SUPER_ADMIN only
 */
export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.user.role !== 'ADMIN' || req.user.adminType !== 'SUPER_ADMIN') {
    return next(
      new AppError('Forbidden. Only SUPER_ADMIN can perform this action.', 403)
    );
  }

  next();
};
