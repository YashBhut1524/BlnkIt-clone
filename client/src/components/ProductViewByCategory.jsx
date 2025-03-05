/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { useEffect, useState, useRef } from "react";
import CardLoadingSkeleton from "./CardLoadingSkeleton";
import ProductCard from "./ProductCard";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

function ProductViewByCategory({ id, name }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef(null); // Reference for scrolling container

    const loadingCardNumber = new Array(5).fill(null);

    const fetchProductsByCategory = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...summaryApi.getProductByCategory,
                data: {
                    id,
                },
            });
            // console.log(response.data);
            setData(response.data.data);
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductsByCategory();
    }, []);

    // Scroll Left Function
    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -600, behavior: "smooth" });
        }
    };

    // Scroll Right Function
    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 600, behavior: "smooth" });
        }
    };

    return (
        <>
            <div className="mx-auto flex justify-between">
                <h2 className="font-bold text-lg mb-3">{name}</h2>
                <Link to={""} className="text-[#0C831F] text-xl font-semibold">
                    see all
                </Link>
            </div>

            <div className="relative w-full">
                {/* Left Arrow Button */}
                <button 
                    onClick={scrollLeft} 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-10"
                >
                    <FaAngleLeft />
                </button>

                {/* Product List */}
                <div 
                    ref={containerRef} 
                    className="flex gap-4 md:gap-5 lg:gap-6 mx-auto container py-4 overflow-hidden whitespace-nowrap"
                >
                    {loading &&
                        loadingCardNumber.map((_, index) => (
                            <CardLoadingSkeleton key={index} />
                        ))
                    }
                    {data
                        .filter(product => product.stock !== 0) // Exclude out-of-stock products
                        .slice(0, 15)
                        .map((product, index) => (
                            <ProductCard data={product} key={index} />
                        ))
                    }
                </div>

                {/* Right Arrow Button */}
                <button 
                    onClick={scrollRight} 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 z-10"
                >
                    <FaAngleRight />
                </button>
            </div>
        </>
    );
}

export default ProductViewByCategory;
