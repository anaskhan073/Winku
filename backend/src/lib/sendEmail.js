import nodeMailer from "nodemailer";
import { sendOTPEmail } from "../templates/sendOTPEmail.js";
import { sendForgotPasswordEmail } from "../templates/sendForgotPasswordEmail.js";
import { welcomeEmailTemp } from "../templates/welcomeEmailTemp.js";

export const sendEmailOTP = async ({ email, verificationCode, logo }) => {
    try {
        const transport = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            service: process.env.SMTP_SERVICE,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const options = {
            from: `"Winku" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject: "Your Email Verification Code",
            html: sendOTPEmail(verificationCode, logo),
        };

        await transport.sendMail(options);
        // console.log('Email OTP sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};


export const ForgetPasswordEmail = async ({ email, resetPasswordUrl, logo }) => {
    try {
        const transport = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            service: process.env.SMTP_SERVICE,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const options = {
            from: `"Winku" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject: "Your Email Verification Code",
            html: sendForgotPasswordEmail(resetPasswordUrl, logo),
        };

        await transport.sendMail(options);
        console.log('Email Forget sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};


export const WelcomeEmail = async ({email, user, logo})=>{
try {
        const transport = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            service: process.env.SMTP_SERVICE,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const options = {
            from: `"Winku" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject: "Welcome to Winku.",
            html: welcomeEmailTemp(user, logo),
        };

        await transport.sendMail(options);
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error('Failed to send email');
    }

}

