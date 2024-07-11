import express from 'express'
import { z } from 'zod'
import { db } from '../../db/setup';
import { verify_user, users } from '../../db/schema';
import { eq } from "drizzle-orm";
import  argon2  from 'argon2'

const verifyUserRouter = express.Router()
const verifyReqBody = z.object({
    verification_code: z.number()
})
verifyUserRouter.post("/verify", async(req, res) => {
    try{
        const { verification_code } = verifyReqBody.parse(req.body)
        const user = await db
        .select({username : verify_user.username, email : verify_user.email, password : verify_user.password})
        .from(verify_user)
        .where(eq(verify_user.verification_code, verification_code))
        .limit(1)

        if(user.length === 0){
            return res.status(500).json({Message : "Invalid verification code"})
        }
        const hashedPassword = await argon2.hash(user[0].password.toString());
        await db.insert(users).values({username : user[0].username, email : user[0].email, password : hashedPassword})
        await db.delete(verify_user).where(eq(verify_user.verification_code, verification_code))
        return res.status(200).json({Message : "User verified successfully"})
     
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(400).json({
                name: "Invalid data type.",
                message: JSON.parse(error.message),
            });
        }
        res.status(500).json({ message: "Internal server error", error });
    }

})

export default verifyUserRouter