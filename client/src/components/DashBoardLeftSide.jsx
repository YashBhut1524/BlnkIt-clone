import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaRegUser, FaFileUpload, FaUserCircle } from "react-icons/fa";
import { MdOutlineListAlt, MdCategory } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";;
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { AiFillProduct } from "react-icons/ai";
import { TbCategory } from "react-icons/tb";

function DashBoardLeftSide() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await Axios(summaryApi.logout);
            if (response.data.success) {
                dispatch(logout());
                localStorage.clear();
                toast.success(response.data.message);
                navigate("/");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <div className="bg-white top-0">
            {/* Back Button */}
            <button 
                className="flex items-center space-x-2 text-gray-700 text-lg hover:text-black transition duration-200 hover:bg-gray-200 px-2 py-3 w-full border-b border-gray-300"
                onClick={() => navigate("/")}
            >
                <IoArrowBack size={24} /> <span>Go Back</span>
            </button>
            {/* User Info */}
            <Link to={"/dashboard/profile"}>
                <div className="text-gray-700 py-3 flex items-center space-x-4 hover:text-black transition duration-200 hover:bg-gray-200 border-gray-300 border-b px-2">
                    {user?.avatar && user.avatar !== "" ? (
                        <img 
                            src={user.avatar} 
                            alt="User Avatar" 
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <FaUserCircle size={48} className="text-black" />
                    )}
                    <div>
                        <p className="text-lg font-medium">{user?.name} <span className="text-sm text-[#878787]">{user.role === "ADMIN" ? "(admin)" : ""}</span></p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                </div>
            </Link>
            {/* Menu Items */}
            <div>
                {
                    user.role === "ADMIN" 
                        && (
                            <>
                                <Link 
                                    to="/dashboard/category" 
                                    className="text-gray-700 py-3 flex items-center space-x-4 hover:text-black transition duration-200 hover:bg-gray-200 border-gray-300 border-b px-2"
                                >
                                    <TbCategory size={20} /> <span>Category</span>
                                </Link>
                                <Link 
                                    to="/dashboard/sub-category" 
                                    className="text-gray-700 py-3 flex items-center space-x-4 hover:text-black transition duration-200 hover:bg-gray-200 border-gray-300 border-b px-2"
                                >
                                    <MdCategory size={20} /> <span>Sub Category</span>
                                </Link>
                                <Link 
                                    to="/dashboard/products" 
                                    className="text-gray-700 py-3 flex items-center space-x-4 hover:text-black transition duration-200 hover:bg-gray-200 border-gray-300 border-b px-2"
                                >
                                    <AiFillProduct size={20} /> <span>Products</span>
                                </Link>
                                <Link 
                                    to="/dashboard/upload-product" 
                                    className="text-gray-700 py-3 flex items-center space-x-4 hover:text-black transition duration-200 hover:bg-gray-200 border-gray-300 border-b px-2"
                                >
                                    <FaFileUpload size={18} /> <span>Upload Product</span>
                                </Link>
                            </>
                        )
                }
                <Link 
                    to="/dashboard/my-orders" 
                    className="text-gray-700 py-3 flex items-center space-x-4 hover:text-black transition duration-200 hover:bg-gray-200 border-gray-300 border-b px-2"
                >
                    <MdOutlineListAlt size={20} /> <span>My Orders</span>
                </Link>
                <Link 
                    to="/dashboard/addresses" 
                    className="text-gray-700 py-3 flex items-center space-x-4 hover:text-black transition duration-200 hover:bg-gray-200 border-gray-300 border-b px-2"
                >
                    <FaHome size={20} /> <span>Saved Addresses</span>
                </Link>
                <button 
                    className="text-gray-700 py-3 flex items-center space-x-4 hover:text-black transition duration-200 hover:bg-gray-200 border-gray-300 border-b px-2 w-full"
                    onClick={handleLogout}
                >
                    <FaRegUser size={20} /> <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default DashBoardLeftSide;
