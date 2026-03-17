import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getRedisClient } from "../config/redis.js";
import { transporter } from "../config/mailer.js";

const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY_SECONDS || "300");  // 5 min
const RESEND_COOLDOWN = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || "60"); // 1 min
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10");

// Redis key helpers
const otpKey = (email) => `otp:hash:${email}`;
const cooldownKey = (email) => `otp:cooldown:${email}`;
const attemptsKey = (email) => `otp:attempts:${email}`;

// ── 1. Generate a secure 6-digit OTP ────────────────────────────────────────
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// ── 2. Send OTP (with resend cooldown check) ─────────────────────────────────
async function sendOTP(email) {
  const redis = getRedisClient();

  // ── Resend cooldown check ─────────────────────────────────────────────────
  const cooldown = await redis.ttl(cooldownKey(email));
  if (cooldown > 0) {
    const err = new Error(`Please wait ${cooldown} second(s) before requesting a new OTP.`);
    err.code = "COOLDOWN";
    err.retryAfter = cooldown;
    throw err;
  }

  // ── Generate & hash OTP ───────────────────────────────────────────────────
  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS); // hash before storing

  // ── Store in Redis with expiry ─────────────────────────────
  await redis.setex(otpKey(email), OTP_EXPIRY, hashedOtp);

  // ── Set resend cooldown ────────────────────────────────────────────
  await redis.setex(cooldownKey(email), RESEND_COOLDOWN, "1");

  // ── Reset failed attempt counter ──────────────────────────────────────────
  await redis.del(attemptsKey(email));

  // ── Send email ────────────────────────────────────────────────────────────
  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your OTP Verification Code",
    text: `Your OTP is: ${otp}. It expires in ${OTP_EXPIRY / 60} minutes.`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px;">
          <div style="background: #f4f6ff; border-radius: 12px; padding: 32px; text-align: center;">
            <h2 style="color: #3b4cca; margin-bottom: 8px;">🔐 Verification Code</h2>
            <p style="color: #555; margin-bottom: 24px;">Use the OTP below to verify your identity.</p>

            <div style="
              background: #ffffff;
              border: 2px dashed #3b4cca;
              border-radius: 10px;
              padding: 20px 32px;
              font-size: 38px;
              font-weight: bold;
              letter-spacing: 10px;
              color: #3b4cca;
              margin-bottom: 24px;
            ">${otp}</div>

            <p style="color: #888; font-size: 13px;">
              ⏳ Expires in <strong>${OTP_EXPIRY / 60} minutes</strong>.<br/>
              Do not share this code with anyone.
            </p>
          </div>
          <p style="color: #bbb; font-size: 11px; text-align: center; margin-top: 16px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </body>
      </html>
    `,
  });

  console.log(`✉️  OTP sent to ${email}`);
  return { message: "OTP sent successfully.", expiresIn: OTP_EXPIRY };
}

// ── 3. Verify OTP ─────────────────────────────────────────────────────────────
async function verifyOTP(email, inputOtp) {
  const redis = getRedisClient();
  const MAX_ATTEMPTS = 5;

  // ── Check attempts (brute-force guard) ────────────────────────────────────
  const attempts = parseInt((await redis.get(attemptsKey(email))) || "0");
  if (attempts >= MAX_ATTEMPTS) {
    const err = new Error("Too many failed attempts. Please request a new OTP.");
    err.code = "MAX_ATTEMPTS";
    throw err;
  }

  // ── Fetch stored hash ─────────────────────────────────────────────────────
  const storedHash = await redis.get(otpKey(email));
  if (!storedHash) {
    const err = new Error("OTP not found or expired. Please request a new one.");
    err.code = "OTP_NOT_FOUND";
    throw err;
  }

  // ── Bcrypt comparison ─────────────────────────────────────────────
  const isMatch = await bcrypt.compare(inputOtp, storedHash);

  if (!isMatch) {
    // Increment failed attempts counter (expires same time as OTP)
    await redis.setex(attemptsKey(email), OTP_EXPIRY, attempts + 1);
    const remaining = MAX_ATTEMPTS - (attempts + 1);
    const err = new Error(`Invalid OTP. ${remaining} attempt(s) remaining.`);
    err.code = "INVALID_OTP";
    err.remainingAttempts = remaining;
    throw err;
  }

  // ── Clean up Redis after successful verification ───────────────────────────
  await Promise.all([
    redis.del(otpKey(email)),
    redis.del(attemptsKey(email)),
    // keep cooldownKey so resend is still throttled briefly after verify
  ]);

  console.log(`✅ OTP verified for ${email}`);
  return { message: "OTP verified successfully!" };
}

export { sendOTP, verifyOTP };