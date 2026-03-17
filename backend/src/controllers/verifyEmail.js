import User from "../models/user.model.js";
import crypto from "crypto";

// controllers/AuthControllerMe.js
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).send(resultPage(
        "❌ Invalid Link",
        "Verification link is missing or broken.",
        "#ef4444"
      ));
    }

    // hash the token from URL → find matching user in DB
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      verificationTokenHash:    tokenHash,
      verificationTokenExpires: { $gt: Date.now() }, // not expired
    });

    // no user found OR token expired
    if (!user) {
      return res.status(400).send(resultPage(
        "⏰ Link Expired",
        "Your verification link has expired or is invalid. Please register again.",
        "#f97316"
      ));
    }

    // already verified
    if (user.isVerified) {
      return res.send(resultPage(
        "✅ Already Verified",
        "Your email is already verified. You can login!",
        "#22c55e"
      ));
    }

    // ── Mark verified + clear token ───────────────────────────────────────
    user.isVerified               = true;
    user.verificationTokenHash    = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // redirect to a nice success page
    return res.send(resultPage(
      "🎉 Email Verified!",
      "Your email has been verified successfully. You can now login.",
      "#22c55e"
    ));

  } catch (error) {
    console.error("verifyEmail error:", error);
    return res.status(500).send(resultPage(
      "❌ Server Error",
      "Something went wrong. Please try again.",
      "#ef4444"
    ));
  }
};

// ── Simple HTML result page shown after clicking link ─────────────────────
function resultPage(title, message, color) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            background: #f4f6ff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
          .card {
            background: white;
            padding: 48px 40px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            max-width: 420px;
            width: 90%;
          }
          .icon  { font-size: 56px; margin-bottom: 16px; }
          h1     { color: ${color}; font-size: 24px; margin-bottom: 12px; }
          p      { color: #666; font-size: 15px; line-height: 1.6; }
          a {
            display: inline-block;
            margin-top: 24px;
            padding: 12px 28px;
            background: ${color};
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">${title.split(" ")[0]}</div>
          <h1>${title.split(" ").slice(1).join(" ")}</h1>
          <p>${message}</p>
          <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/login">
            Go to Login →
          </a>
        </div>
      </body>
    </html>
  `;
}