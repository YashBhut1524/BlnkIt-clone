/* eslint-disable react/prop-types */
import { FaChevronRight } from 'react-icons/fa6'
import { useAddress } from '../provider/AddressContext';
import { CiLocationOn } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

function CheckOutButton({grandTotal, totalItems, setIsAddressMenuOpen, setIsCartMenuOpen, totalPriceWithOutDiscount, otherCharge}) {

    const navigate = useNavigate()

    const { addresses } = useAddress();
    // console.log(addresses);
    const defaultAddress = addresses.find(address => address.defaultAddress) || addresses[0];

    const capitalizeFirstLetter = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleProceed = () => {
        if(addresses.length > 0) {
            navigate("/checkout",  { state: { grandTotal, totalItems, totalPriceWithOutDiscount, otherCharge } })
            setIsCartMenuOpen(false)
        } else {
            setIsAddressMenuOpen(true)
        }
    }

    return (
        <section className="z-40">
            {/* Addresses*/}
                {/* Checkout Button */}
                <div className="fixed bottom-1 right-0 bg-white px-4 py-3 rounded-2xl shadow-lg border border-gray-300 min-w-[38%] mt-3">
                <div>
                    {
                        addresses.length === 0 ? (
                            <div>
                            </div>
                        ) : (
                            <div className=" pb-5 mb-3 border-b border-gray-500 rounded-t-xl flex justify-between items-center">
                                <div className="flex gap-2">
                                    <CiLocationOn size={25} />
                                    <div className="flex flex-col">
                                        <p className="text-sm font-semibold">Delivering to {capitalizeFirstLetter(defaultAddress.saveAs)}</p>
                                        <p className="text-xs text-gray-500">
                                            {[defaultAddress?.street, defaultAddress?.flatHouseNumber, defaultAddress?.floor, defaultAddress?.landmark, `${defaultAddress?.city}-${defaultAddress?.pincode}`]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    className="text-sm text-[#0C831F] font-semibold"
                                    onClick={() => {
                                        setIsAddressMenuOpen(true)
                                    }}
                                >
                                    Change
                                </button>
                            </div>
                        )
                    }
                </div>
                    <div className="flex justify-between text-white bg-[#0C831F] px-2 py-3 rounded-xl">
                        <div className="flex flex-col justify-start">
                            <span className="text-sm font-bold">&#8377;{grandTotal}</span>
                            <span className="text-xs">TOTAL</span>
                        </div>
                        <button 
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={handleProceed}
                        >
                            <span>Proceed</span>
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
        </section>
    )
}

export default CheckOutButton