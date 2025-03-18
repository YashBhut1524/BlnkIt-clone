/* eslint-disable no-unused-vars */
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import ProductCardForProductListPage from "../components/ProductCardForProductListPage";
import nothing_here_yet from "../assets/nothing_here_yet.webp";

function ProductList() {
    const navigate = useNavigate();
    const { categoryId, subCategoryId } = useParams();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    scrollToTop();

    // Redux store selectors
    const allCategory = useSelector((state) => state.product.allCategory) || [];
    const allSubCategory = useSelector((state) => state.product.allSubCategory) || [];

    // State
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProductsByCategory = async () => {
        setLoading(true);
        try {
            const response = await Axios({
                ...summaryApi.getProductByCategory,
                data: { id: categoryId },
            });

            const allProducts = response.data.data;

            // Filter products by subCategoryId
            const filteredProducts = allProducts.filter(product =>
                product.subCategory.some(subCat => subCat._id === subCategoryId)
            );

            setProducts(filteredProducts);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(true);
        }
    };


    // Fetch subcategories when category changes
    useEffect(() => {
        if (categoryId && allSubCategory.length > 0) {
            const filtered = allSubCategory.filter((subCategory) =>
                subCategory.category.some((category) => category._id === categoryId)
            );
            setFilteredSubCategories(filtered);

            // Navigate only if subCategoryId is not present in the URL
            if (filtered.length > 0 && !subCategoryId) {
                navigate(`/products-list/${categoryId}/${filtered[0]._id}`);
            }
        }
    }, [categoryId, allSubCategory, subCategoryId]);


    // Fetch products when subcategory changes
    useEffect(() => {
        if (subCategoryId) {
            fetchProductsByCategory();
        }
    }, [subCategoryId, categoryId]);

    // const fetchProductsByCategory = async () => {
    //     try {
    //         const response = await Axios({
    //             ...summaryApi.getProductByCategory,
    //             data: { id: categoryId },
    //         });
    //         setProducts(response.data.data);
    //     } catch (error) {
    //         console.log(error);

    //     }
    // };

    return (
        <section className="lg:px-35 w-full mx-auto mt-3 h-full">
            {/* Sticky Category Section */}
            <div className="fixed hidden lg:flex top-22 left-0 w-full bg-white z-10 shadow-md overflow-visible">
                <div className="w-full max-w-screen-xl mx-auto flex justify-center text-[#666666]">
                    {allCategory.slice(0, 6).map((category) => {
                        const firstSubCategory = allSubCategory.find(subCategory =>
                            subCategory.category.some(cat => cat._id === category._id)
                        );

                        return (
                            <div
                                key={category._id}
                                className={`px-5 py-2 text-md cursor-pointer ${categoryId === category._id && "bg-gray-200"
                                    }`}
                                onClick={() => {
                                    navigate(`/products-list/${category._id}/${firstSubCategory?._id || ""}`);
                                    scrollToTop();
                                }}
                            >
                                {category.name}
                            </div>
                        );
                    })}

                    <div className="relative">
                        <button
                            className={`px-3 py-2 flex items-center justify-center gap-1 text-md ${isDropdownOpen && "bg-gray-200 hover:bg-gray-300"
                                } transition duration-200 cursor-pointer`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay closing
                        >
                            More <FaAngleDown />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 bg-white shadow-lg border w-48 overflow-y-auto h-[70vh]">
                                {allCategory.slice(6).map((category) => (
                                    <button
                                        key={category._id}
                                        className="block px-4 py-2 w-full text-left hover:bg-gray-200"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            navigate(`/products-list/${category._id}`);
                                            scrollToTop();
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Category name for md and sm screen */}
            <div className="fixed lg:hidden flex top-30 left-0 w-full bg-white z-10 shadow-md p-2">
                <span>
                    {allCategory.find((category) => category._id === categoryId)?.name ||
                        "Select a Category"}
                </span>
            </div>

            {/* Scrollable Content */}
            <div className="h-screen lg:mt-11 mt-16 grid grid-cols-[100px_1fr] md:grid-cols-[162px_1fr] lg:grid-cols-[260px_1fr]">
                {/* Left (SubCategory) */}
                <div className="h-[80vh] overflow-y-auto flex flex-col rounded border border-gray-200 no-scrollbar">
                    {filteredSubCategories.map((subCategory, index) => (
                        <div
                            key={subCategory._id}
                            className={`flex flex-col my-3 lg:my-0 lg:flex-row lg:px-4 items-center justify-center ${index === 0 && "lg:mt-4 mt-8"
                                } ${subCategoryId === subCategory._id
                                    ? "lg:bg-green-100 lg:border-l-4 border-r-4 border-green-600"
                                    : "lg:hover:bg-green-100 lg:border lg:border-gray-200"
                                }`}
                            onClick={() => {
                                navigate(`/products-list/${categoryId}/${subCategory._id}`);
                                scrollToTop();
                            }}
                        >
                            <img
                                src={subCategory.image}
                                alt={subCategory.name}
                                className="w-12 h-12 lg:w-15 lg:h-15 object-scale-down lg:mt-3"
                            />
                            <button
                                key={subCategory._id}
                                className={`text-[10px] block lg:px-2 text-center w-full lg:text-left lg:text-sm ${subCategoryId === subCategory._id ? "font-bold" : ""
                                    }`}
                            >
                                {subCategory.name}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Right (Products By SubCategory) */}
                {
                    loading ? (
                        <div className="w-110 h-110 flex justify-center items-center">
                                <span className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full"></span>
                        </div>
                    ) : (
                        
                        <div className="pl-2 pb-2 pr-2 overflow-y-scroll h-[80vh] border-r border-gray-200 bg-[#F4F6FB] top-0 no-scrollbar">
                            <div className="py-4 pl-6 text-md w-full bg-white flex items-center justify-between top-0">
                                <h2 className="font-bold">
                                    Buy{" "}
                                    {filteredSubCategories.find((sub) => sub._id === subCategoryId)?.name ||
                                        "Products"}{" "}
                                    online
                                </h2>
                            </div>
                            {products.length === 0 ? (
                                <div className="flex flex-col justify-center items-center">
                                    <img src={nothing_here_yet} alt="No products available" className="w-80 h-80" />
                                    <p className="text-2xl text-[#F8CB46] font-bold">No Product Found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mx-auto container py-4">
                                    {products
                                        .sort((a, b) => (a.stock === 0) - (b.stock === 0))
                                        .map((product, index) => (
                                            <ProductCardForProductListPage data={product} key={index} />
                                        ))}
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
        </section>
    );
}

export default ProductList;
