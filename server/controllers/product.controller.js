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

export const getProductsController = async (req, res) => {
    try {
        let {page, limit, search} = req.body

        if(!page) {
            page = 1;
        }
        if(!limit) {
            limit = 10;
        }

        const query = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } }, // Case-insensitive search
                ],
            }: {};

        const skip = (page - 1) * limit

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("category") // Populate category details
                .populate("subCategory"), // Populate subCategory details
            ProductModel.countDocuments(query)
        ]);
        
        // console.log("data: ", data);
        // console.log("totalCount: ", totalCount);        

        return res.status(200).json({
            message : "Product data fetched successfully",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPage : Math.ceil( totalCount / limit),
            data
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        // console.log(data);
        
        if (!id) {
            return res.status(400).json({
                message: "Product ID is required.",
                error: true,
                success: false,
            });
        }
        
        const updatedProduct = await ProductModel.findByIdAndUpdate(id, data, {new: true});

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found.",
                error: true,
                success: false,
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            error: false,
            success: true,
            data: updatedProduct,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
} 

export const deleteProductController = async (req, res) => {
    try {
        const {id} = req.params

        if(!id) {
            return res.status(400).json({
                message: "Product ID is required.",
                error: true,
                success: false,
            });
        }

        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        return res.status(200).json({
            message : "Product Deleted successfully",
            error : false,
            success : true,
            data : deletedProduct
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    };
}

export const getProductsByCategoryController = async (req, res) => {
    try {
        const { id } = req.body;
        // console.log(id);
        if (!id) {
            return res.status(400).json({
                message: "Category ID is required.",
                error: true,
                success: false,
            });
        }

        const products = await ProductModel.find({ 
            category: { $in: id } 
        }).populate("subCategory")

        return res.status(200).json({
            message: "Products fetched successfully",
            error: false,
            success: true,
            data: products
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};

export const getProductByCategoryAndSubCategory  = async(request,response)=>{
    try {
        const { categoryId,subCategoryId } = request.body

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message : "Provide categoryId and subCategoryId",
                error : true,
                success : false
            })
        }

        const query = {
            category : { $in :categoryId  },
            subCategory : { $in : subCategoryId }
        }

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 })
        ])

        return response.json({
            message : "Product list",
            data : data,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
