/* eslint-disable react/prop-types */
import { BiArrowBack } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import { MdOutlineModeEdit, MdOutlineDelete } from "react-icons/md";
import { useAddress } from "../provider/AddressContext";
import { useEffect } from "react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import home from "../assets/home.avif";
import hotel from "../assets/hotel.avif";
import other from "../assets/other.avif";
import work from "../assets/work.avif";
import { useNavigate } from "react-router-dom";

function AddressMenuMobile({ setOpenAddNewAddressMenu }) {
    const { addresses, fetchAddress } = useAddress();

    const navigate = useNavigate()

    useEffect(() => {
        fetchAddress();
    }, []);

    const imageMap = { home, hotel, work, other };
    const getAddressImage = (type) => imageMap[type?.toLowerCase()] || other;

    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleDeleteAddress = async (address) => {
        try {
            const response = await Axios({
                ...summaryApi.deleteAddress,
                data: { _id: address._id },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                fetchAddress();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDefaultAddress = async (address) => {
        try {
            // console.log("address: ", address);
            
            const response = await Axios({
                ...summaryApi.setDefaultAddress,
                data: { _id: address?._id },
            })
            // console.log("response: ", response);
            
            if(response.data.success) {
                toast.success(response.data.message)
                fetchAddress()
            }else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800/70 z-40">
            <div className="fixed top-0 right-0 h-full pb-10 bg-[#F5F7FD] w-full shadow-lg overflow-y-auto">

                {/* Go Back */}
                <div
                    className="bg-white flex gap-4 px-4 py-4 font-bold cursor-pointer"
                    onClick={() => navigate(-1)}
                >
                    <BiArrowBack size={22} className="font-extrabold" />
                    <p className="text-sm">Select Delivery Address</p>
                </div>

                {/* Add Address */}
                <div
                    className="bg-white mx-4 mt-3 rounded-2xl cursor-pointer"
                    onClick={() => setOpenAddNewAddressMenu(true)}
                >
                    <div 
                        className="flex gap-3 py-3 px-4 text-[#0C831F] font-semibold items-center"
                        onClick={() => navigate("/add-new-address")}
                    >
                        <FaPlus />
                        <p>Add a new address</p>
                    </div>
                </div>

                {addresses.length > 0 && (
                    <div>
                        {addresses.map((address, index) => (
                            <div 
                            key={index} 
                            className={`flex flex-col p-2 mx-4 mt-3 rounded-xl ${address.defaultAddress ? "border border-[#0C831F] bg-[#E8F5E9]" : "bg-white"}`}
                            onClick={() => handleDefaultAddress(address)}
                        >
                                <div className="flex gap-3">
                                    <img
                                        src={getAddressImage(address?.saveAs)}
                                        alt={address?.saveAs}
                                        className="w-8 h-8 p-2 bg-[#F2F2F2] rounded-lg"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold">{capitalizeFirstLetter(address?.saveAs)}</p>
                                            <p className="text-xs text-gray-500">
                                                {[address?.street, address?.flatHouseNumber, address?.floor, address?.landmark, `${address?.city}-${address?.pincode}`]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="text-[#0C831F] w-6 p-1 border border-gray-200 rounded-full"
                                                onClick={() => navigate("/edit-address", { state: { address } })}
                                            >
                                                <MdOutlineModeEdit size={16} />
                                            </button>
                                            <button
                                                className="text-red-500 w-6 p-1 border border-gray-200 rounded-full"
                                                onClick={() => handleDeleteAddress(address)}
                                            >
                                                <MdOutlineDelete size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default AddressMenuMobile;
