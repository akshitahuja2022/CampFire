import config from "../configs/env.config.js";
import { Resend } from "resend";

const resend = new Resend(config.RESEND_API_KEY);

const sendMail = async (to, code) => {
  const response = await resend.emails.send({
    from: "Campfire <auth@campfireapp.in>",
    to,
    subject: "Your Campfire verification code",
    text: `Your Campfire verification code is ${code}. This code expires in 10 minutes.`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f6f7f9; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 24px;">

          <h2 style="margin: 0 0 16px; color: #111827;">
            Verify your email
          </h2>

          <p style="margin: 0 0 12px; color: #374151; font-size: 14px;">
            Use the following verification code to complete your Campfire signup.
          </p>

          <div style="
            margin: 24px 0;
            padding: 16px;
            background-color: #f3f4f6;
            border-radius: 6px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 4px;
            color: #111827;
          ">
            ${code}
          </div>

          <p style="margin: 0 0 8px; color: #374151; font-size: 13px;">
            This code will expire in <strong>10 minutes</strong>.
          </p>

          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            If you did not request this, you can safely ignore this email.
          </p>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="margin: 0; color: #9ca3af; font-size: 11px; text-align: center;">
            © Campfire — Authentication system
          </p>

        </div>
      </div>
    `,
  });

  return response.id;
};

export default sendMail;
