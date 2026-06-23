import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
    return;
  }

  try {
    // JWT is cryptographically verified — no DB lookup needed on every request.
    // The token already contains the user's id and email, which is all we need
    // to authorize downstream queries that are scoped to userId anyway.
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      email?: string;
    };

    req.user = { id: decoded.id, email: decoded.email || '' };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized, token failed' });
    return;
  }
};
