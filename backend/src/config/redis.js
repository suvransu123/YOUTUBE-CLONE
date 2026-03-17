import Redis from "ioredis";
import rateLimit from "express-rate-limit";

// ==========================================
// REDIS CLIENT SETUP
// ==========================================
let client;

function getRedisClient() {
  if (!client) {
    client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null; // stop retrying after 3 attempts
        return Math.min(times * 200, 2000);
      },
    });

    client.on("connect", () => console.log("✅ Redis connected"));
    client.on("error", (err) => console.error("❌ Redis error:", err.message));
  }
  return client;
}

// ==========================================
// RATE LIMITERS
// ==========================================

// ── Registration: max 5 attempts per 15 min per IP ──────────────────────────
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many registration attempts. Please wait 15 minutes and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Login: max 5 attempts per 15 min per IP ──────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please wait 15 minutes and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { getRedisClient, registerLimiter, loginLimiter };