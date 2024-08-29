import express  from "express";
import { z } from 'zod'
import { db } from "../../db/setup";
import { users, verify_user } from "../../db/schema";
import { eq } from 'drizzle-orm'
import { sendVerificationEmail } from '../../helper/sendMail'
const crypto = require('crypto');
import  argon2  from 'argon2'

function generateVerificationCode() {
    return crypto.randomInt(100000, 1000000); // Generates a 6-digit number
}

const changePassVerifyRouter = express.Router()

const changePassVerifyReqBody = z.object({
    email : z.string()
})
changePassVerifyRouter.post("/verifyUser", async(req, res) => {
    try{
        const { email } = changePassVerifyReqBody.parse(req.body)
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1)
        if(user.length === 0) {
            return res.status(500).json({status: false, message : 'No user exist for this email'})
        }
        const verification_code = generateVerificationCode();
        const [result] = await db.insert(verify_user).values({ username : user[0].username, email: user[0].email, password: user[0].password, verification_code: verification_code });
        const insertId = result.insertId; 
        // console.log(email, user, insertId)
        sendVerificationEmail(email, verification_code)
        .then(() => {
            return res.status(201).json({
                status : true,
                msg: "User should receive an email with the verification code",
                verification_Id: insertId,
                email : email
            })
        })
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

const verifyCodeReqBody = z.object({
    verification_id : z.number(),
    verification_code : z.number()
})

changePassVerifyRouter.post("/verifyCode", async(req, res) => {
    try{
       const { verification_id, verification_code} = verifyCodeReqBody.parse(req.body)
       const data = await db.select().from(verify_user).where(eq(verify_user.id, verification_id)).limit(1)
       if(data.length === 0 || data[0].verification_code !== verification_code){
        return res.status(500).json({status : false, msg : 'Invalid verification code'})
       }
       const user = await db.select().from(users).where(eq(users.email, data[0].email)).limit(1)
       if(user.length === 0){
        return res.status(401).json({status : false, msg : 'No user exist for this email'})
       }
       return res.status(200).json({
        status : true, 
        msg : 'User verified successfully',
        user_id : user[0].id
    })
    }catch(error){
        if(error instanceof z.ZodError){
            return res.status(400).json({
                name: "Invalid data type.",
                message: JSON.parse(error.message),      
            })
        }
        return res.status(500).json({Message: 'Internal server error', error})
    }
})

const resetPassReqBody = z.object({
    user_id : z.number(),
    new_pass : z.string()
})

changePassVerifyRouter.put("/resetPass", async(req, res) => {
    try{
        const { user_id, new_pass } = resetPassReqBody.parse(req.body)
        const hPassword = await argon2.hash(new_pass.toString())
        await db.update(users).set({password : hPassword}).where(eq(users.id, user_id))
        return res.status(200).json({status : true, msg : 'Password changed successfully'})
    }catch(error){
        if( error instanceof z.ZodError){
            return res.status(400).json({
                name : 'Invalid data type.',
                message : JSON.parse(error.message)
            })
        }
        return res.status(500).json({message : 'Internal server error', error})
    }

})

export default changePassVerifyRouter