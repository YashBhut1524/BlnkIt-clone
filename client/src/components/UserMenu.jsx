import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { logout } from "../store/userSlice";

function UserMenu() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async()=>{
        try {
            const response = await Axios({
                ...summaryApi.logout
            })
            // console.log("logout",response)
            if(response.data.success){
                if(close){
                    close()
                }
                dispatch(logout())
                localStorage.clear()
                toast.success(response.data.message)
                navigate("/")
            }
        } catch (error) {
            // console.log(error)
            AxiosToastError(error)
        }
    }

    return (
        <div className="w-48 rounded-lg">
            <div className="font-semibold text-gray-800 pb-1">
                My Account
            </div>
            <div className="text-sm text-gray-600 border-b pb-2">
                {user.name || user.mobile}
            </div>
            <div className="text-sm grid gap-2 mt-3">
                <Link to="/" className="hover:text-blue-500 transition">My Orders</Link>
                <Link to="/" className="hover:text-blue-500 transition">Saved Addresses</Link>
                <button 
                    className="text-left text-red-500 hover:text-red-700 transition"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default UserMenu;
