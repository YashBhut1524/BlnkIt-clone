import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing in .env file");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'BlinkIt Clone <onboarding@resend.dev>',  // ✅ Fixed format
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error({ error });
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error sending email:", error);
        return null;
    }
};

export default sendEmail;
