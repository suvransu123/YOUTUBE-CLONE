import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// cloudinary.config({
//     cloud_name:process.env.CLOUDINARY_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     secret_api_key:process.env.CLOUDINARY_SECRET_API_KEY
// });
let iscloudinaryConfigured = false;
let cloudinaryExport;
if(!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_SECRET_API_KEY){
     console.warn('\n⚠️ Cloudinary environment variables are not set. Cloudinary features will be disabled.');
  console.warn('   Files will be saved locally in the uploads directory.');
  console.warn('   To enable Cloudinary, add the following to your .env file:');
  console.warn('   CLOUDINARY_CLOUD_NAME=your_cloud_name');
  console.warn('   CLOUDINARY_API_KEY=your_api_key');
  console.warn('   CLOUDINARY_API_SECRET=your_api_secret\n');
  iscloudinaryConfigured=false;
    cloudinaryExport = {
    uploader: {
      upload: () => Promise.reject(new Error('Cloudinary not configured')),
    },
    api: {
      delete_resources: () => Promise.reject(new Error('Cloudinary not configured')),
    }
  };
}
else{
    try{
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_API_KEY?.replace(";", "")
          });
   iscloudinaryConfigured=true;
   cloudinaryExport=cloudinary
    }catch(error){
       console.error('❌ Error configuring Cloudinary:', error);
   iscloudinaryConfigured= false;
    cloudinaryExport = {
      uploader: {
        upload: () => Promise.reject(new Error('Cloudinary configuration error')),
      },
      api: {
        delete_resources: () => Promise.reject(new Error('Cloudinary configuration error')),
      }
    };
  }
    }
export const isConfigured = () => iscloudinaryConfigured;
export default cloudinaryExport;