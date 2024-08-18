import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { db } from "../db/setup";
import { auth_session, users } from "../db/schema";
import { eq } from "drizzle-orm";
dotenv.config();

export interface SessionRequest extends Request {
  user?: object;
}

const verifySession = async (
  req: SessionRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ Message: "The user is not authenticated" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const fetchToken = await db
      .select()
      .from(auth_session)
      .where(eq(auth_session.session_id, token));

    if (fetchToken.length === 0) {
      return res.status(401).json({ Message: "The user is not authenticated" });
    }
    const {created_at} = fetchToken[0]
    
    if((Date.now()+21600000) - created_at.getTime() > 1000 * 60 * 60 * 24 * 7){
      await db.delete(auth_session).where(eq(auth_session.session_id, token))
      return res.status(401).json({ Message: "Session Expires, log in again" });
    }
    const user = await db.select().from(users).where(eq(users.id, fetchToken[0].user_id)).limit(1)
    req.user = user[0]
    next();
  } catch (error) {
    return res.status(500).json({ Message: "Internal server error", error });
  }
};

export default verifySession;
