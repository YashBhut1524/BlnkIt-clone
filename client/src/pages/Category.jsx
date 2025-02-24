import { useEffect, useState } from "react"
import UploadCategoryModel from "../components/UploadCategoryModel"
import AxiosToastError from "../../utils/AxiosToastError"
import Axios from "../../utils/Axios"
import summaryApi from "../common/summaryApi"
import toast from "react-hot-toast"
import GridLoader from "react-spinners/GridLoader";
import NoData from "../components/NoData"


function Category() {

    const [openUploadCategoryModel, setOpenUploadCategoryModel] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])

    const fetchCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...summaryApi.getCategory,
            })
            // console.log("response: ", response);
            if(response.data.success) {
                toast.success(response.data.message)
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

    return (
        <section>
            <div className="p-2 bg-white shadow-xl flex items-center justify-between">
                <h2 className="font-semibold">Category</h2>
                <button 
                    className=" p-2 bg-[#0C831F] text-white font-bold rounded-md hover:bg-[#2c4e33] transition"
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
                        className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center text-center transition-transform transform hover:scale-105"
                    >
                        <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-40 h-40 object-scale-down rounded-md"
                        />
                        {/* <p className="mt-3 text-lg font-semibold text-gray-800">{category.name}</p> */}
                    </div>
                ))}
            </div>
            {
                openUploadCategoryModel && (
                    <UploadCategoryModel 
                        close={() => setOpenUploadCategoryModel(false)}
                        fetchCategory={fetchCategory}
                    />
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