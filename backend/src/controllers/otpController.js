// // controllers/otpController.js
// import * as otpService from "../services/otpService.js";
// import User from "../models/user.model.js";

// const { sendOTP, verifyOTP } = otpService;

// function isValidEmail(email) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }

// // POST /api/otp/send
// async function send(req, res) {
//   const { email } = req.body;

//   if (!email || !isValidEmail(email)) {
//     return res.status(400).json({ success: false, message: "A valid email is required." });
//   }

//   try {
//     const result = await sendOTP(email.toLowerCase().trim());
//     return res.status(200).json({ success: true, ...result });
//   } catch (err) {
//     if (err.code === "COOLDOWN") {
//       return res.status(429).json({
//         success: false,
//         code: err.code,
//         message: err.message,
//         retryAfter: err.retryAfter,
//       });
//     }
//     console.error("sendOTP error:", err);
//     return res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
//   }
// }

// // POST /api/otp/verify
// async function verify(req, res) {
//   const { email, otp } = req.body;

//   if (!email || !isValidEmail(email)) {
//     return res.status(400).json({ success: false, message: "A valid email is required." });
//   }
//   if (!otp || !/^\d{6}$/.test(otp)) {
//     return res.status(400).json({ success: false, message: "OTP must be a 6-digit number." });
//   }

//   try {
//     const result = await verifyOTP(email.toLowerCase().trim(), otp);
    
//     // Update user isVerified status
//     const verifiedUser = await User.findOneAndUpdate(
//       { email: email.toLowerCase().trim() },
//       { $set: { isVerified: true } },
//       { new: true }
//     );

//     if (!verifiedUser) {
//         return res.status(404).json({ success: false, message: "User not found with this email." });
//     }

//     return res.status(200).json({ success: true, message: "Email successfully verified! You can now log in." });
//   } catch (err) {
//     const statusMap = { OTP_NOT_FOUND: 404, INVALID_OTP: 400, MAX_ATTEMPTS: 429 };
//     const status = statusMap[err.code] || 500;
//     return res.status(status).json({
//       success: false,
//       code: err.code || "ERROR",
//       message: err.message,
//       ...(err.remainingAttempts !== undefined && { remainingAttempts: err.remainingAttempts }),
//     });
//   }
// }

// export { send, verify };
