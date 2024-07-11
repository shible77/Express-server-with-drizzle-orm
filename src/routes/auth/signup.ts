import express, { Request, Response } from "express";
import { z } from 'zod';
import { db } from "../../db/setup";
import { users } from "../../db/schema";
import argon2 from 'argon2';

const signupRouter = express.Router();

const signupReqBody = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string()
});

signupRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const { username, email, password } = signupReqBody.parse(req.body);
        const hashedPassword = await argon2.hash(password.toString());
        await db.insert(users).values({ username, email, password: hashedPassword });
        return res.status(201).json({
            success: true,
            data: { username, email },
            message: "Added Successfully",
        });
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
