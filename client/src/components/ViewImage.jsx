/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const ViewImage = ({ url, close }) => {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-neutral-900/70 flex justify-center items-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
                <motion.div
                    className="w-full max-w-md max-h-[80vh] p-4 bg-white rounded-lg shadow-lg"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0, transition: { duration: 0.3 } }}
                >
                    {/* Close Button */}
                    <button onClick={close} className="w-fit ml-auto block">
                        <IoClose size={25} />
                    </button>

                    {/* Image */}
                    <img
                        src={url}
                        alt="full screen"
                        className="w-full h-full object-scale-down"
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ViewImage;
