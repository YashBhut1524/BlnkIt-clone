import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { useState, useRef } from "react";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { updateAvatar } from "../store/userSlice";

function Profile() {
    const user = useSelector(state => state.user);
    const [hover, setHover] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

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

    return (
        <div className="relative flex flex-col items-center">
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
                    <FaUserCircle size={60} className="text-gray-600" />
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm rounded-full">
                        Loading...
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
        </div>
    );
}

export default Profile;
