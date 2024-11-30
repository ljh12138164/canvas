import { Resend } from 'resend';

export const resend = new Resend(process.env.EMAIL_RESEND_API_KEY);
