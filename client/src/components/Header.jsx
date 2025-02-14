import { Link, useLocation } from "react-router-dom";
import logo from "../assets/blinkitlogo.jpg";
import SearchBar from "./SearchBar";
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from "../hooks/useMobile";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function Header() {
    const [isMobile] = useMobile();
    const location = useLocation();
    const isSearchPage = location.pathname === "/search";

    // Login/Register Popup State
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    return (
        <header className="h-28 lg:h-auto lg:max-h-64 bg-white p-2 shadow-md sticky z-50 lg:pt-4">
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

                    {/* Login, User Icon, and Cart */}
                    <div className="flex items-center gap-6 lg:gap-12">
                        {/* User Icon (for mobile) */}
                        <button className="lg:hidden">
                            <FaRegCircleUser size={25} />
                        </button>

                        {/* Login Button */}
                        <button 
                            onClick={() => {
                                setIsLoginOpen(true);
                                setIsRegister(false);
                            }} 
                            className="hidden lg:block text-xl cursor-pointer"
                        >
                            Login
                        </button>

                        {/* Cart Button */}
                        <button className="hidden lg:flex items-center bg-[#0C831F] px-2 py-3 gap-2 text-white cursor-pointer rounded-lg">
                            <div className="hover:animate-bounce">
                                <HiOutlineShoppingCart size={30} />
                            </div>
                            <div className="font-bold">My Cart</div>
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Search Bar */}
            <div className={`container mx-auto px-4 lg:hidden ${isSearchPage && isMobile ? "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" : ""}`}>
                <SearchBar />
            </div>

            {/* Login/Register Modals */}
            {isLoginOpen && (
                isRegister ? 
                    <Register setIsLoginOpen={setIsLoginOpen} setIsRegister={setIsRegister} /> : 
                    <Login setIsLoginOpen={setIsLoginOpen} setIsRegister={setIsRegister} />
            )}
        </header>
    );
}

export default Header;
