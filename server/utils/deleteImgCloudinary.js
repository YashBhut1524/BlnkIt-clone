import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

        /*
        example url
            http://res.cloudinary.com/do6byjyaw/image/upload/v1740287899/binkeyit/q4l3vh0ppnxgp5ds4swx.png

        public id
            binkeyit/q4l3vh0ppnxgp5ds4swx.png
        */

const deleteImgCloudinary = async (imageUrl, path) => {

    try {
        if (!imageUrl) {
            throw new Error("No image URL provided for deletion.");
        }

        // Extract the public ID from the image URL
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0]; // Extract ID from URL

        const result = await cloudinary.uploader.destroy(`binkeyit/${path}/${publicId}`);
        console.log("Cloudinary delete result:", result);

        return result;
    } catch (error) {
        console.error("Error deleting image:", error);
        throw error;
    }
};

export default deleteImgCloudinary

