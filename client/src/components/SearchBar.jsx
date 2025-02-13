import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from 'react-type-animation';
import useMobile from "../hooks/useMobile";
import { FaArrowLeftLong } from "react-icons/fa6";

function SearchBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchPage, setIsSearchPage] = useState(false);
    const [isMobile, setIsMobile] = useMobile();

    useEffect(() => {
        setIsSearchPage(location.pathname === "/search");
    }, [location]);

    const searchItems = ["milk", "bread", "sugar", "apple", "paneer", "chocolate", "rice", "butter"];
    const sequence = searchItems.flatMap(item => [`Search "${item}"`, 500]);

    const redirectToSearchPage = () => {
        navigate("/search");
    };

    return (
        <div className="w-full min-w-[300px] lg:min-w-[720px] rounded-lg border border-neutral-200 overflow-hidden flex items-center h-12 lg:h-full bg-slate-50 px-3">
            <div>
                {
                    (isSearchPage && isMobile) 
                    ? (
                        <Link to={"/"} className="flex justify-center items-center h-full pr-3 mt-1 text-neutral-800">
                            <FaArrowLeftLong size={22}/>
                        </Link>
                    ) 
                    : (
                        <button className="flex justify-center items-center h-full p-3 text-neutral-800">
                            <IoSearch size={22} />
                        </button>
                    )
                }

            </div>
            <div className="w-full h-full flex items-center">
                {!isSearchPage ? (
                    // Placeholder animation when not on search page
                    <div className="text-neutral-500 w-full" onClick={redirectToSearchPage}>
                        <TypeAnimation
                            sequence={[...sequence]}
                            wrapper="span"
                            cursor={true}
                            repeat={Infinity}
                        />
                    </div>
                ) : (
                    // Input field on the search page
                    <input 
                        type="text" 
                        placeholder="What are you looking for today?"
                        className="bg-transparent w-full h-full outline-none"
                        autoFocus={true}
                    />
                )}
            </div>
        </div>
    );
}

export default SearchBar;
