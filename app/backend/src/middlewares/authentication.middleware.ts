import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import mapStatusHTTP from '../database/utils/mapStatusHTTP';

const { UNAUTHORIZED } = mapStatusHTTP;

export default class AuthMiddleware {
  static tokenHandler(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
      res.status(UNAUTHORIZED).json({ message: 'Token not found' });
      return;
    }

    const otherToken = token.split(' ')[1];
    try {
      const decodedToken = jwt.verify(otherToken, process.env.JWT_SECRET as string);
      res.locals.user = decodedToken;
      next();
    } catch (error) {
      res.status(UNAUTHORIZED).json({ message: 'Token must be a valid token' });
    }
  }
}
