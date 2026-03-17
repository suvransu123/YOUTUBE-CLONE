// middlewares/adminMiddleware.js

export const verifyAdmin = (req, res, next) => {
  // verifyToken runs first and attaches req.user = { id, role }
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
  next();
};