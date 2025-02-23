import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { setUserDetails, updateAvatar } from "../store/userSlice";
import BeatLoader from "react-spinners/BeatLoader";
import fetchUserDetails from "../../utils/fetchUserDetails";

function Profile() {
    const user = useSelector(state => state.user);
    const [hover, setHover] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
    });

    useEffect(() => {
        setFormData({
            name: user.name || "",
            email: user.email || "",
            mobile: user.mobile || "",
        });
    }, [user]);

    const handleImageClick = () => {
        if (!loading) {
            fileInputRef.current.click();
        }
    };

    const handleChangeProfile = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            setLoading(true);
            const response = await Axios({
                ...summaryApi.updateAvatar,
                data: formData,
            });

            const { data: responseData } = response;
            dispatch(updateAvatar(responseData.data.avatar));

            if (response.data.success) {
                toast.success(response.data.message);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formData :", formData);
        
        try {
            const response = await Axios({
                ...summaryApi.updateUserDetails,
                data: formData
            })
            // console.log("response: ", response);
            if (response.data.error){
                toast.error(response.data.message)
            }
            if (response.data.success) {
                toast.success(response.data.message);
            }
            const userData = await fetchUserDetails()
            // console.log("userData: ", userData);
            dispatch(setUserDetails(userData.data))
            
        } catch (error) {
            AxiosToastError(error)
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg w-full max-w-md mx-auto">
            {/* Avatar */}
            <div
                className={`w-36 h-36 bg-gray-300 flex items-center justify-center rounded-full overflow-hidden shadow-lg border cursor-pointer relative ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={handleImageClick}
            >
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                ) : (
                    <FaUserCircle size={145} className="text-gray-600" />
                )}

                {/* Smooth Hover Overlay Effect */}
                <div
                    className={`absolute inset-0 flex items-center justify-center rounded-full transition-opacity duration-300 ${
                        hover ? "opacity-100 bg-black/50 bg-opacity-30" : "opacity-0"
                    }`}
                >
                    <FaPlus size={24} className="text-white" />
                </div>

                {/* Show "Loading..." while uploading */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center font-extrabold rounded-full bg-black/10">
                        <BeatLoader color="#000000" size={15} />
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleChangeProfile}
            />

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
                {/* Name Field */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Email Field */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        disabled
                    />
                </div>

                {/* Mobile Number Field */}
                <div className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-1">Mobile Number</label>
                    <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your mobile number"
                    />
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    className="w-full p-2 bg-[#0C831F] text-white font-bold rounded-md hover:bg-[#2c4e33] transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default Profile;
