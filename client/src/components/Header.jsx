/* eslint-disable no-unused-vars */
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/blinkitlogo.jpg";
import SearchBar from "./SearchBar";
import useMobile from "../hooks/useMobile";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import UserMenu from "./UserMenu";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

function Header() {
    const [isMobile] = useMobile();
    const location = useLocation();
    const isSearchPage = location.pathname === "/search";
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    // console.log("user from store: ", user);
    

    // Login/Register Popup State
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const [userData, setUserData] = useState(user);

useEffect(() => {
    // console.log("User state updated:", user);
        setOpenUserMenu(false);  // Close the user menu when user logs in
        setUserData(user); // Update local state when Redux updates
    }, [user]);

    const handleMobileUser = () => {
        if(!user._id) {
            setIsLoginOpen(true)
        }
        navigate("/user-menu")
    }

    return (
        <header className="fixed top-0 left-0 w-full h-28 lg:h-22 lg:min-h-15 bg-white px-2 border-b border-gray-200 z-40">
            {!(isSearchPage && isMobile) && (
                <div className="container mx-auto flex gap-1 items-center px-4 justify-between lg:max-w-full">
                    {/* Logo */}
                    <div className="h-full lg:p-2 lg:border-r border-gray-200">
                        <Link to="/" className="h-full flex items-center justify-center">
                            <img src={logo} alt="BlinkIt" className="lg:max-w-[110px] lg:max-h-[65px] max-w-[100px] max-h-[50px] w-auto h-auto" />
                        </Link>
                    </div>

                    {/* Search Section */}
                    <div className="hover:cursor-pointer hidden lg:block">
                        <SearchBar />
                    </div>

                    {/* Login, User Icon, and Cart */}
                    <div className="flex items-center gap-4 lg:gap-8">
                        {/* User Icon (for mobile) */}
                        <button 
                            className="lg:hidden"
                            onClick={handleMobileUser}
                        >
                        {user?.avatar && user.avatar !== "" 
                            ? (
                                <img 
                                    src={user.avatar} 
                                    alt="User Avatar" 
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <FaUserCircle size={25} className="text-black" />
                            )
                        }
                        </button>

                        {/* Login Button */}
                        {
                            user?._id 
                                ? (
                                    <div className="hidden lg:block relative w-[40%] p-2 select-none">
                                        <div 
                                            className="flex gap-2 items-center cursor-pointer p-2 hover:bg-[#f6f2f2] rounded-md"
                                            onClick={() => setOpenUserMenu(prev => !prev)}
                                        >
                                            <p className="text-lg">Account</p>
                                            {openUserMenu ? <IoMdArrowDropup size={60} /> : <IoMdArrowDropdown size={60} />}
                                        </div>
                                        <div className="absolute right-0 top-16">
                                            {openUserMenu && (
                                                <div className="bg-[#ffffff] rounded-md p-4 min-w-52 lg:shadow-lg">
                                                    <UserMenu closeMenu={() => setOpenUserMenu(false)} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) 
                                : (
                                    <button 
                                        onClick={() => {
                                            setIsLoginOpen(true);
                                            setIsRegister(false);
                                        }} 
                                        className="hidden lg:block text-xl cursor-pointer"
                                    >
                                        Login
                                    </button>
                                )
                        }

                        {/* Cart Button */}
                        <button className="min-w-[8rem] w-auto justify-around hidden lg:flex items-center bg-[#0C831F] px-2 py-3 gap-1 text-white cursor-pointer rounded-lg">
                            <div className="hover:animate-bounce">
                                <HiOutlineShoppingCart size={30} />
                            </div>
                            <div className="font-bold">
                                My Cart
                            </div>
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
