import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import summaryApi from "../../common/summaryApi";
import toast from "react-hot-toast";

const VerifyForgotPasswordOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...summaryApi.verifyForgotPasswordOTP,
                data: { email, otp }
            });

            console.log("OTP Verification response: ", response);
            if (response.data.error) {
                toast.error(response.data.message);
            }
            if (response.data.success) {
                toast.success("OTP verified successfully!");
                
                navigate("/reset-password", {state: {email}});
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <div className="min-h-full flex flex-col items-center justify-center bg-gray-50 px-4 py-20">
            <h1 className="text-3xl font-semibold text-gray-900">Enter OTP</h1>
            <p className="text-gray-600 mt-2 max-w-md">
                We have sent an OTP to <b>{email}</b>. Please enter it below.
            </p>

            <form onSubmit={handleVerifyOTP} className="w-full max-w-md mt-6 space-y-4">
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Verify OTP
                </button>

                <button
                    type="button"
                    className="w-full text-gray-600 py-2 rounded-lg hover:underline"
                    onClick={() => navigate("/forgot-password")}
                >
                    Go Back
                </button>
            </form>
        </div>
    );
};

export default VerifyForgotPasswordOTP;
