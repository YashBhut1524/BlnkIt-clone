/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import uploadImage from "../utils/uploadImage";
import { MdDelete } from "react-icons/md";
import BeatLoader from "react-spinners/BeatLoader";
import AxiosToastError from "../utils/AxiosToastError";
import deleteImage from "../utils/deleteImage";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";;

// eslint-disable-next-line react/prop-types
function UploadSubCategoryModel({ close, fetchSubCategories }) {

    const [data, setData] = useState({
        name: "",
        image: "",
        category: []
    });
    const [loading, setLoading] = useState(false);
    const [hover, setHover] = useState(false);
    const fileInputRef = useRef(null);

    const allCategory = useSelector(state => state.product.allCategory)

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleUploadSubCategoryImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true); // Start loading
        try {
            const response = await uploadImage(file, "subCategory");
            setData((prev) => ({
                ...prev,
                image: response.data.data.url,
            }));
        } catch (error) {
            // console.error("Image upload failed:", error);
            toast.error("Image upload failed. Please try again.")
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
            await deleteImage(data.image, "subCategory");
    
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
        // console.log("Sub-Category: ", data);
        try {
            const response = await Axios({
                ...summaryApi.addSubCategory,
                data: {
                    name: data.name,
                    image: data.image,
                    category: data.category
                }
            })

            if (response.data.success) {
                toast.success(response.data.message || "SubCategory added successfully.");
                fetchSubCategories()
                close(); // Close modal
            } else {
                toast.error(response.data.message || "Failed to add subCategory!");
            }
        } catch (error) {
            AxiosToastError(error)
        }
    };

    const handleDeleteSelectedCategory = (categoryId) => {
        setData((prevData) => ({
            ...prevData,
            category: prevData.category.filter(category => category._id !== categoryId)
        }));
    };

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800/70 z-50 p-4 flex items-center justify-center">
            <div className="bg-white max-w-4xl w-full p-4 rounded">
                <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h1 className="font-semibold text-lg">Sub Category</h1>
                        <button onClick={close} className="w-fit block ml-auto">
                            <IoCloseSharp size={25} />
                        </button>
                    </div>
                    <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        {/* Category Name Input */}
                        <div className="flex flex-col">
                            <label htmlFor="SubCategoryName" className="text-gray-700 font-medium mb-1">
                                Sub Category Name
                            </label>
                            <input
                                type="text"
                                id="SubCategoryName"
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
                                        onChange={handleUploadSubCategoryImage}
                                    />
                                )}
                            </div>
                        </div>
                        {/* Category Selector */}
                        <div className="flex flex-col mb-4">
                                <label htmlFor="categorySelect" className="text-gray-700 font-medium mb-1">
                                    Select Category
                                </label>
                            <div>
                                {/* Display Value */}
                                <div className="flex">
                                    {
                                        data.category.length > 0 &&
                                        data.category.map(category => (
                                            <div 
                                                key={category._id} 
                                                className="flex items-center gap-2 bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2"
                                            >
                                                <span>{category.name}</span>
                                                <IoCloseSharp 
                                                    size={16} 
                                                    className="text-gray-600 hover:text-red-500 cursor-pointer transition duration-200" 
                                                    onClick={() => handleDeleteSelectedCategory(category._id)} 
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                                {/* Select Category */}
                                <select
                                    name="category"
                                    id="categorySelect"
                                    value={""} 
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const categoryDetails = allCategory.find(category => category._id === value);

                                        // Prevent duplicate category selection
                                        if (!data.category.some(category => category._id === value)) {
                                            setData(prev => ({
                                                ...prev,
                                                category: [...prev.category, categoryDetails]
                                            }));
                                        } else {
                                            toast.error("Category already selected!");
                                        }
                                    }}
                                >
                                    <option value={""} disabled>Select Category</option>
                                    {allCategory.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <button
                            className={`w-fit px-4 py-2 rounded-md mt-3 transition duration-200 ${
                                data.name && data.image && data.category.length > 0
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
    )
}

export default UploadSubCategoryModel