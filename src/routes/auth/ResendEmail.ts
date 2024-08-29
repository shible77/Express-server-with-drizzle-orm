import express from 'express'
import { z } from 'zod'
import { verify_user } from '../../db/schema'
import { db } from '../../db/setup'
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from '../../helper/sendMail'
const crypto = require('crypto');

function generateVerificationCode() {
    return crypto.randomInt(100000, 1000000); // Generates a 6-digit number
}

const resendEmailRouter = express.Router()

resendEmailRouter.get("/resendEmail/:id", async(req, res) => {
    try{
        const verification_id = z.coerce.number().parse(req.params.id)
        const v_code = generateVerificationCode();
        await db.update(verify_user).set({verification_code : v_code}).where(eq(verify_user.id, verification_id))
        const data = await db.select({email : verify_user.email}).from(verify_user).where(eq(verify_user.id,verification_id)).limit(1)
        if(data.length === 0){
            return res.status(404).json({status: false, msg : 'Data not found'})
        }
        sendVerificationEmail(data[0].email, v_code)
        .then(() => {
            return res.status(200).json({status: true, msg: 'Verification code has sent to you email', email: data[0].email})
        })
    }catch(error){
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                name: "Invalid data type.",
                message: JSON.parse(error.message),
            });
        }
        res.status(500).json({ message: "Internal server error", error });
    }
})

export default resendEmailRouter