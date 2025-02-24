import CategoryModel from "../models/category.model.js";

export const addCategoryController = async (req, res) => {
    try {
        const { name, image } = req.body;

        if (!name || !image) {
            return res.status(400).json({
                message: "Both category name and image are required.",
                error: true,
                success: false
            });
        }

        const newCategory = new CategoryModel({ name, image });
        const savedCategory = await newCategory.save();

        if (!savedCategory) {
            return res.status(500).json({
                message: "Failed to add category. Please try again.",
                error: true,
                success: false
            });
        }

        return res.status(201).json({
            message: "Category added successfully!",
            error: false,
            success: true,
            category: savedCategory
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

export const getCategoryController = async (req, res) => {
    try {
        const data = await CategoryModel.find()
        
        if(!data) {
            return res.status(400).json({
                message: "No category found!",
                error: true,
                success: false,
            });   
        }

        return res.status(200).json({
            data: data,
            message: "Fetched Category successfully.",
            error: false,
            success: true
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });        
    }
}