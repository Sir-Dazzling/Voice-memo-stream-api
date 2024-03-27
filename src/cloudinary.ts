import { v2 as cloudinary } from "cloudinary";
import dotEnv from "dotenv";

dotEnv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleAudioUpload = async (audioFile: any) => {
  console.log("audio ", cloudinary.config());
  const result = await cloudinary.uploader.upload(audioFile, {
    resource_type: "auto",
    public_id: "audio",
    overwrite: true,
  });
  return result.secure_url;
};

export default handleAudioUpload;
