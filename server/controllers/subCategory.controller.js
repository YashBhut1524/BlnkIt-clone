import SubCategoryModel from "../models/subCategory.model.js"
import deleteImgCloudinary from "../utils/deleteImgCloudinary.js"

export const addSubCategoryController = async (req, res) => {
    try {
        const {name, image, category} = req.body

        if(!name ||!image ||!category) {
            return res.status(400).json({
                message: "All fields are required.",
                error: true,
                success: false
            })
        }

        const newSubCategory = new SubCategoryModel({
            name,
            image,
            category
        })
        
        const savedSubCategory = await newSubCategory.save()
        
        if(!savedSubCategory) {
            return res.status(500).json({
                message: "Failed to add subcategory. Please try again.",
                error: true,
                success: false
            })
        }
        
        return res.status(201).json({
            message: "Subcategory added successfully!",
            error: false,
            success: true,
            data: savedSubCategory
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const getSubCategoriesController = async (req, res) => {
    try {
        const data = await SubCategoryModel.find().sort({createdAt: -1}).populate("category")
        if(!data) {
            return res.status(400).json({
                message: "No subCategory found!",
                error: true,
                success: false,
            });   
        }
        
        return res.status(200).json({
            data: data,
            message: "Fetched Subcategories successfully.",
            error: false,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const updateSubCategoryController = async (req, res) => {
    try {
        const {subCategoryId, name, image, category} = req.body
        
        
        if(!subCategoryId || !name ||!image ||!category) {
            return res.status(400).json({
                message: "All fields are required.",
                error: true,
                success: false
            })
        }

        const existingSubCategory = await SubCategoryModel.findById(subCategoryId)
        if (!existingSubCategory) {
            return res.status(404).json({
                message: "Category not found.",
                error: true,
                success: false
            });
        }

        if(existingSubCategory.image) {
            await deleteImgCloudinary(existingSubCategory.image)
        }

        const updatedSubCategory = await SubCategoryModel.findByIdAndUpdate(
            subCategoryId,
            {
                name,
                image,
                category
            },
            { new: true }
        )

        return res.status(200).json({
            message: "Category updated successfully.",
            error: false,
            success: true,
            data: updatedSubCategory
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteSubCategoryController = async (req, res) => {
    try {
        const { subCategoryId } = req.body
        
        if(!subCategoryId) {
            return res.status(400).json({
                message: "Subcategory ID is required.",
                error: true,
                success: false
            })
        } 
        
        const existingSubCategory = await SubCategoryModel.findById(subCategoryId)
        if (!existingSubCategory) {
            return res.status(404).json({
                message: "Subcategory not found.",
                error: true,
                success: false
            });
        }

        if(existingSubCategory.image) {
            await deleteImgCloudinary(existingSubCategory.image)
        }

        await SubCategoryModel.findByIdAndDelete(existingSubCategory)

        return res.status(200).json({
            message: "Subcategory deleted successfully!",
            error: false,
            success: true
        });
        
    }catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}