import { useEffect, useState } from "react"
import UploadCategoryModel from "../components/UploadCategoryModel"
import AxiosToastError from "../../utils/AxiosToastError"
import Axios from "../../utils/Axios"
import summaryApi from "../common/summaryApi"
import toast from "react-hot-toast"
import GridLoader from "react-spinners/GridLoader";
import NoData from "../components/NoData"
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import UpdateCategoryModel from "../components/updateCategoryModel"
// import { useSelector } from "react-redux"

function Category() {

    const [openUploadCategoryModel, setOpenUploadCategoryModel] = useState(false)
    const [openUpdateCategoryModel, setOpenUpdateCategoryModel] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);

    const handleOpenUpdateCategoryModel = (category) => {
        setSelectedCategory(category);
        setOpenUpdateCategoryModel(true);
    };

    // const allCategory = useSelector(state => state.product.allCategory)
    // // console.log("allCategory from redux: ", allCategory);
    
    // useEffect(() => {
    //     setCategoryData(allCategory);
    // }, [allCategory]);
    
    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.getCategory,
            })
            // console.log("response: ", response);
            if(response.data.success) {
                // toast.success(response.data.message)
                setCategoryData(response.data.data)
                // console.log("categoryData: ", categoryData);
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    const handleOpenConfirmDialog = (categoryId) => {
        setDeleteCategoryId(categoryId);
        setShowConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setLoading(true);
            setShowConfirmDialog(false); // Close the modal
    
            const response = await Axios({
                ...summaryApi.deleteCategory,
                data: { categoryId: deleteCategoryId }
            });
    
            if (response.data.success) {
                toast.success(response.data.message);
                fetchCategory();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <div className="p-2 bg-white shadow-xl flex items-center justify-between sticky top-0 z-10">
                <h2 className="font-semibold">Category</h2>
                <button 
                    className="p-2 bg-[#0C831F] text-white font-bold rounded-md hover:bg-[#2c4e33] transition"
                    onClick={() => setOpenUploadCategoryModel(true)}
                >
                    Add Category
                </button>
            </div>
            {
                !categoryData.length && !loading && (
                    <NoData message="No Categories Found" subMessage="Try adding a new category." />
                )
            }
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {categoryData.map((category) => (
                <div 
                    key={category._id} 
                    className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center text-center transition-transform transform hover:scale-105 relative"
                >
                    {/* Buttons Wrapper */}
                    <div className="absolute top-2 right-2 flex space-x-2">
                        {/* Edit Button */}
                        <button 
                            className="px-2 py-1 bg-blue-600 text-white font-medium 
                                    rounded-md shadow-md hover:bg-blue-700 transition-all duration-300"
                            onClick={() => handleOpenUpdateCategoryModel(category)}
                        >
                            <FaEdit size={15} />
                        </button>

                        {/* Delete Button */}
                        <button 
                            className="px-2 py-1 bg-red-600 text-white font-medium rounded-md shadow-md hover:bg-red-700 transition-all duration-300"
                            onClick={() => handleOpenConfirmDialog(category._id)}                                
                        >
                            <MdDelete size={15} />
                        </button>
                    </div>

                    <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-40 h-40 object-scale-down rounded-md mt-2"
                    />
                </div>
            ))}
        </div>
            {
                openUploadCategoryModel && (
                    <UploadCategoryModel 
                        close={() => setOpenUploadCategoryModel(false)}
                        fetchCategory = {fetchCategory}
                    />
                )
            }
            {openUpdateCategoryModel && selectedCategory 
                && (
                    <UpdateCategoryModel  
                        close={() => setOpenUpdateCategoryModel(false)}
                        fetchCategory={fetchCategory}
                        category={selectedCategory}
                    />
                )
            }
            {
                showConfirmDialog && 
                    (
                        <div className="fixed inset-0 flex items-center justify-center bg-neutral-800/70">
                            <div className="bg-white p-6 rounded-md shadow-lg text-center">
                                <h2 className="text-lg font-semibold">Are you sure?</h2>
                                <p className="text-gray-600">Do you really want to delete this category?</p>
                                <div className="mt-4 flex justify-center space-x-4">
                                    <button 
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        onClick={handleConfirmDelete}
                                    >
                                        Yes, Delete
                                    </button>
                                    <button 
                                        className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                                        onClick={() => setShowConfirmDialog(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
            }
            {
                loading && (
                    <div className="grid place-items-center mt-[25vh]">
                        <GridLoader color="#434343" margin={2} size={25} />
                    </div>
                )
            }
        </section>
    )
}

export default Category