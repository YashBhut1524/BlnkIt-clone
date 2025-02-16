/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../utils/Axios";
import summaryApi from "../../common/summaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import toast from "react-hot-toast";

const Login = ({ setIsLoginOpen, setIsRegister }) => {
    const [loginData, setLoginData] = useState({ 
        email: "", 
        password: "" 
    });
    const navigate = useNavigate(); 

    const handleForgotPassword = () => {
        setIsLoginOpen(false); // Close Login Popup
        navigate("/forgot-password"); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await Axios({
                ...summaryApi.login,
                data: loginData
            }) 
            // console.log("response: ", response);

            if(response.data.error) {
                toast.error(response.data.message)
            }
            if (response.data.success) {
                // console.log("response: ", response);
                toast.success(response.data.message);
                localStorage.setItem("accessToken", response.data.data.accessToken)
                localStorage.setItem("refreshToken", response.data.data.refreshToken)
                setLoginData({
                    email: "",
                    password: "",
                });
                setIsLoginOpen(false); // This will close the register pop-up
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
                {/* Close Button */}
                <button className="cursor-pointer absolute top-4 left-4 text-gray-600 text-2xl" onClick={() => setIsLoginOpen(false)}>
                    &larr;
                </button>

                <h2 className="text-xl font-semibold">Login to Your Account</h2>

                <div className="mt-4">
                    {/* Email Input */}
                    <input
                        value={loginData.email}
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="w-full p-2 mb-3 border rounded-md"
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />

                    {/* Password Input */}
                    <input
                        value={loginData.password}
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 mb-1 border rounded-md"
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />

                    {/* Forgot Password - Now Uses useNavigate */}
                    <div className="text-right w-full mb-3">
                        <span className="text-blue-500 text-sm cursor-pointer" onClick={handleForgotPassword}>
                            Forgot password?
                        </span>
                    </div>

                    {/* Login Button */}
                    <button 
                        className={`w-full p-2 rounded-md ${!loginData.email || !loginData.password ? "bg-gray-400 cursor-not-allowed" : "bg-[#0C831F] text-white cursor-pointer"}`}
                        disabled={!loginData.email || !loginData.password}
                        onClick={handleSubmit}
                        
                    >
                        Login
                    </button>

                    {/* Register Option */}
                    <p className="text-sm text-gray-600 mt-3">
                        Don&apos;t have an account?{" "}
                        <span className="text-blue-600 cursor-pointer" onClick={() => setIsRegister(true)}> Register</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
