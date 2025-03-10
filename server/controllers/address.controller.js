import UserModel from "../models/user.model.js"
import AddressModel from "../models/address.model.js"

export const addNewAddressController = async (req, res) => {
    try {
        const userId = req.userId
        const {
            saveAs,
            flatHouseNumber,
            floor,
            street,
            area,
            landmark,
            city,
            state,  
            pincode,
            country,
            name,
            mobileNumber,
            latitude,
            longitude,
            defaultAddress
        } = req.body

        if (!name || !saveAs || !mobileNumber || !latitude || !longitude || !flatHouseNumber || !city || !state || !area) {
            return res.status(400).json({
                message: "Please fill the required fields!",
                error: true,
                success: false
            });
        }

        const newAddress = new AddressModel({
            saveAs,
            flatHouseNumber,
            floor,
            street,
            area,
            landmark,
            city,
            state,  
            pincode,
            country,
            name,
            mobileNumber,
            latitude,
            longitude,
            userId
        })

        const saveAddress = await newAddress.save()

        if (!saveAddress) {
            return res.status(500).json({
                message: "Failed to add new address. Please try again.",
                error: true,
                success: false
            });
        }

        return res.status(201).json({
            message: "Address added successfully!",
            error: false,
            success: true,
            address: saveAddress
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
} 

export const getAllAddressByIdController = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Fetch all addresses belonging to the user
        const addresses = await AddressModel.find({ userId });

        if (!addresses || addresses.length === 0) {
            return res.status(404).json({
                message: "No addresses found for this user.",
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Addresses retrieved successfully!",
            error: false,
            success: true,
            data: addresses
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An error occurred while fetching addresses.",
            error: true,
            success: false
        });
    }
};
