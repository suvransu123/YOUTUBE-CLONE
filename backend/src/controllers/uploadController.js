// import cloudinary, { isConfigured } from "../config/cloudinary.js";
// import fs from "fs";

// export const uploadAvatar = async (req, res) => {
//   try {

//     if (!req.file) {
//       return res.status(400).json({ message: "No image uploaded" });
//     }

//     let result = null;

//     if (isConfigured()) {
//       result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "avatars",
//         resource_type: "image"
//       });
//        // delete local file
//     if (fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//        if (!result) {
//       return res.status(500).json({
//         success: false,
//         message: "Cloudinary not configured"
//       });
//     }
     
//     return res.json({
//       success: true,
//       imageUrl: result.secure_url,
//       publicId: result.public_id
//     });
//     }
//    // FALLBACK TO LOCAL STORAGE IF CLOUDINARY IS NOT CONFIGURED
//    return  res.json({
//     success: true,
//     imageUrl: `/uploads/${req.file.filename}`,
//     publicId: null
//   });
//   } catch (error) {
//     return res.status(500).json({
//       message: "Upload failed",
//       error: error.message
//     });
//   }
// };/
// import cloudinary, { isConfigured } from "../config/cloudinary.js";
// import cloudinary, { isConfigured } from "../config/cloudinary.js";

export const uploadAvatar = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded"
      });
    }

    if (!isConfigured()) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary not configured"
      });
    }

    // Upload using buffer (because memoryStorage)
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "avatars", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message
    });
  }
};
