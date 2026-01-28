import cloudinary from "cloudinary";
import config from "../configs/env.config.js";
import fs from "fs";

cloudinary.config({
  cloud_name: config.CLOUDINARY.name,
  api_key: config.CLOUDINARY.api_key,
  api_secret: config.CLOUDINARY.api_secret,
});

const uploadImage = async (imagePath, type = "avatar") => {
  const options = getUploadOptions(type);

  try {
    const result = await cloudinary.v2.uploader.upload(imagePath, options);
    const avatar = {
      id: result.public_id,
      url: result.secure_url,
    };
    fs.unlinkSync(imagePath);
    return avatar;
  } catch (error) {
    fs.unlinkSync(imagePath);
    return null;
  }
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    return null;
  }
};

const getUploadOptions = (type) => {
  switch (type) {
    case "post":
      return {
        folder: "posts",
        use_filename: true,
        unique_filename: false,
        overwrite: true,

        transformation: [
          {
            width: 1080,
            height: 1080,
            crop: "limit",
          },
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      };

    case "avatar":
    default:
      return {
        folder: "avatar",
        use_filename: true,
        unique_filename: false,
        overwrite: true,

        transformation: [
          {
            width: 256,
            height: 256,
            crop: "fill",
            gravity: "face",
          },
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      };

    case "thumbnail":
      return {
        folder: "thumbnails",
        use_filename: true,
        unique_filename: false,
        overwrite: true,

        transformation: [
          {
            width: 1200,
            height: 630,
            crop: "fill",
            gravity: "auto",
          },
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      };
  }
};

export { uploadImage, deleteImage };
