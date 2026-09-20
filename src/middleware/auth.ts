import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.ts";

export interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) {
      return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Bitte melde dich an." } });
    }
    req.user = { id: session.user.id, email: session.user.email, name: session.user.name };
    next();
  } catch (error) {
    console.error("Error verifying session:", error);
    return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Bitte melde dich an." } });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (session) {
      req.user = { id: session.user.id, email: session.user.email, name: session.user.name };
    }
  } catch {
    // Ignored for optional auth
  }
  next();
};
