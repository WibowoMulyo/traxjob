import nodemailer from "nodemailer";
import { env } from "../env";

const transporter =
  env.GMAIL_USER && env.GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD },
      })
    : null;

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<void> {
  if (!transporter) {
    /* No Gmail configured — log the link so the flow is testable in dev. */
    console.log(`[TraxJob] Password reset link for ${to}: ${resetUrl}`);
    return;
  }
  await transporter.sendMail({
    from: env.EMAIL_FROM ?? env.GMAIL_USER,
    to,
    subject: "Reset your TraxJob password",
    text: `Reset your TraxJob password using this link: ${resetUrl}\n\nThe link expires in 1 hour. If you didn't request this, you can ignore this email.`,
    html: `<p>Reset your TraxJob password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>The link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`,
  });
}
