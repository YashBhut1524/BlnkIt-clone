/* eslint-disable react/prop-types */
import { FaChevronRight } from 'react-icons/fa6'

function CheckOutButton({grandTotal, setIsAddressMenuOpen}) {
    return (
        <section className="z-40">
                {/* Checkout Button */}
                <div className="fixed bottom-1 right-0 bg-white px-4 py-3 rounded-2xl shadow-lg border border-gray-300 min-w-[38%] mt-3">
                    <div className="flex justify-between text-white bg-[#0C831F] px-2 py-3 rounded-xl">
                        <div className="flex flex-col justify-start">
                            <span className="text-sm font-bold">&#8377;{grandTotal}</span>
                            <span className="text-xs">TOTAL</span>
                        </div>
                        <button 
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={() => setIsAddressMenuOpen(true)}
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