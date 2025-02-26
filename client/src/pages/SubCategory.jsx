/* eslint-disable no-unused-vars */
import { useState } from "react"
import UploadSubCategoryModel from "../components/UploadSubCategoryModel"
import AxiosToastError from "../../utils/AxiosToastError"
import Axios from "../../utils/Axios"
import summaryApi from "../common/summaryApi"
import toast from "react-hot-toast"
import { useEffect } from "react"
import DisplayTable from "./DisplayTable"
import {
    createColumnHelper,
} from '@tanstack/react-table'
import ViewImage from "../components/ViewImage"
import UpdateSubCategoryModel from "../components/UpdateSubCategoryModel"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import GridLoader from "react-spinners/GridLoader"

function SubCategory() {

    const [openUploadSubCategoryModel, setOpenUploadSubCategoryModel] = useState(false)
    const [OpenUpdateSubCategoryModel, setOpenUpdateSubCategoryModel] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [getImgUrl, setGetImgUrl] = useState("")
    const [selectedSubCategory, setSelectedSubCategory] = useState(null)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [deleteSubCategoryId, setDeleteSubCategoryId] = useState(null);
    
    const columnHelper = createColumnHelper()

    const columns = [
        columnHelper.accessor("name", {
            header: "Name"
        }),
        columnHelper.accessor("image", {
            header: "Image",
            cell: ({ row }) => (
                <div className="flex items-center justify-center hover:cursor-pointer">
                    <img 
                        src={row.original.image} 
                        alt={row.original.name}  
                        className="w-10 h-10 object-cover rounded"
                        onClick={() => setGetImgUrl(row.original.image)}
                    />
                </div>
            )
        }),
        columnHelper.accessor("category", {
            header: "Category",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.category.map((c, index) => (
                        <p 
                            key={index} 
                            className="inline-flex items-center justify-center rounded-md bg-gray-400 py-1 px-2 text-xs sm:text-sm"
                            style={{
                                minWidth: `${Math.min(Math.max(c.name.length * 8, 50), 120)}px`,
                            }}
                        >
                            {c.name}
                        </p>
                    ))}
                </div>
            )
        }),
        columnHelper.accessor("_id", {
            header: "Action",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button 
                        className="px-2 py-1 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 transition-all duration-300"
                        onClick={() => handleOpenUpdateCategoryModel({ subCategory: row.original })}
                    >
                        {/* Edit */}
                        <FaEdit size={15} />
                    </button>
                    <button 
                        className="px-2 py-1 bg-red-600 text-white font-medium rounded-md shadow-md hover:bg-red-700 transition-all duration-300"
                        // onClick={() => {handleDeleteSubCategory(row.original._id)}}
                        onClick={() => handleOpenConfirmDialog(row.original._id)}                                

                    >
                        {/* Delete */}
                        <MdDelete size={15} />
                    </button>
                </div>
            )
        })
    ]

    const handleOpenUpdateCategoryModel = (subCategory) => {
        // console.log("subCategory: ", subCategory);
        setSelectedSubCategory(subCategory);
        setOpenUpdateSubCategoryModel(true);
    };
    
    const handleConfirmDelete = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.deleteSubCategory,
                data: {subCategoryId: deleteSubCategoryId}
            })
            // console.log("response: ", response);
            if(response.data.success) {
                toast.success(response.data.message)
                setShowConfirmDialog(false)
                fetchSubCategories()
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenConfirmDialog = (categoryId) => {
        setDeleteSubCategoryId(categoryId);
        setShowConfirmDialog(true);
    };

    const  fetchSubCategories = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.getSubCategory
            })

            const { data : responseData } = response
            // console.log(responseData);
                
            if(responseData.success) {
                // toast.success(responseData.message)
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubCategories()
    }, [])

    return (
        <section>
            <div className="p-2 bg-white shadow-xl flex items-center justify-between">
                <h2 className="font-semibold">Sub Category</h2>
                <button 
                    className=" p-2 bg-[#0C831F] text-white font-bold rounded-md hover:bg-[#2c4e33] transition"
                    onClick={() => setOpenUploadSubCategoryModel(true)}
                >
                    Add Sub Category
                </button>
            </div>
            <div>
                <DisplayTable 
                    data={data}
                    columns = {columns} 
                />
            </div>
            {
                openUploadSubCategoryModel && (
                    <UploadSubCategoryModel 
                        close={() => setOpenUploadSubCategoryModel(false)}
                        fetchSubCategories={fetchSubCategories}
                    />
                )
            }
            {
                OpenUpdateSubCategoryModel && (
                    <UpdateSubCategoryModel 
                        close={() => setOpenUpdateSubCategoryModel(false)}
                        subCategory={selectedSubCategory}
                        fetchSubCategories={fetchSubCategories}
                    />
                )
            }
            {
                showConfirmDialog && 
                    (
                        <div className="fixed inset-0 flex items-center justify-center bg-neutral-800/70">
                            <div className="bg-white p-6 rounded-md shadow-lg text-center">
                                <>
                                    {
                                        loading 
                                        ? (
                                            <div className="grid place-items-center">
                                                <GridLoader color="#434343" margin={2} size={25} />
                                            </div>
                                        ) 
                                        : (
                                            <>
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
                                            </>
                                        )
                                    }
                                </>
                            </div>
                        </div>
                    )
            }
            {   
                getImgUrl && 
                <ViewImage 
                    url={getImgUrl}
                    close={() => setGetImgUrl("")} 
                />
            }
        </section>
    )
}

export default SubCategory