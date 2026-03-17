// middleware/rateLimiter.js
import rateLimit from "express-rate-limit";


/**
 * Tip 2: express-rate-limit
 * Applied per IP to /send-otp and /verify-otp routes.
 */

// Strict limiter for sending OTPs (10 requests per 15 min per IP)
const sendOtpLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 min
  max:      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10"),
  message: {
    success: false,
    code: "RATE_LIMITED",
    message: "Too many OTP requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders:   false,
});

// Slightly more lenient limiter for verification (20 attempts per 15 min per IP)
const verifyOtpLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  max:      20,
  message: {
    success: false,
    code: "RATE_LIMITED",
    message: "Too many verification attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

export { sendOtpLimiter, verifyOtpLimiter };