import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import deleteImgCloudinary from "../utils/deleteImgCloudinary.js";

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

export const updateCategoryController = async (req, res) => {
    try {
        const { categoryId, name, image } = req.body;

        // Fetch the existing category
        const existingCategory = await CategoryModel.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found.",
                error: true,
                success: false
            });
        }

        // Delete old image from Cloudinary if it exists
        if (existingCategory.image) {
            await deleteImgCloudinary(existingCategory.image, "category");
        }

        // Update category
        const updatedCategory = await CategoryModel.findByIdAndUpdate(
            categoryId,
            { name, image },
            { new: true }
        );

        return res.status(200).json({
            message: "Category updated successfully.",
            error: false,
            success: true,
            data: updatedCategory
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.body;

        // Check if category exists
        const existingCategory = await CategoryModel.findById(categoryId);
        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found.",
                error: true,
                success: false
            });
        }

        // Check if the category is used in subcategories
        const subCategoryCount = await SubCategoryModel.countDocuments({ category: categoryId });
        if (subCategoryCount > 0) {
            return res.status(400).json({
                message: `Cannot delete this category. It is linked to ${subCategoryCount} subcategory(ies).`,
                error: true,
                success: false
            });
        }

        // Check if the category is used in products
        const productCount = await ProductModel.countDocuments({ category: categoryId });
        if (productCount > 0) {
            return res.status(400).json({
                message: `Cannot delete this category. It is linked to ${productCount} product(s).`,
                error: true,
                success: false
            });
        }

        // Delete old image from Cloudinary if it exists
        if (existingCategory.image) {
            await deleteImgCloudinary(existingCategory.image, "category"  );
        }

        // Delete the category
        await CategoryModel.findByIdAndDelete(categoryId);

        return res.status(200).json({
            message: "Category deleted successfully.",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An unexpected error occurred.",
            error: true,
            success: false,
        });
    }
};