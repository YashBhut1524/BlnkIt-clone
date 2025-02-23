import deleteImgCloudinary from "../utils/deleteImgCloudinary.js"
import uploadImgCloudinary from "../utils/uploadImgCloudinary.js"

export const uploadImageController = async (req, res) => {
    try {
        
        const file = req.file
        // console.log("file: ", file);

        const  uploadImage = await uploadImgCloudinary(file)

        return res.status(200).json({
            message: "Image uploaded successfully",
            error: false,
            succes: true,
            data: uploadImage
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteImageController = async (req, res) => {
    try {
        const { image } = req.body; // Assuming the image URL is sent in the request body

        if (!image) {
            return res.status(400).json({
                message: "Image is not available!",
                error: true,
                success: false
            });
        }

        const deleteResult = await deleteImgCloudinary(image);

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
