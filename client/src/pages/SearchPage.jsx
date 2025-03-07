import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import ProductCardForProductListPage from "../components/ProductCardForProductListPage";
import nothing_here_yet from "../assets/nothing_here_yet.webp"

function SearchPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("q") || ""; // Ensure it's not null

    // console.log("searchQuery: ", searchQuery);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [message, setMessage] = useState("");
    const loaderRef = useRef(null);

    const fetchProductData = async () => {
        if (!searchQuery) return;
    
        try {
            setLoading(true);
            const response = await Axios({
                ...summaryApi.searchProduct,
                data: { search: searchQuery, page, limit: 10 },
            });
    
            if (response.data.success) {
                setData((prev) => {
                    const uniqueProducts = new Map(prev.map((p) => [p._id, p]));
                    response.data.data.forEach((product) => {
                        uniqueProducts.set(product._id, product);
                    });
                    return Array.from(uniqueProducts.values());
                });
                setHasMore(response.data.data.length === 10);
            } else {
                setMessage("No product found!");
                setHasMore(false);
            }
        } catch (error) {
            AxiosToastError(error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchQuery) {
            setData([]); // Clear data when search is empty
            setHasMore(false);
            return;
        }
        setData([]);
        setPage(1);
        setHasMore(true);
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery) fetchProductData();
    }, [page]); // Fetch only when page changes & searchQuery exists

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!loaderRef.current || !hasMore || !searchQuery) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, [hasMore, searchQuery]);

    if (!searchQuery) return null; // Hide everything if search is empty

    return (
        <section className="lg:px-35 w-full mx-auto lg:mt-3 mt-10 h-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-3">
                {data.map((product) => (
                    <div
                        key={product._id}
                        className="relative hover:shadow-2xl hover:scale-105 transition duration-200"
                    >
                        <ProductCardForProductListPage data={product} />
                    </div>
                ))}
            </div>

            {/* Loader for Infinite Scroll */}
            {hasMore && (
                <div ref={loaderRef} className="flex justify-center items-center py-4">
                    <span className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full"></span>
                </div>
            )}

            {/* No Products Found Message */}
            {!loading && data.length === 0 && (
                <div className="flex flex-col gap-5 pt-[20%] justify-center items-center h-40 text-gray-400">
                    <img src={nothing_here_yet} alt={message} className="w-60 h-130"/>
                    <p className="lg:text-5xl text-3xl font-bold">Nothing here yet</p>
                </div>
            )}
        </section>
    );
}

export default SearchPage;
