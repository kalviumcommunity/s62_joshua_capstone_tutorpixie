"use server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${process.env.NEXT_URL}/verify-email?token=${token}`;
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email - TutorPixie",
        html: `<p>Click the link below to verify your email:</p><p><a href="${confirmLink}">Verify Email</a></p>`
    })
    console.log("Verification email sent successfully")
}