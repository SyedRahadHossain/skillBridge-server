import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  STUDENT = "student",
  TUTOR = "tutor",
  ADMIN = "admin",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        isActive: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      const user = session.user as typeof session.user & {
        role: string;
        isActive: boolean;
      };

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account has been banned!",
        });
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! You don't have permission to access this resource!",
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
