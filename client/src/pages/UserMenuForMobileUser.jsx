import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaRegUser, FaFileUpload, FaUserCircle } from "react-icons/fa";
import { MdOutlineListAlt, MdCategory } from "react-icons/md";
import { IoArrowBack } from "react-icons/io5";
import Axios from "../../utils/Axios";
import summaryApi from "../common/summaryApi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../../utils/AxiosToastError";
import { AiFillProduct } from "react-icons/ai";
import { TbCategory } from "react-icons/tb";

function UserMenuForMobileUser() {
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
        <div className="bg-white px-6 py-4">

            {/* Back Button */}
            <button 
                className="flex items-center space-x-2 text-gray-700 text-lg hover:text-black transition duration-200 hover:bg-gray-200 p-2 rounded-lg"
                onClick={() => navigate("/")}
            >
                <IoArrowBack size={24} /> <span>Go Back</span>
            </button>

            {/* User Info */}
            <Link to={"/dashboard/profile"}>
                <div className="mt-10 text-gray-700 flex items-center space-x-4 hover:text-black transition duration-200 hover:bg-gray-200 py-3 rounded-xl">
                    {user?.avatar && user.avatar !== "" ? (
                        <img 
                            src={user.avatar} 
                            alt="User Avatar" 
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <FaUserCircle size={48} className="text-black" />
                    )}
                    <div>
                        <p className="text-lg font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                </div>
            </Link>
            {/* Menu Items */}
            <div className="mt-4 space-y-2">
                {
                    user.role === "ADMIN" 
                        && (
                            <>
                                <Link 
                                    to="/dashboard/category" 
                                    className="flex items-center space-x-3 text-gray-700 text-lg hover:text-black transition duration-200 hover:bg-gray-200 p-2 rounded-lg"
                                >
                                    <TbCategory size={20} /> <span>Category</span>
                                </Link>
                                <Link 
                                    to="/dashboard/sub-category" 
                                    className="flex items-center space-x-3 text-gray-700 text-lg hover:text-black transition duration-200 hover:bg-gray-200 p-2 rounded-lg"
                                >
                                    <MdCategory size={20} /> <span>Sub Category</span>
                                </Link>
                                <Link 
                                    to="/dashboard/products" 
                                    className="flex items-center space-x-3 text-gray-700 text-lg hover:text-black transition duration-200 hover:bg-gray-200 p-2 rounded-lg"
                                >
                                    <AiFillProduct size={20} /> <span>Products</span>
                                </Link>
                                <Link 
                                    to="/dashboard/products" 
                                    className="flex items-center space-x-3 text-gray-700 text-lg hover:text-black transition duration-200 hover:bg-gray-200 p-2 rounded-lg"
                                >
                                    <FaFileUpload size={18} /> <span>Upload Product</span>
                                </Link>
                            </>
                        )
                }
                <Link 
                    to="/dashboard/my-orders" 
                    className="flex items-center space-x-3 text-gray-700 text-lg hover:text-black transition duration-200 hover:bg-gray-200 p-2 rounded-lg"
                >
                    <MdOutlineListAlt size={20} /> <span>My Orders</span>
                </Link>
                <Link 
                    to="/dashboard/addresses" 
                    className="flex items-center space-x-3 text-gray-700 text-lg hover:text-black transition duration-200 hover:bg-gray-200 p-2 rounded-lg"
                >
                    <FaHome size={20} /> <span>Saved Addresses</span>
                </Link>
                <button 
                    className="flex items-center space-x-3 text-red-500 text-lg hover:text-red-700 transition duration-200 hover:bg-red-100 p-2 rounded-lg w-full"
                    onClick={handleLogout}
                >
                    <FaRegUser size={20} /> <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default UserMenuForMobileUser;
