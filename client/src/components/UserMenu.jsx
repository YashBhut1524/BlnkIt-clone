/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { logout } from "../store/userSlice";
import { FaExternalLinkAlt } from "react-icons/fa";

function UserMenu({ closeMenu }) {
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
                closeMenu(); // Close menu on logout
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <div className="w-48 rounded-lg">
            <div className="font-semibold text-gray-800 pb-1">My Account</div>
            <div
                className="text-sm text-gray-600 border-b pb-2 flex gap-2 items-center hover:text-black hover:bg-[#f4f1f1] mb-2"
            >
                <span>{user.name || user.mobile}</span>
                <Link to="/dashboard/profile" onClick={closeMenu}>
                    <FaExternalLinkAlt size={12} className="hover:text-black" />
                </Link>
            </div>
            <div className="text-sm grid gap-2 mt-3">
                <Link to="/dashboard/my-orders" onClick={closeMenu} className="hover:text-blue-500 transition">
                    My Orders
                </Link>
                <Link to="/dashboard/addresses" onClick={closeMenu} className="hover:text-blue-500 transition">
                    Saved Addresses
                </Link>
                <button className="text-left text-red-500 hover:text-red-700 transition" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default UserMenu;
