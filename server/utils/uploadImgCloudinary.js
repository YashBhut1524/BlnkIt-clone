import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImgCloudinary = async (image, path) => {
    // Convert and compress image before uploading
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());
    const compressedImage = await sharp(buffer)
        .resize({ width: 800 }) // Resize to max 800px width (adjust as needed)
        .jpeg({ quality: 70 })  // Compress JPEG with 70% quality
        .toBuffer();

    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `binkeyit/${path}` }, 
            (error, uploadResult) => {
                if (error) return reject(error);
                resolve(uploadResult);
            }
        ).end(compressedImage);
    });

    return uploadImage;
};

export default uploadImgCloudinary;
