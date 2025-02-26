import deleteImgCloudinary from "../utils/deleteImgCloudinary.js"
import uploadImgCloudinary from "../utils/uploadImgCloudinary.js"

export const uploadImageController = async (req, res) => {
    try {
        const file = req.file;
        const path = req.body.path; // Extract path from formData
        // console.log("file: ", file);

        if (!file) {
            return res.status(400).json({ 
                message: "No file uploaded", 
                error: true, 
                success: false 
            });
        }

        const uploadImage = await uploadImgCloudinary(file, path);

        return res.status(200).json({
            message: "Image uploaded successfully",
            error: false,
            success: true,
            data: uploadImage
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};


export const deleteImageController = async (req, res) => {
    try {
        const { image, path } = req.body; // Assuming the image URL is sent in the request body

        if (!image || !path) {
            return res.status(400).json({
                message: "Image or Path is not available!",
                error: true,
                success: false
            });
        }

        const deleteResult = await deleteImgCloudinary(image, path);

        if (deleteResult.result === "ok") {
            return res.status(200).json({
                message: "Image deleted successfully!",
                error: false,
                success: true
            });
        } else {
            return res.status(500).json({
                message: "Failed to delete image from Cloudinary.",
                error: true,
                success: false
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error.",
            error: true,
            success: false
        });
    }
};
