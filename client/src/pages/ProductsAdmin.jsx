/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import GridLoader from "react-spinners/GridLoader";
import ProductCardAdmin from "./ProductCardAdmin";
import { IoMdSearch } from "react-icons/io";
import NoData from "../components/NoData";

function ProductsAdmin() {
    const [productsData, setProductsData] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalPageCount, setTotalPageCount] = useState(1);
    const [allowToEnterPageNumber, setAllowToEnterPageNumber] = useState(false);
    const [inputPage, setInputPage] = useState(pageNum);
    const [search, setSearch] = useState("");

    const handlePageInput = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setInputPage(value);
        }
    };

    const handlePageSubmit = () => {
        const pageNumber = Number(inputPage);
        if (pageNumber >= 1 && pageNumber <= totalPageCount) {
            setPageNum(pageNumber);
        } else {
            setInputPage(pageNum);
        }
        setAllowToEnterPageNumber(false);
    };

    const fetchProductsData = async () => {
        try {
            if (pageNum === 1) setLoading(true);
            const response = await Axios({
                ...summaryApi.getProduct,
                data: {
                    page: pageNum,
                    limit: 10,
                    search: search,
                },
            });
            // console.log("response: ", response);

            if (response.data.success) {
                setProductsData(response.data.data);
                setTotalPageCount(response.data.totalNoPage);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setPageNum(1);
        setSearch(value);
    };
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchProductsData();
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        fetchProductsData();
    }, [pageNum]);

    return (
        <section>
            <div className="h-[70vh] bottom-0">
                {
                    loading ? (
                        <div className="flex justify-center items-center">
                            <span className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full"></span>
                        </div>
                    ) : (
                        <>
                            {/* Heading & SearchBar */}
                            <div className="p-2 bg-white shadow-xl flex items-center justify-between sticky top-0 z-10">
                                <h2 className="font-semibold">Product Admin</h2>
                                <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 bg-white">
                                    <IoMdSearch size={20} className="text-gray-500 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={handleSearchChange}
                                        className="outline-none focus:ring-0 bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* No Data Found Page when there is no Product Available */}
                            {!productsData.length && !loading && (
                                <NoData
                                    message="No Products Found"
                                    subMessage="Try adding a new Products."
                                />
                            )}

                            {/* Product Cards */}
                            <div className="min-h-[55vh] p-4 overflow-y-hidden">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-2">
                                    {productsData.map((p) => (
                                        <ProductCardAdmin
                                            key={p._id}
                                            data={p}
                                            fetchProductsData={fetchProductsData}
                                        />
                                    ))}
                                </div>
                            </div>
                        </>
                    )
                }
                {/* Page Navigation */}
                <div className="flex justify-center items-center gap-2 sm:gap-4 mt-0 flex-wrap">
                    {/* Hide on small screens */}
                    <button
                        className="hidden sm:block px-3 py-2 rounded-md shadow-sm transition duration-200 active:scale-95 
                                    bg-green-600 text-white hover:bg-[#318616] disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                        onClick={() => setPageNum(1)}
                        disabled={pageNum === 1}
                    >
                        First
                    </button>

                    <button
                        className="w-20 h-10 flex items-center justify-center rounded-md shadow-sm transition duration-200 active:scale-95 
                                    bg-green-600 text-white hover:bg-[#318616] disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                        onClick={() => setPageNum(pageNum - 1)}
                        disabled={pageNum === 1}
                    >
                        Previous
                    </button>

                    <span
                        className="text-gray-800 font-medium px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer"
                        onClick={() => setAllowToEnterPageNumber(true)}
                    >
                        {allowToEnterPageNumber ? (
                            <input
                                type="number"
                                value={inputPage}
                                onChange={handlePageInput}
                                onBlur={handlePageSubmit}
                                onKeyDown={(e) => e.key === "Enter" && handlePageSubmit()}
                                className="w-12 text-center outline-none"
                                autoFocus
                            />
                        ) : (
                            `${pageNum}`
                        )}
                        / {totalPageCount}
                    </span>

                    <button
                        className="w-20 h-10 flex items-center justify-center rounded-md shadow-sm transition duration-200 active:scale-95 
                                    bg-green-600 text-white hover:bg-[#318616] disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                        onClick={() => setPageNum(pageNum + 1)}
                        disabled={pageNum === totalPageCount}
                    >
                        Next
                    </button>

                    {/* Hide on small screens */}
                    <button
                        className="hidden sm:block px-3 py-2 rounded-md shadow-sm transition duration-200 active:scale-95 
                                    bg-green-600 text-white hover:bg-[#318616] disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                        onClick={() => setPageNum(totalPageCount)}
                        disabled={pageNum === totalPageCount}
                    >
                        Last
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ProductsAdmin;
