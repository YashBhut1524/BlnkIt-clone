import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        saveAs: {
            type: String,
            default: "home",
        },
        flatHouseNumber: {
            type: String,
            default: "",
        },
        floor: {
            type: String,
            default: "",
        },
        street: {
            type: String,
            default: "",
        },
        area: {
            type: String,
            default: "",
        },
        landmark: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        pincode: {
            type: String,
            default: "",
        },
        country: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
        mobileNumber: {
            type: Number,
            default: null,
        },
        latitude: {
            type: Number,
            default: null,
        },
        longitude: {
            type: Number,
            default: null,
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "User", // Assuming there's a User model
            required: true,
        },
        defaultAddress: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;
