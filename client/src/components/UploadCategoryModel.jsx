/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import uploadImage from "../utils/uploadImage";
import { MdDelete } from "react-icons/md";
import BeatLoader from "react-spinners/BeatLoader";
import AxiosToastError from "../utils/AxiosToastError";
import deleteImage from "../utils/deleteImage";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";;
import { useSelector } from "react-redux";

function UploadCategoryModel({ close, fetchCategory }) {
    const [data, setData] = useState({
        name: "",
        image: "",
    });
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(false);
    const fileInputRef = useRef(null);

    const allCategory = useSelector(state => state.product.allCategory)
    // console.log("allCategory from redux: ", allCategory);
    
    useEffect(() => {
        setData(allCategory)
    }, [allCategory])
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true); // Start loading
        try {
            const response = await uploadImage(file, "category");
            setData((prev) => ({
                ...prev,
                image: response.data.data.url,
            }));
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleImageClick = () => {
        if (!data.image && !loading) {
            fileInputRef.current.click();
        }
    };

    const handleDeleteImage = async (e) => {
        e.stopPropagation(); // Prevent triggering handleImageClick
    
        if (!data.image) return;
    
        try {
            setLoading(true); // Start loading during deletion
            await deleteImage(data.image, "category");
    
            // Update state only after successful deletion
            setData((prev) => ({
                ...prev,
                image: "", // Clear image
            }));
            toast.success("Image deleted successfully.")
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false); // Stop loading
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const response = await Axios({
                ...summaryApi.addCategory,
                data: {
                    name: data.name,
                    image: data.image,
                }
            });
            // console.log("response: ", response);
    
            if (response.data.success) {
                toast.success(response.data.message || "Category added successfully!");
                fetchCategory()
                close(); // Close modal
            } else {
                toast.error(response.data.message || "Failed to add category");
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800/70 z-50 p-4 flex items-center justify-center">
            <div className="bg-white max-w-4xl w-full p-4 rounded">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h1 className="font-semibold text-lg">Category</h1>
                        <button onClick={close} className="w-fit block ml-auto">
                            <IoCloseSharp size={25} />
                        </button>
                    </div>
                    <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Category Name Input */}
                        <div className="flex flex-col">
                            <label htmlFor="categoryName" className="text-gray-700 font-medium mb-1">
                                Category Name
                            </label>
                            <input
                                type="text"
                                id="categoryName"
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Category Name"
                                value={data.name}
                                name="name"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div className="flex flex-col">
                            <p className="text-gray-700 font-medium mb-1">Image</p>
                            <div className="flex flex-col lg:flex-row lg:items-center sm:justify-start lg:gap-4">
                                {/* Clickable Image Upload Box */}
                                <div
                                    className="border border-gray-300 bg-blue-50 h-36 w-36 flex items-center justify-center overflow-hidden rounded-md cursor-pointer relative"
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                    onClick={handleImageClick}
                                >
                                    {loading ? (
                                        <BeatLoader color="#000000" size={15} />
                                    ) : data.image ? (
                                        <img src={data.image} alt="Uploaded" className="h-full w-full object-contain" />
                                    ) : (
                                        <p className="text-gray-700">No Image</p>
                                    )}

                                    {/* Hover Effect with Plus Icon or Delete Icon */}
                                    <div
                                        className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-md transition-opacity ${
                                            hover ? "opacity-100" : "opacity-0"
                                        }`}
                                    >
                                        {!data.image ? (
                                            <FaPlus size={24} className="text-white" />
                                        ) : (
                                            <MdDelete size={24} className="text-white" onClick={handleDeleteImage} />
                                        )}
                                    </div>
                                </div>

                                {/* Hidden File Input */}
                                {!data.image && !loading && (
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleUploadCategoryImage}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className={`w-fit px-4 py-2 rounded-md mt-3 transition duration-200 ${
                                data.name && data.image
                                    ? "bg-[#0C831F] hover:bg-[#2c4e33] text-white cursor-pointer"
                                    : "bg-gray-400 text-white cursor-not-allowed"
                            }`}
                            disabled={!data.name || !data.image}
                        >
                            Add Category
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default UploadCategoryModel;
