import ProductModel from "../models/product.model.js"

export const addProductController = async (req, res) => {
    try {
        
        const {
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            description,
            discount,
            more_details,
            publish
        } = req.body;

        if (
            !name ||
            !image[0] ||
            !category[0] ||
            !subCategory[0] ||
            !unit ||
            !price ||
            !description ||
            !more_details ||
            !publish
        ) {
            return res.status(400).json({
                message: "All fields are required.",
                error: true,
                success: false,
            });
        }

        // Validation for stock
        if (stock < 0) {
            return res.status(400).json({
                message: "Stock cannot be negative.",
                error: true,
                success: false,
            });
        }

        // Validation for price
        if (price < 0) {
            return res.status(400).json({
                message: "Price cannot be negative.",
                error: true,
                success: false,
            });
        }

        // Validation for discount
        if (discount < 0 || discount > 100) {
            return res.status(400).json({
                message: "Discount should be between 0 and 100.",
                error: true,
                success: false,
            });
        }

        //Create New Product
        const newProduct = new ProductModel({
            name,
            image,
            category,
            subCategory,
            unit,
            stock,
            price,
            description,
            discount,
            more_details,
            publish
        })

        const saveProduct = await newProduct.save()

        return res.status(201).json({
            message: "Product added successfully",
            error: false,
            success: true,
            data: saveProduct,
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}