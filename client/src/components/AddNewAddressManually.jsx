import { useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { TextField, Button } from "@mui/material";
import Axios from "axios";
import { toast } from "react-hot-toast";

// Image assets
import home from "../assets/home.avif"
import hotel from "../assets/hotel.avif"
import other from "../assets/other.avif"
import work from "../assets/work.avif"
import summaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { useNavigate } from "react-router-dom";

const AddNewAddressManually = ({ setOpenAddNewAddressMenu, setIsAddressMenuOpen }) => {
    
    const navigate = useNavigate()
    
    const [addressData, setAddressData] = useState({
        saveAs: "",
        flatHouseNumber: "",
        floor: "",
        street: "",
        area: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
        name: "",
        mobileNumber: "",
        latitude: null,  // Add this
        longitude: null, // Add this
        defaultAddress: true, // Add this
    });
    const [openOtherAsSaveAddressAs, setOpenOtherAsSaveAddressAs] = useState(false);

    const handleChange = (field) => (event) => {
        setAddressData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleClose = () => {
        if (location.pathname === "/add-new-address") {
            navigate(-1); // Go back to the previous page
        } else {
            setOpenAddNewAddressMenu(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await Axios({
                ...summaryApi.addNewAddress,
                data: {
                    saveAs: addressData.saveAs,
                    flatHouseNumber: addressData.flatHouseNumber,
                    floor: addressData.floor,
                    street: addressData.street,
                    area: addressData.area,
                    landmark: addressData.landmark,
                    city: addressData.city,
                    state: addressData.state,
                    pincode: addressData.pincode,
                    country: addressData.country,
                    name: addressData.name,
                    mobileNumber: addressData.mobileNumber,
                    latitude: addressData.latitude,
                    longitude: addressData.longitude,
                    defaultAddress: addressData.defaultAddress  
                }
            });

            if (response.data.success) {
                toast.success(response.data.message);
                setOpenAddNewAddressMenu(false);
                setIsAddressMenuOpen(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-neutral-800/70 flex justify-center items-center z-40 overflow-y-auto w-full p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative mt-130 lg:mt-60">
                <p className="text-sm text-gray-500 bg-yellow-100 p-2 rounded-md mt-6 mb-5">
                    Note: Due to Google API costs, the automatic address selector has been removed.
                    If you want to see a demo video, check it out here:&nbsp;
                    <a
                        href="https://www.youtube.com/watch?v=JJWzSoJBl7c&t=111s"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Watch Demo
                    </a>
                    &nbsp;(timestamp: 1:51)
                </p>

                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-bold">Enter Complete Address</h2>
                    <button className="text-gray-500" onClick={handleClose}>
                        <IoCloseCircleSharp size={25} />
                    </button>
                </div>

                {/* Form */}
                <div className="mt-4 space-y-3">
                    {/* Save As Tag Section */}
                    <div className="mt-4 pb-2">
                        <p className="text-sm text-gray-400 pb-2">Save address as *</p>
                        {addressData.saveAs === "other" && openOtherAsSaveAddressAs ? (
                            <div className="pb-5 flex items-baseline gap-2">
                                <button
                                    className="flex items-center shadow-md p-2 gap-1 rounded-lg border bg-[#EBFFEF] border-green-700"
                                    onClick={() => {
                                        setAddressData(prev => ({ ...prev, saveAs: "" }));
                                        setOpenOtherAsSaveAddressAs(false);
                                    }}
                                >
                                    <img src={other} alt="Other" className="w-5 h-5" />
                                    <span>Other</span>
                                </button>
                                <div className="border-b-2 border-gray-400 flex items-center w-full">
                                    <input
                                        type="text"
                                        className="focus:outline-none w-full"
                                        placeholder="Save as"
                                        value={addressData.saveAs}
                                        onChange={(e) =>
                                            setAddressData(prev => ({ ...prev, saveAs: e.target.value }))
                                        }
                                    />
                                    {addressData.saveAs.length > 0 && (
                                        <button
                                            className="pl-2"
                                            onClick={() => {
                                                setAddressData(prev => ({ ...prev, saveAs: "home" }));
                                                setOpenOtherAsSaveAddressAs(false);
                                            }}
                                        >
                                            <AiFillCloseCircle size={20} className="text-gray-300" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-2 flex-wrap">
                                {["home", "work", "hotel"].map((label) => (
                                    <button
                                        key={label}
                                        className={`flex items-center shadow-md p-2 gap-1 rounded-lg border ${
                                            addressData.saveAs === label
                                                ? "bg-[#EBFFEF] border-green-700"
                                                : "bg-white border-gray-200"
                                        }`}
                                        onClick={() => {
                                            setAddressData(prev => ({ ...prev, saveAs: label }));
                                            setOpenOtherAsSaveAddressAs(false);
                                        }}
                                    >
                                        <img
                                            src={
                                                label === "home"
                                                    ? home
                                                    : label === "work"
                                                    ? work
                                                    : hotel
                                            }
                                            alt={label}
                                            className="w-5 h-5"
                                        />
                                        <span className="capitalize">{label}</span>
                                    </button>
                                ))}
                                <button
                                    className={`flex items-center shadow-md p-2 gap-1 rounded-lg border ${
                                        addressData.saveAs === "other"
                                            ? "bg-[#EBFFEF] border-green-700"
                                            : "bg-white border-gray-200"
                                    }`}
                                    onClick={() => {
                                        setAddressData(prev => ({ ...prev, saveAs: "other" }));
                                        setOpenOtherAsSaveAddressAs(true);
                                    }}
                                >
                                    <img src={other} alt="Other" className="w-5 h-5" />
                                    <span>Other</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Input Fields */}
                        <TextField label="Flat / House No / Building" fullWidth value={addressData.flatHouseNumber} onChange={handleChange("flatHouseNumber")} />
                        <TextField label="Floor (Optional)" fullWidth value={addressData.floor} onChange={handleChange("floor")} />
                        <TextField label="Street" fullWidth value={addressData.street} onChange={handleChange("street")} />
                        <TextField label="Area" fullWidth value={addressData.area} onChange={handleChange("area")} />
                        <TextField label="Landmark (Optional)" fullWidth value={addressData.landmark} onChange={handleChange("landmark")} />
                        <TextField label="City" fullWidth value={addressData.city} onChange={handleChange("city")} />
                        <TextField label="State" fullWidth value={addressData.state} onChange={handleChange("state")} />
                        <TextField label="Pincode" fullWidth value={addressData.pincode} onChange={handleChange("pincode")} />
                        <TextField label="Country" fullWidth value={addressData.country} onChange={handleChange("country")} />
                        <TextField label="Name" fullWidth value={addressData.name} onChange={handleChange("name")} />
                        <TextField label="Mobile Number" fullWidth value={addressData.mobileNumber} onChange={handleChange("mobileNumber")} />
                    </div>
                </div>

                {/* Submit */}
                <div className="mt-4">
                    <Button variant="contained" color="success" fullWidth onClick={handleSubmit}>
                        Save Address
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddNewAddressManually;
