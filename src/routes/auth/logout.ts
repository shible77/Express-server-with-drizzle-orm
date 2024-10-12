import express from 'express';
import { auth_session } from '../../db/schema';
import { db } from '../../db/setup';
import { eq } from 'drizzle-orm';

const logoutRouter = express.Router();

logoutRouter.post("/logout", async (req, res) => {
    try {
        // First, check if the token is coming from the Authorization header
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, token missing" });
        }

        // Find the session in the database
        const find_session = await db.select().from(auth_session).where(eq(auth_session.session_id, token));
        if (find_session.length === 0) {
            return res.status(404).json({ message: "Session token doesn't match" });
        }

        // Delete the session from the database
        await db.delete(auth_session).where(eq(auth_session.session_id, token));

        // Clear the cookie from the client
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        return res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

export default logoutRouter;
