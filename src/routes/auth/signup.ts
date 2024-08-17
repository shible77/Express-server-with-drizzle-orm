import express, { Request, Response } from "express";
import { z } from 'zod';
import { db } from "../../db/setup";
import { verify_user } from "../../db/schema";
import { sendVerificationEmail } from '../../helper/sendMail'
const crypto = require('crypto');

function generateVerificationCode() {
    return crypto.randomInt(100000, 1000000); // Generates a 6-digit number
}

const signupRouter = express.Router();

const signupReqBody = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string()
});

signupRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const { username, email, password } = signupReqBody.parse(req.body);
        const verification_code = generateVerificationCode();
        const [result] = await db.insert(verify_user).values({ username, email, password, verification_code });
        const insertId = result.insertId; 
        sendVerificationEmail(email, verification_code)
        .then(() => {
            return res.status(201).json({
                msg: "User should receive an email with the verification code",
                verification_Id: insertId,
                email : email
            });
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                name: "Invalid data type.",
                message: JSON.parse(error.message),
            });
        }
        res.status(500).json({ message: "Internal server error", error });
    }
});

export default signupRouter;
