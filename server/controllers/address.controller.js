import UserModel from "../models/user.model.js"
import AddressModel from "../models/address.model.js"

export const addNewAddressController = async (req, res) => {
    try {
        const userId = req.userId;
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
            longitude
        } = req.body;

        if (!name || !saveAs || !mobileNumber || !latitude || !longitude || !flatHouseNumber || !city || !state || !area) {
            return res.status(400).json({
                message: "Please fill the required fields!",
                error: true,
                success: false
            });
        }

        // Set defaultAddress = false for all existing addresses of this user
        await AddressModel.updateMany({ userId }, { defaultAddress: false });

        // Create new address with defaultAddress: true
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
            userId,
            defaultAddress: true // New address is always default
        });

        const savedAddress = await newAddress.save();

        if (!savedAddress) {
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
            address: savedAddress
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An error occurred while adding the address.",
            error: true,
            success: false
        });
    }
};

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

export const updateAddressController = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "User not authorized to access this endpoint.",
                error: true,
                success: false
            });
        }

        const {
            _id,
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
        } = req.body;
        
        if (!_id) {
            return res.status(400).json({
                message: "Address _id is required!",
                error: true,
                success: false
            });
        }

        if (!name || !saveAs || !mobileNumber || !latitude || !longitude || !flatHouseNumber || !city || !state || !area) {
            return res.status(400).json({
                message: "Please fill the required fields!",
                error: true,
                success: false
            });
        }

        // Check if the address exists
        const addressToUpdate = await AddressModel.findById(_id);
        if (!addressToUpdate) {
            return res.status(404).json({
                message: "Address not found!",
                error: true,
                success: false
            });
        }

        // Set defaultAddress = false for all user's addresses before updating the new one
        await AddressModel.updateMany({ userId }, { defaultAddress: false });

        // Update the selected address with defaultAddress: true
        const updatedAddress = await AddressModel.findByIdAndUpdate(
            _id,
            {
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
                defaultAddress: true // Always set this address as default
            },
            { new: true }
        );

        return res.status(200).json({
            message: "Address updated successfully!",
            success: true,
            address: updatedAddress
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An error occurred while updating the address.",
            error: true,
            success: false
        });
    }
};


export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;

        if (!userId) {
            return res.status(401).json({
                message: "User not authorized to access this endpoint.",
                error: true,
                success: false
            });
        }

        if (!_id) {
            return res.status(400).json({
                message: "Address _id is required!",
                error: true,
                success: false
            });
        }

        // Find the address to be deleted
        const addressToDelete = await AddressModel.findOne({ _id, userId });

        if (!addressToDelete) {
            return res.status(404).json({
                message: "Address not found!",
                error: true,
                success: false
            });
        }

        const wasDefault = addressToDelete.defaultAddress; // Check if it's the default address

        // Delete the address
        await AddressModel.findByIdAndDelete(_id);

        // If deleted address was default, set the first available address as default
        if (wasDefault) {
            const firstAddress = await AddressModel.findOne({ userId }).sort({ createdAt: 1 });

            if (firstAddress) {
                await AddressModel.findByIdAndUpdate(firstAddress._id, { defaultAddress: true });
            }
        }

        return res.status(200).json({
            message: "Address deleted successfully!",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "An error occurred while deleting the address.",
            error: true,
            success: false
        });
    }
};
