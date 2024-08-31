import express from "express";
import { z } from "zod";
import { db } from "../../db/setup";
import { verify_user } from "../../db/schema";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "../../helper/sendMail";

const changeEmailRouter = express.Router();

const changeEmailReqBody = z.object({
  verification_id: z.number(),
  email: z.string(),
});

changeEmailRouter.post("/changeEmail", async (req, res) => {
  try {
    const { verification_id, email } = changeEmailReqBody.parse(req.body);
    await db
      .update(verify_user)
      .set({ email })
      .where(eq(verify_user.id, verification_id));
    const data = await db
      .select({ verification_code: verify_user.verification_code })
      .from(verify_user)
      .where(eq(verify_user.id, verification_id))
      .limit(1);
    sendVerificationEmail(email, data[0].verification_code).then(() => {
      return res.status(201).json({
        status: true,
        msg: "Verification code is sent to the updated email",
        email: email,
        verification_Id: verification_id,
      });
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

export default changeEmailRouter;
