import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

  // ── 1. Get token from cookie ───────────────────────────────────────────
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Please login.",
    });
  }

  // ── 2. Verify token ────────────────────────────────────────────────────
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();

  } catch (error) {

    // Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // Token tampered / invalid
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    // Any other error
    return res.status(401).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};