/* eslint-disable react/prop-types */
import { useState } from "react";

const Login = ({ setIsLoginOpen, setIsRegister }) => {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleChangeLogin = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const isLoginDisabled = !loginData.email || !loginData.password;

    return (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
                {/* Back Button */}
                <button className="cursor-pointer absolute top-4 left-4 text-gray-600 text-2xl" onClick={() => setIsLoginOpen(false)}>
                    &larr;
                </button>

                <h2 className="text-xl font-semibold">Login to Your Account</h2>

                <div className="mt-4">
                    <input
                        value={loginData.email}
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        className="w-full p-2 mb-3 border rounded-md"
                        onChange={handleChangeLogin}
                    />
                    <input
                        value={loginData.password}
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 mb-3 border rounded-md"
                        onChange={handleChangeLogin}
                    />

                    <button 
                        className={`w-full p-2 rounded-md ${isLoginDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#0C831F] text-white cursor-pointer"}`}
                        disabled={isLoginDisabled} 
                    >
                        Login
                    </button>

                    <p className="text-sm text-gray-600 mt-3">
                        Don&apos;t have an account?
                        <span className="text-blue-600 cursor-pointer" onClick={() => setIsRegister(true)}> Register</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
