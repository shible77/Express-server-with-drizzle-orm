import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken')
import dotenv from 'dotenv'
dotenv.config();

export interface SessionRequest extends Request {
    user?: any;
}

const verifySession = (req: SessionRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ Message: 'The user is not authenticated' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET , (err : any , decoded : any) => {
    if (err) {
      return res.status(403).json({ Message: 'Session expired, Login again' });
    } else {
      req.user = decoded; // Store the decoded payload in req.user
      next();
    }
  });
};

export default verifySession;
