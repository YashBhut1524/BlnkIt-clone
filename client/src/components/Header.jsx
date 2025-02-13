import { Link, useLocation } from "react-router-dom";
import logo from "../assets/blinkitlogo.jpg";
import SearchBar from "./SearchBar";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useState } from "react";

function Header() {
    const [isMobile] = useMobile();
    const location = useLocation();
    const isSearchPage = location.pathname === "/search";

    // Login/Register Popup State
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [passwordError, setPasswordError] = useState(""); // State for password error

    const handleChangeRegister = (e) => {
        const { name, value } = e.target;
    
        setRegisterData((prev) => ({
            ...prev,
            [name]: value,
        }));
    
        // Ensure validation runs on every keystroke
        if (name === "password" || name === "confirmPassword") {
            setPasswordError(value !== registerData.password && name === "confirmPassword" ? "Passwords do not match" : "");
        }
    };

    const handleChangeLogin = (e) => {
        const { name, value } = e.target;

        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Disable Register button if fields are empty or password mismatch
    const isRegisterDisabled =
        !registerData.name ||
        !registerData.email ||
        !registerData.password ||
        !registerData.confirmPassword ||
        passwordError !== "";

    // Disable Login button if fields are empty
    const isLoginDisabled = !loginData.email || !loginData.password;

    return (
        <header className="h-28 lg:h-auto lg:max-h-64 p-2 shadow-md sticky z-50 lg:pt-4">
            {!(isSearchPage && isMobile) && (
                <div className="container mx-auto flex gap-1 items-center px-4 justify-between lg:max-w-full">
                    {/* Logo */}
                    <div className="h-full">
                        <Link to="/" className="h-full flex items-center justify-center">
                            <img src={logo} alt="BlinkIt" className="max-w-[100px] max-h-[50px] w-auto h-auto" />
                        </Link>
                    </div>

                    {/* Search Section */}
                    <div className="hover:cursor-pointer hidden lg:block">
                        <SearchBar />
                    </div>

                    {/* Login and Cart */}
                    <div>
                        <button className="lg:hidden">
                            <FaRegCircleUser size={25} />
                        </button>
                        <div className="hidden lg:flex items-center gap-12">
                            <button 
                                onClick={() => {
                                    setIsLoginOpen(true);
                                    setIsRegister(false); // Open Login by default
                                }}
                                className="text-xl cursor-pointer"
                            >
                                Login
                            </button>
                            <button className="flex items-center bg-[#0C831F] px-2 py-3 gap-2 text-white cursor-pointer rounded-lg">
                                <div className="hover:animate-bounce">
                                    <HiOutlineShoppingCart size={30} />
                                </div>
                                <div className="font-bold">My Cart</div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className={`container mx-auto px-4 lg:hidden ${isSearchPage && isMobile ? "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" : ""}`}>
                <SearchBar />
            </div>

            {/* Login/Register Modal */}
            {isLoginOpen && (
                <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
                        {/* Back Button */}
                        <button className="cursor-pointer absolute top-4 left-4 text-gray-600 text-2xl" onClick={() => setIsLoginOpen(false)}>
                            &larr;
                        </button>
                        <img src={logo} alt="BlinkIt" className="w-30 h-20 mx-auto mb-4" />

                        {/* Form Title */}
                        <h2 className="text-xl font-semibold">
                            {isRegister ? "Create an Account" : "Login to Your Account"}
                        </h2>

                        {/* Login & Register Forms */}
                        <div className="mt-4">
                            {isRegister ? (
                                // Register Form
                                <>
                                    <input
                                        value={registerData.name}
                                        name="name"
                                        type="text" 
                                        placeholder="Full Name"
                                        className="w-full p-2 mb-3 border rounded-md"
                                        onChange={handleChangeRegister}
                                    />
                                    <input
                                        value={registerData.email}
                                        name="email"
                                        type="email" 
                                        placeholder="Email Address"
                                        className="w-full p-2 mb-3 border rounded-md"
                                        onChange={handleChangeRegister}
                                    />
                                    <input
                                        value={registerData.password}
                                        name="password"
                                        type="password" 
                                        placeholder="Password"
                                        className="w-full p-2 mb-3 border rounded-md"
                                        onChange={handleChangeRegister}
                                    />
                                    <input
                                        value={registerData.confirmPassword}
                                        name="confirmPassword"
                                        type="password" 
                                        placeholder="Confirm Password"
                                        className="w-full p-2 mb-1 border rounded-md"
                                        onChange={handleChangeRegister}
                                    />
                                    {/* Error Message for Password Mismatch */}
                                    {passwordError && <p className="text-red-500 text-sm mb-3">{passwordError}</p>}

                                    <button 
                                        className={`w-full p-2 rounded-md ${isRegisterDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#0C831F] text-white cursor-pointer"}`}
                                        disabled={isRegisterDisabled} 
                                    >
                                        Register
                                    </button>
                                    <p className="text-sm text-gray-600 mt-3">
                                        Already have an account?
                                        <span className="text-blue-600 cursor-pointer" onClick={() => setIsRegister(false)}> Login</span>
                                    </p>
                                </>
                            ) : (
                                // Login Form
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;
