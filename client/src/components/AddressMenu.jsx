/* eslint-disable react/prop-types */
import { BiArrowBack } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";

function AddressMenu({setIsAddressMenuOpen, setOpenAddNewAddressMenu}) {
    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800/70 z-40">
            <div
                className="fixed top-0 right-0 h-full pb-10 bg-[#F5F7FD] w-100 shadow-lg mb-64 overflow-y-auto"
            >
                {/* Go Back */}
                <div 
                    className='bg-white flex gap-4 px-2 py-4 font-bold cursor-pointer'
                    onClick={() => setIsAddressMenuOpen(false)}
                >
                    <BiArrowBack size={22} className="font-extrabold"/>
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
            </div>
        </section>
    )
}

export default AddressMenu