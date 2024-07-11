import express from 'express';
import { auth_session } from '../../db/schema';
import { db } from '../../db/setup';
import { eq } from 'drizzle-orm'

const logoutRouter = express.Router();

logoutRouter.post("/logout", async(req, res) => {
    try{
        const header = req.headers["authorization"]

        if(!header || !header.startsWith("Bearer ")){
            return res.status(401).json({ Message:"Please, provide the session token" });
        }
        const token = header.split(" ")[1]; 
        const find_session = await db.select().from(auth_session).where(eq(auth_session.session_id, token))
        if(find_session.length === 0){
            return res.status(404).json({ Message : "Session token doesn't match"})
        }    
        await db.delete(auth_session).where(eq(auth_session.session_id, token))
        res.status(200).json({ Message : "Logout Successful"})

    }catch(error){
        res.status(500).json({ message: "Internal server error", error });
    }

})

export default logoutRouter