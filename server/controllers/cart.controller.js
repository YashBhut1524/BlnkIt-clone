import UserModel from "../models/user.model.js"
import CartProductModel from "../models/cartProduct.model.js"

export const addToCartItemController = async (req, res) => {
    try {
        const userId = req.userId
        const productId = req.body.productId

        if(!productId) {
            return res.status(400).json({
                message: "Product ID is required.",
                error: true,
                success: false,
            })
        }

        const checkItemCart = await CartProductModel.findOne({userId, productId})

        if(checkItemCart) {
            return res.status(400).json({
                message: "Product already exists in cart.",
                error: true,
                success: false,
            })
        }

        const cartItem = new CartProductModel({
            productId,
            quantity: 1,
            userId
        }) 

        const save = await cartItem.save()

        // update cart in user model
        const updateUserCart = await UserModel.updateOne({_id: userId}, {
            $push: {shopping_cart: productId}
        })

        return res.status(200).json({
            message: "Product added to cart successfully.",
            error: false,
            success: true,
            data: save,
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

export const getCartItemsController = async (req, res) => {
    try {
        const userId = req.userId

        const cartItems = await CartProductModel.find({userId}).populate("productId")

        return res.status(200).json({
            message: "Cart items fetched successfully.",
            error: false,
            success: true,
            data: cartItems,
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

export const updateCartItemQuantityController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id, quantity } = req.body;

        if (!_id || quantity === undefined) {
            return res.status(400).json({
                message: "All fields are required.",
                error: true,
                success: false,
            });
        }

        // Find the cart item and populate the product details
        const cartItem = await CartProductModel.findOne({ _id }).populate('productId');
        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found.",
                error: true,
                success: false,
            });
        }

        const product = cartItem.productId;
        if (!product) {
            return res.status(404).json({
                message: "Product not found.",
                error: true,
                success: false,
            });
        }

        // Check if requested quantity is greater than available stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} items available in stock.`,
                error: true,
                success: false,
            });
        }

        // Update cart item quantity
        const updateCartItem = await CartProductModel.updateOne(
            { _id },
            { quantity }
        );

        return res.status(200).json({
            message: "Cart item quantity updated successfully.",
            error: false,
            success: true,
            data: updateCartItem,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};


export const deleteItemFromCartController = async (req, res) => {
    try {
        const userId = req.userId 
        const { _id } = req.body 
        
        if(!_id){
            return res.status(400).json({
                message : "Product ID is required.",
                error : true,
                success : false
            })
        }

        const deleteCartItem  = await CartProductModel.deleteOne({ _id : _id })

        return res.json({
            message : "Product deleted from cart successfully.",
            error : false,
            success : true,
            data : deleteCartItem
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}