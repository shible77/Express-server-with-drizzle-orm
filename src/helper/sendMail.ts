const nodemailer = require('nodemailer');
import dotenv  from 'dotenv';
dotenv.config();

export const sendVerificationEmail = (userEmail : string, verificationCode : number) => {
    const config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    };

    const transporter = nodemailer.createTransport(config);

    const message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "Verify your account",
        text: `Your verification code is: ${verificationCode}`,
        html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
    };

    return transporter.sendMail(message);
};

