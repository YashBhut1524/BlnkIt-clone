import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import summaryApi from "../../common/summaryApi";
import toast from "react-hot-toast";

const VerifyForgotPasswordOTP = () => {
    const location = useLocation();
    // console.log("location",location)
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);

    // Handle OTP input change
    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return; // Allow only numbers

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1); // Only keep the last digit
        setOtp(newOtp);

        // Move to next input if a number is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle Backspace Key
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const otpValue = otp.join(""); // Convert array to string

        if (otpValue.length !== 6) {
            toast.error("Please enter a 6-digit OTP.");
            return;
        }

        try {
            const response = await Axios({
                ...summaryApi.verifyForgotPasswordOTP,
                data: { email, otp: otpValue },
            });

            // console.log("OTP Verification response: ", response);
            if (response.data.error) {
                toast.error(response.data.message);
            }
            if (response.data.success) {
                toast.success("OTP verified successfully!");
                navigate(
                    "/reset-password", 
                    { state: { 
                        email, 
                        data: response.data 
                    } }
                );
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
                {/* OTP Input Fields */}
                <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            value={digit}
                            onChange={(e) => handleChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            maxLength={1}
                            className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    ))}
                </div>

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
