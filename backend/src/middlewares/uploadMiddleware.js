// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import{fileURLToPath} from "url";
// const __filename=fileURLToPath(import.meta.url);
// const __dirname=path.dirname(__filename);
// // const uploadDir = path.join(process.cwd(), "uploads");

// // if(!fs.existsSync(uploadDir)){
// //     fs.mkdirSync(uploadDir);
// // }
// // // Create images subdirectory
// // const imagesDir = path.join(uploadDir, "images");
// // if (!fs.existsSync(imagesDir)) {
// //   fs.mkdirSync(imagesDir, { recursive: true });
// // } 
// const uploadDir = path.join(__dirname, "../uploads");
 
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const imagesDir = path.join(uploadDir, "images"); 

// if (!fs.existsSync(imagesDir)) {
//   fs.mkdirSync(imagesDir, { recursive: true });
// }
// const imageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, imagesDir);
//   },
//   filename: (req, file, cb) => {
//     // Sanitize filename and add timestamp
//     const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
//     const fileExtension = path.extname(sanitizedFilename);
//     const baseName = path.basename(sanitizedFilename, fileExtension);
//     cb(null, `course_${Date.now()}_${baseName}${fileExtension}`);
//   },
// });


// // const storage = multer.diskStorage({
// //     destination: function (req, file, cb) {
// //         cb(null, uploadDir);
// //     },
// //     filename: function (req, file, cb) {
// //         cb(null, Date.now() + "-" + file.originalname);
// //     }
// // });
// // const upload = multer({ storage: storage });
// const uploadImage = multer({
//   storage: imageStorage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit for images
//   },
//   fileFilter: (req, file, cb) => {
//     // Allow both image files and PDFs
//     const allowedMimeTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/webp",
//       "image/gif",
//       "application/pdf", // ✅ Added PDF support
//     ];

//     if (allowedMimeTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(
//         new Error(
//           "Only image files (JPG, PNG, WebP, GIF) and PDF files are allowed",
//         ),
//       );
//     }
//   },
// });

 import multer from "multer";

// store file in memory instead of disk
const storage = multer.memoryStorage();

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files (JPG, PNG, WebP, GIF) and PDF files are allowed"
        ),
        false
      );
    }

  }
});

export default uploadImage;
