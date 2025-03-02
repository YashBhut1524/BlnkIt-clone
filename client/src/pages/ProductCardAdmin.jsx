/* eslint-disable react/prop-types */
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";;
import toast from "react-hot-toast";

function ProductCardAdmin({ data, fetchProductsData }) {
    
    const navigate = useNavigate();

    // Check if the unit contains only digits
    const formattedUnit = /^\d+$/.test(data?.unit) ? `${data.unit} Unit` : data.unit;
    // console.log(data); //degubging
    
    const handleDeleteProduct = async () => {
        try {
            const response = await Axios({
                ...summaryApi.deleteProduct,
                url: summaryApi.deleteProduct.url.replace(":id", data._id),
            });
            console.log("response:", response);
    
            if (response.data.success) {
                toast.success(response.data.message || "Product deleted successfully!");
                fetchProductsData()
            } else {
                toast.error(response.data.message || "Failed to delete product");
            }
    
        } catch (error) {
            AxiosToastError(error);
        }
    };
    

    return (
        <div className="max-w-50 w-auto shadow-lg p-1 rounded-lg flex flex-col items-center text-center transition-transform transform hover:scale-105 relative bg-gray-50">
            
            {/* Buttons Wrapper */}
            <div className="absolute top-2 right-2 flex space-x-2">
                {/* Edit Button */}
                <button 
                    className="px-2 py-1 bg-blue-600 text-white font-medium 
                            rounded-md shadow-md hover:bg-blue-700 transition-all duration-300"
                    onClick={() => 
                        navigate(`/dashboard/update-product/${data._id}`, 
                            { state: { product: data } }
                        )
                    }
                >
                    <FaEdit size={15} />
                </button>

                {/* Delete Button */}
                <button 
                    className="px-2 py-1 bg-red-600 text-white font-medium rounded-md shadow-md hover:bg-red-700 transition-all duration-300"
                    onClick={handleDeleteProduct}
                >
                    <MdDelete size={15} />
                </button>
            </div>

            <div className="w-full h-32 flex items-center justify-center">
                <img
                    src={data?.image?.[0]}  
                    alt={data?.name}
                    className="w-20 h-20 object-contain"
                />
            </div>
            <p className="text-sm font-medium text-gray-800 line-clamp-2">{data?.name}</p>
            <p className="text-xs text-slate-600">{formattedUnit}</p>
        </div>
    );
}

export default ProductCardAdmin;
