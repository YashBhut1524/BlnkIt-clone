import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // For animation

const Cancel = () => {
    return (
        <div className="min-h-[78vh] flex items-center justify-center bg-red-100 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center"
            >
                {/* Animated Cancel Icon */}
                <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", stiffness: 120 }}
                    className="bg-red-700 text-white w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-10 h-10"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2zm3.707 7.293a1 1 0 0 0-1.414-1.414L12 9.586 9.707 7.293a1 1 0 1 0-1.414 1.414L10.586 11l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 12.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 11z" 
                            clipRule="evenodd"
                        />
                    </svg>
                </motion.div>

                <p className="text-lg font-semibold text-red-800">
                    Order Canceled
                </p>

                <Link 
                    to="/" 
                    className="mt-5 inline-block px-5 py-2 text-white bg-red-700 hover:bg-red-800 rounded transition-all"
                >
                    Go to Home
                </Link>
            </motion.div>
        </div>
    );
};

export default Cancel;
