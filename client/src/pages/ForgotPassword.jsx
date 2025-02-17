import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import summaryApi from "../../common/summaryApi";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const outletContext = useOutletContext(); // Get Outlet context

    const navigate = useNavigate()

    // console.log("Outlet Context:", outletContext); // Debugging


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...summaryApi.forgotPassword,
                data: {email}
            })
            console.log("response: ", response);
            if(response.data.error) {
                toast.error(response.data.message)
            }
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/verify-forgot-password-otp", { state: { email } });
                setEmail("");
            }

        } catch (error) {
            AxiosToastError(error)
        }
    };

    return (
        <div className="min-h-full flex flex-col items-center justify-center bg-gray-50 px-4 py-20">
            <div className="text-center">
                <h1 className="text-3xl font-semibold text-gray-900">Forgot your password?</h1>
                <p className="text-gray-600 mt-2 max-w-md">
                    No worries! Enter your email below, and we&apos;ll send you instructions to reset your password.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-md mt-6 space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200"
                >
                    Send Reset Instructions
                </button>
            </form>

            <p className="text-sm text-gray-600 mt-4">
                If you don&apos;t receive an email, please check your spam folder or try again.
            </p>

            <p className="text-gray-600 mt-4">
                Remembered your password?{" "}
                <span 
                    className="text-green-600 font-medium hover:underline cursor-pointer"
                    onClick={() => {
                        if (outletContext?.setIsLoginOpen) {
                            navigate("/")
                            // console.log("Opening Login Popup");
                            outletContext.setIsLoginOpen(true);
                        } else {
                            // console.log("setIsLoginOpen is not available");
                        }
                    }}
                >
                    Log in
                </span>
            </p>
        </div>
    );
};

export default ForgotPassword;
