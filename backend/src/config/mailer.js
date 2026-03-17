// // config/mailer.js
// const nodemailer = require("nodemailer");

// /**
//  * Returns a Nodemailer transporter based on EMAIL_PROVIDER env variable.
//  * Supported: gmail | sendgrid | mailgun | ses
//  */
// function createTransporter() {
//   const provider = (process.env.EMAIL_PROVIDER || "gmail").toLowerCase();

//   switch (provider) {
//     // ── Option 1: Gmail ─────────────────────────────────────────────────────
//     case "gmail":
//       return nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.GMAIL_USER,
//           pass: process.env.GMAIL_APP_PASSWORD, // 16-char App Password from Google Account
//         },
//       });

//     // ── Option 2: SendGrid ──────────────────────────────────────────────────
//     case "sendgrid":
//       return nodemailer.createTransport({
//         host: "smtp.sendgrid.net",
//         port: 587,
//         secure: false,
//         auth: {
//           user: "apikey",                          // literally the string "apikey"
//           pass: process.env.SENDGRID_API_KEY,
//         },
//       });

//     // ── Option 3: Mailgun ───────────────────────────────────────────────────
//     case "mailgun":
//       return nodemailer.createTransport({
//         host: "smtp.mailgun.org",
//         port: 587,
//         secure: false,
//         auth: {
//           user: process.env.MAILGUN_SMTP_USER,
//           pass: process.env.MAILGUN_SMTP_PASSWORD,
//         },
//       });

//     // ── Option 4: AWS SES ───────────────────────────────────────────────────
//     case "ses":
//       return nodemailer.createTransport({
//         host: `email-smtp.${process.env.AWS_SES_REGION || "us-east-1"}.amazonaws.com`,
//         port: 587,
//         secure: false,
//         auth: {
//           user: process.env.AWS_SES_USER,
//           pass: process.env.AWS_SES_PASSWORD,
//         },
//       });

//     default:
//       throw new Error(`Unknown EMAIL_PROVIDER: "${provider}". Use: gmail | sendgrid | mailgun | ses`);
//   }
// }

// /** Resolve the "from" address depending on provider */
// function getFromAddress() {
//   const provider = (process.env.EMAIL_PROVIDER || "gmail").toLowerCase();
//   switch (provider) {
//     case "gmail":    return `"OTP System" <${process.env.GMAIL_USER}>`;
//     case "sendgrid": return `"OTP System" <${process.env.SENDGRID_FROM}>`;
//     case "mailgun":  return `"OTP System" <${process.env.MAILGUN_SMTP_USER}>`;
//     case "ses":      return `"OTP System" <${process.env.AWS_SES_FROM}>`;
//     default:         return `"OTP System" <noreply@example.com>`;
//   }
// }

// const transporter = createTransporter();

// module.exports = { transporter, getFromAddress };
// utils/mailer.js
// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send verification email with a clickable link
async function sendVerificationEmail(toEmail, name, token) {
  // const verifyLink = `${process.env.BASE_URL}/verify-email/${token}?email=${toEmail}`;
  // const verifyLink = `https://tova-spiriferous-curtis.ngrok-free.dev/api/v1/verify/${token}`;
const verifyLink = `https://tova-spiriferous-curtis.ngrok-free.dev/api/v1/verify-email/${token}?email=${toEmail}`;
  await transporter.sendMail({
    from: `"My App" <${process.env.USER_EMAIL}>`,
    to: toEmail,
    subject: "✅ Please verify your email",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px;">
          <div style="background: #f0f4ff; border-radius: 12px; padding: 32px; text-align: center;">

            <h2 style="color: #3b4cca;">Hello, ${name}! 👋</h2>
            <p style="color: #555;">Thanks for registering. Click the button below to verify your email.</p>

            <a href="${verifyLink}"
               style="
                 display: inline-block;
                 margin-top: 20px;
                 padding: 14px 32px;
                 background: #3b4cca;
                 color: white;
                 border-radius: 8px;
                 text-decoration: none;
                 font-size: 16px;
                 font-weight: bold;
               ">
              ✅ Verify My Email
            </a>

            <p style="color: #999; font-size: 12px; margin-top: 24px;">
              This link expires in <b>${process.env.VERIFY_TOKEN_EXPIRES_MINUTES || 30} minutes</b>.<br/>
              If you didn't register, ignore this email.
            </p>

            <p style="color: #bbb; font-size: 11px; margin-top: 8px;">
              Or copy this link:<br/>
              <span style="color: #3b4cca;">${verifyLink}</span>
            </p>
          </div>
        </body>
      </html>
    `,
  });
}

export { sendVerificationEmail, transporter };