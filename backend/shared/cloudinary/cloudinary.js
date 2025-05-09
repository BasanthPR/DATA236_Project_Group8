// shared/cloudinary/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

console.log('→ CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('→ CLOUDINARY_API_KEY:',    process.env.CLOUDINARY_API_KEY);
console.log('→ CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
  cloud_name:    process.env.CLOUDINARY_CLOUD_NAME,
  api_key:       process.env.CLOUDINARY_API_KEY,
  api_secret:    process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    resource_type: file.fieldname === "video" ? "video" : "image",
    folder:        file.fieldname === "video" ? "drivers/videos" : "drivers/images",
    public_id:     `${req.user.email}_${Date.now()}`,
    // no `format` key here—let Cloudinary infer from the file itself
  }),
});
