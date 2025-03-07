import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImgCloudinary = async (image, path) => {
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

    const uploadImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `binkeyit/${path}` }, 
            (error, uploadResult) => {
                if (error) return reject(error);
                resolve(uploadResult);
            }
        ).end(buffer);
    });

    return uploadImage;
};

export default uploadImgCloudinary;
