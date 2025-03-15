/* eslint-disable no-extra-boolean-cast */
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // For smooth animations

const Success = () => {
    const location = useLocation();

    return (
        <div className="min-h-[78vh] flex items-center justify-center bg-green-100 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center"
            >
                {/* Animated Success Icon */}
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 120 }}
                    className="bg-[#0C831F] text-white w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-10 h-10"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2zm-1.293 14.707a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L10 14.586l5.293-5.293a1 1 0 0 1 1.414 1.414z" 
                            clipRule="evenodd"
                        />
                    </svg>
                </motion.div>

                <p className="text-lg font-semibold text-green-800">
                    {Boolean(location?.state?.text) ? location?.state?.text : "Payment"} Successfully!
                </p>

                <Link 
                    to="/" 
                    className="mt-5 inline-block px-5 py-2 text-white bg-[#0C831F] hover:bg-[#30563a] rounded transition-all"
                >
                    Go to Home
                </Link>
            </motion.div>
        </div>
    );
};

export default Success;
