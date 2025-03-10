/* eslint-disable react/prop-types */
import { BiArrowBack } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";
import home from "../assets/home.avif";
import hotel from "../assets/hotel.avif";
import other from "../assets/other.avif";
import work from "../assets/work.avif";
import { MdOutlineModeEdit } from "react-icons/md";
import { useAddress } from "../provider/AddressContext";
import { useEffect } from "react";

function AddressMenu({ setIsAddressMenuOpen, setOpenAddNewAddressMenu }) {
    const { addresses, fetchAddress } = useAddress();

    useEffect(() => {
        fetchAddress();
    }, []);

    const imageMap = { home, hotel, work, other };
    const getAddressImage = (type) => imageMap[type?.toLowerCase()] || other;

    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800/70 z-40">
            <div className="fixed top-0 right-0 h-full pb-10 bg-[#F5F7FD] w-100 shadow-lg mb-64 overflow-y-auto">
                {/* Go Back */}
                <div
                    className="bg-white flex gap-4 px-2 py-4 font-bold cursor-pointer"
                    onClick={() => setIsAddressMenuOpen(false)}
                >
                    <BiArrowBack size={22} className="font-extrabold" />
                    <p className="text-sm">Select Delivery address</p>
                </div>

                {/* Add Address */}
                <div
                    className="bg-white mx-4 mt-3 rounded-2xl cursor-pointer"
                    onClick={() => setOpenAddNewAddressMenu(true)}
                >
                    <div className="flex gap-3 py-3 px-4 text-[#0C831F] font-semibold items-center">
                        <FaPlus />
                        <p>Add a new address</p>
                    </div>
                </div>

                {addresses.length > 0 && (
                    <div>
                        {addresses.map((address, index) => (
                            <div key={index} className="flex flex-col p-4 bg-white mx-2 mt-3 rounded-lg">
                                <div className="flex gap-3">
                                    <img
                                        src={getAddressImage(address?.saveAs)}
                                        alt={address?.saveAs}
                                        className="w-8 h-8 p-2 bg-[#F2F2F2] rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{capitalizeFirstLetter(address?.saveAs)}</p>
                                        <p className="text-xs text-gray-500">
                                            {[address?.street, address?.flatHouseNumber, address?.floor, address?.landmark, `${address?.city}-${address?.pincode}`]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                    </div>
                                    <button className="text-[#0C831F] p-2 border border-gray-200 rounded-full">
                                        <MdOutlineModeEdit size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default AddressMenu;
