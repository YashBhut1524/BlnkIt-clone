/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import uploadImage from "../../utils/uploadImage";
import BeatLoader from "react-spinners/BeatLoader";
import ViewImage from "../components/ViewImage";
import deleteImage from "../../utils/deleteImage";
import AxiosToastError from "../../utils/AxiosToastError";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import AddField from "../components/AddField";
import Switch from "react-switch";
import Axios from "../../utils/Axios";
import summaryApi from "../common/summaryApi";

function UploadProduct() {
    const [data, setData] = useState({
        name: "",
        image: [],
        category: [],
        subCategory: [],
        unit: "",
        stock: "",
        price: "",
        description: "",
        discount: "",
        more_details: {},
        publish: true
    });
    
    const [loading, setLoading] = useState(false);
    const [viewImageURL, setViewImageURL] = useState(null); // Track image to view
    const [numberOfImages, setNumberOfImages] = useState(0);
    const [currectlyUploadedImages, setCurrentlyUploadedImages] = useState(0);
    const [openAddField, setOpenAddField] = useState(false);
    const [fieldName, setFieldName] = useState("");

    const allCategory = useSelector(state => state.product.allCategory)
    const allSubCategory = useSelector(state => state.product.allSubCategory)
    // console.log("allSubCategory.length: ", allSubCategory.length);
    // console.log("allSubCategory: ", allSubCategory);

    const disableSubmitButton = 
    loading ||
    !data.name ||
    !data.category.length || 
    !data.subCategory.length || 
    !data.unit || 
    !data.stock || 
    !data.price || 
    !data.description || 
    (Object.keys(data.more_details).length > 0 && 
    Object.values(data.more_details).some(value => !value.trim())); // Ensures no empty values

    
    const filteredSubCategories = allSubCategory?.filter(subCategory =>
        subCategory.category?.some(category => 
            data.category?.some(dataCategory => dataCategory._id === category._id)
        )
    ) || [];
    // console.log(filteredSubCategories);
    
    

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleDeleteSelectedCategory = (categoryId) => {
        setData((prevData) => ({
            ...prevData,
            category: prevData.category.filter(category => category._id !== categoryId)
        }));
        // console.log(data.category);
    };

    const handleDeleteSelectedSubCategory = (subCategoryId) => {
        setData((prevData) => ({
            ...prevData,
            subCategory: prevData.subCategory.filter((subCategory) => subCategory._id !== subCategoryId)
        }))
    }

    const handleUploadImage = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
    
        setNumberOfImages(files.length);
        setLoading(true);
    
        try {
            const uploadedImages = [];
            let uploadedCount = 0;
    
            for (const file of files) {
                const response = await uploadImage(file, "product");
                const imageURL = response.data.data.url;
                uploadedImages.push(imageURL);
                uploadedCount++;
    
                // Update progress after each upload
                setCurrentlyUploadedImages(uploadedCount);
            }
    
            // Update state once after all images are uploaded
            setData((prev) => ({
                ...prev,
                image: [...prev.image, ...uploadedImages],
            }));
    
            e.target.value = "";
    
            toast.success("Images uploaded successfully");
    
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Failed to upload images");
        } finally {
            setCurrentlyUploadedImages(0);
            setNumberOfImages(0);
            setLoading(false);
        }
    };
        
    // Log updated state after change
    // useEffect(() => {
    //     console.log("Updated data:", data);
    // }, [data]); 
    
    const handleDeleteImage = async (index) => {
        try {
            await deleteImage(data.image[index], "product");
            setData((prev) => ({
                ...prev,
                image: prev.image.filter((_, i) => i !== index), // ✅ Creates a new array
            }));
    
            toast.success("Image deleted successfully.");
        } catch (error) {
            AxiosToastError(error);
        }
    };
    
    const handleAddFieldSubmit = () => {
        setData((prev) => (
            {...prev, more_details: 
                {
                    ...prev.more_details, [fieldName]: "" 
                } 
            }
        ));
        setFieldName("")
        setOpenAddField(false);
    }

    const handleSubmit = async () => {
        console.log("Data:", data);

        try {
            const response = await Axios({
                ...summaryApi.addProduct,
                data: data
            })

            console.log("response: ", response);
            if(response.data.success) {
                toast.success(response.data.message || "Product added successfully");
                // Reset form
                setData({
                    name: "",
                    image: [],
                    category: [],
                    subCategory: [],
                    unit: "",
                    stock: "",
                    price: "",
                    description: "",
                    discount: "",
                    more_details: {},
                    publish: true
                });
            } else {
                toast.error(response.data.message || "Failed to add product");
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }
    
    return (
        <section>
            <div className="p-2 bg-white shadow-xl flex items-center justify-between sticky top-0 z-10">
                <h2 className="font-semibold">Upload Product</h2>
            </div>
            <div>
                <div className="p-4 space-y-4">
                    {/* Product Name */}
                    <div className="flex flex-col">
                        <label htmlFor="productName" className="text-gray-700 font-medium mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            id="productName"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Product Name"
                            value={data.name}
                            name="name"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Image Upload Section */}
                    <div className="flex flex-col">
                        <p className="text-gray-700 font-medium mb-1">Image</p>
                        <div>
                            {/* Upload image */}
                            <label 
                                className="bg-gray-300 h-24 border-gray-300 rounded flex justify-center items-center hover:bg-gray-400 transition"
                                htmlFor="productImage"
                            >
                                <div className="text-center flex justify-around items-center flex-col cursor-pointer hover:scale-110 transition">
                                    {loading 
                                    ? (
                                        <>
                                            {/* Upload Progress Indicator */}
                                            <div className="w-full">
                                                <BeatLoader color="#000000" size={15} />
                                                <p className="font-semibold text-center mt-2">
                                                    {currectlyUploadedImages} out of {numberOfImages} uploaded
                                                </p>
                                                <div className="w-full bg-gray-50 h-2 rounded-full mt-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${(currectlyUploadedImages / numberOfImages) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                    : (
                                        <>
                                            <MdCloudUpload size={30} />
                                            <p>Upload Image</p>
                                        </>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    multiple
                                    id="productImage"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleUploadImage} // Ensure handleUploadImage supports multiple files
                                />
                            </label>

                            {/* Display Images */}
                                {data.image && data.image.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2 p-4 bg-gray-200">
                                        {data.image.map((image, index) => (
                                            <div
                                                key={index}
                                                className="relative group flex justify-center items-center h-40 w-40 bg-gray-200 rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
                                            >
                                                {/* Product Image */}
                                                <img 
                                                    src={image} 
                                                    alt="Product" 
                                                    className="object-cover w-full h-full"
                                                    onClick={() => {
                                                        setViewImageURL(data.image[index])
                                                    }}
                                                />
                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => {
                                                        handleDeleteImage(index);
                                                    }}
                                                    className="absolute top-1 right-1 text-white bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MdDelete size={20} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
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

                    {/* SubCategory Selector */}
                    <div className="flex flex-col mb-4">
                        <label htmlFor="subCategorySelect" className="text-gray-700 font-medium mb-1">
                            Select Sub Category
                        </label>
                        <div>
                            {/* Display Value */}
                            <div className="flex">
                                {
                                    data.subCategory.length > 0 &&
                                    data.subCategory.map(subCategory => (
                                        <div 
                                            key={subCategory._id} 
                                            className="flex items-center gap-2 bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2"
                                        >
                                            <span>{subCategory.name}</span>
                                            <IoCloseSharp 
                                                size={16} 
                                                className="text-gray-600 hover:text-red-500 cursor-pointer transition duration-200" 
                                                onClick={() => handleDeleteSelectedSubCategory(subCategory._id)} 
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                            
                            {/* Select Category */}
                            {
                                data.category.length === 0 && (
                                    <p className="text-red-500 text-sm px-1">Please select a category first to choose a subcategory.</p>
                                )
                            }
                            <select
                                name="subCategory"
                                id="subCategorySelect"
                                value={""} 
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const subCategoryDetails = allSubCategory.find(subCategory => subCategory._id === value);

                                    // Prevent duplicate category selection
                                    if (!data.subCategory.some(subCategory => subCategory._id === value)) {
                                        setData(prev => ({
                                            ...prev,
                                            subCategory: [...prev.subCategory, subCategoryDetails]
                                        }));
                                    } else {
                                        toast.error("Sub-Category already selected!");
                                    }
                                }}
                            >
                                <option value={""} disabled>Select SubCategory</option>
                                {filteredSubCategories.map(subCategory => (
                                    <option key={subCategory._id} value={subCategory._id}>
                                        {subCategory.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Additional Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Unit */}
                        <div className="flex flex-col">
                            <label htmlFor="unit" className="text-gray-700 font-medium mb-1">Unit</label>
                            <input
                                type="text"
                                id="unit"
                                name="unit"
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Unit"
                                value={data.unit}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Stock */}
                        <div className="flex flex-col">
                            <label htmlFor="stock" className="text-gray-700 font-medium mb-1">Stock</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Stock"
                                value={data.stock}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Price */}
                        <div className="flex flex-col">
                            <label htmlFor="price" className="text-gray-700 font-medium mb-1">Price</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Price"
                                value={data.price}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Discount */}
                        <div className="flex flex-col">
                            <label htmlFor="discount" className="text-gray-700 font-medium mb-1">Discount (%)</label>
                            <input
                                type="number"
                                id="discount"
                                name="discount"
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Discount"
                                value={data.discount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col">
                        <label htmlFor="description" className="text-gray-700 font-medium mb-1">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Product Description"
                            value={data.description}
                            onChange={handleChange}
                            rows="5"
                        />
                    </div>

                    {/* More Added Fields */}
                    <div className="">
                        {Object.keys(data.more_details).map((key, index) => (
                            <div 
                                key={index} 
                                className="flex flex-col group rounded pb-2 relative"
                            >
                                <div className="flex items-center gap-4">
                                    <label htmlFor={key} className="text-gray-700 font-medium">
                                        {key}
                                    </label>
                                    <MdDelete 
                                        size={40} 
                                        className="text-red-500 hover:bg-gray-300 py-2 px-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                        onClick={() => {
                                            setData((prev) => {
                                                const updatedDetails = { ...prev.more_details };
                                                delete updatedDetails[key];
                                                return {
                                                    ...prev,
                                                    more_details: updatedDetails
                                                };
                                            });
                                        }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    id={key}
                                    name={key}
                                    className="w-[80%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Enter ${key}`}
                                    value={data?.more_details[key]}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setData((prev) => ({
                                            ...prev,
                                            more_details: {
                                                ...prev.more_details,
                                                [key]: value,
                                            }
                                        }));
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Publish Switch */}
                    <div className="flex items-center cursor-pointer max-w-45 w-auto hover:bg-gray-100 p-4 rounded select-none">
                        <Switch 
                            checked={data.publish} 
                            onChange={() => setData(prev => ({ ...prev, publish: !prev.publish }))} 
                            onColor="#4CAF50" 
                            offColor="#ccc" 
                            uncheckedIcon={false} 
                            checkedIcon={false} 
                            height={20} 
                            width={40} 
                        />
                        <span className="ml-3 text-gray-700" onClick={() => setData(prev => ({ ...prev, publish: !prev.publish }))}>{data.publish ? "Published" : "Unpublished"}</span>
                    </div>

                    {/* Add More Field */}
                    <div 
                        className="bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-semibold py-2 px-4 w-36 text-center border border-yellow-500 rounded-lg shadow-md transition-all cursor-pointer"
                        onClick={() => setOpenAddField(true) }
                    >
                        Add Fields
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={disableSubmitButton} 
                        className={`w-full sm:w-auto mt-4 px-6 py-3 rounded-lg text-white font-semibold shadow-md transition-all 
                            ${disableSubmitButton ? "bg-gray-400 cursor-not-allowed" : "bg-[#0C831F] hover:bg-[#2c4e33] text-white cursor-pointer"}`}
                    >
                        {loading ? (
                            <>
                                <BeatLoader color="#ffffff" size={10} /> {/* Show loading spinner */}
                                <span className="ml-2">Submitting...</span>
                            </>
                        ) : (
                            "Submit Product"
                        )}
                    </button>

                </div>
            </div>

            {/* View Image Modal */}
            {
                viewImageURL && 
                    <ViewImage 
                        url={viewImageURL} 
                        close={() => {
                            setViewImageURL(null)
                        }} 
                    />
            }

            {/* OpenAddField */}
            {
                openAddField && (
                    <AddField 
                        close={() => setOpenAddField(false)}
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        submit={handleAddFieldSubmit}
                    />
                )
            }

        </section>
    );
}

export default UploadProduct;