// utils/sendEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (toEmail, userName, token) => {
  // link user will click
  const verifyLink = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;

  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL}>`,
    to: toEmail,
    subject: "✅ Verify your email to activate your account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px;
                  margin: auto; padding: 32px; background: #f9f9f9;
                  border-radius: 12px;">

        <h2 style="color: #4f46e5;">Hello, ${userName} 👋</h2>
        <p style="color: #555; font-size: 15px;">
          Thanks for registering! Please verify your email to activate your account.
        </p>

        <a href="${verifyLink}"
           style="display: inline-block; margin-top: 20px;
                  padding: 14px 32px; background: #4f46e5;
                  color: white; border-radius: 8px;
                  text-decoration: none; font-size: 16px; font-weight: bold;">
          ✅ Verify My Email
        </a>

        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          ⏳ This link expires in <b>30 minutes</b>.<br/>
          If you didn't register, ignore this email.
        </p>

        <p style="color: #ccc; font-size: 11px; margin-top: 8px;">
          Or copy this link into your browser:<br/>
          <span style="color: #4f46e5;">${verifyLink}</span>
        </p>
      </div>
    `,
  });

  console.log(`📧 Verification email sent to ${toEmail}`);
};