/* eslint-disable no-unused-vars */
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import ProductCardForProductListPage from "../components/ProductCardForProductListPage";
import { validURLConvertor } from "../utils/validURLConvertor";
import nothing_here_yet from "../assets/nothing_here_yet.webp"

function ProductList() {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    scrollToTop();
    // Redux store selectors
    const allCategory = useSelector(state => state.product.allCategory) || [];
    const allSubCategory = useSelector(state => state.product.allSubCategory) || [];

    // Extracting category ID from URL params
    // const params = useParams();
    // const categoryId = params.category?.split("-").pop();
    // const subCategoryId = params.subcategory?.split("-").pop();
    const location = useLocation();
    const { categoryId, subCategoryId } = location.state 

    // State
    const [currentCategory, setCurrentCategory] = useState(null);
    const [currentSubCategory, setCurrentSubCategory] = useState(null);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [products, setProducts] = useState([]);

    const findCurrentCategory = () => {
        const selectedCategory = allCategory.find(category => category._id === categoryId) || null;
            setCurrentCategory(selectedCategory);
    }

    const findCurrentSubCategory = () => {
        const selectedSubCategory = allSubCategory.find(subCategory => subCategory._id === subCategoryId) || null;
            setCurrentSubCategory(selectedSubCategory);
    }

    const filteredProducts = products.filter(product => 
        product.subCategory.some(subCat => subCat._id === currentSubCategory?._id)
    );

    useEffect(() => {
        findCurrentSubCategory()
        findCurrentCategory()
    }, [])

    // Find and set the selected subcategory
    useEffect(() => {
        if (subCategoryId && allSubCategory.length > 0) {
            findCurrentSubCategory()
        }
    }, [subCategoryId, allSubCategory]);

    // Find and set the selected category
    useEffect(() => {
        if (categoryId && allCategory.length > 0) {
            findCurrentCategory()
            // fetchProductsByCategory()
            // fetchProductsByCategoryAndSubcategory()
        }
    }, [categoryId, allCategory]);

    // Filter subcategories based on the selected category
    useEffect(() => {
        if (currentCategory && allSubCategory.length > 0) {
            const filtered = allSubCategory.filter(subCategory =>
                subCategory.category.some(category => category._id === currentCategory._id)
            );
            setFilteredSubCategories(filtered);
            setCurrentSubCategory(filtered.length > 0? filtered[0] : null);
            fetchProductsByCategory()
            // fetchProductsByCategoryAndSubcategory()
        }
    }, [currentCategory, allSubCategory]);

    const fetchProductsByCategory = async () => {
        try {
            const response = await Axios({
                ...summaryApi.getProductByCategory,
                data: {
                    id: currentCategory?._id,
                },
            })
            // console.log("response: ",response.data);
            setProducts(response.data.data);
        } catch (error) {
            // console.log(error);
        }
    }
    
    return (
        <section className="lg:px-35 w-full mx-auto mt-3 h-full">
            {/* Sticky Category Section */}
            <div className="fixed hidden lg:flex top-22 left-0 w-full bg-white z-10 shadow-md overflow-visible">
                <div className="w-full max-w-screen-xl mx-auto flex justify-center text-[#666666]">
                    {allCategory.slice(0, 6).map((category) => 
                    {
                        return (
                            <div
                                key={category._id}
                                className={`px-5 py-2 text-md cursor-pointer ${currentCategory?._id === category._id && "bg-gray-200"}`}
                                onClick={() => {
                                    setCurrentCategory(category)
                                    scrollToTop();
                                }}
                            >
                                {category.name}
                            </div>
                        )
                    }
                    )}
                    <div className="relative">
                        <button 
                            className={`px-3 py-2 flex items-center justify-center gap-1 text-md ${isDropdownOpen && "bg-gray-200 hover:bg-gray-300"} transition duration-200 cursor-pointer`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}    
                            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}  // Delay closing
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
                                            e.preventDefault(); // Prevents the button from losing focus
                                            setCurrentCategory(category);
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
                <span>{currentCategory?.name || "Select a Category"}</span>
            </div>

            {/* Scrollable Content */}
            <div className="h-screen lg:mt-11 mt-16 grid grid-cols-[100px_1fr] md:grid-cols-[162px_1fr] lg:grid-cols-[260px_1fr]">
                {/* Left (SubCategory) */}
                <div className="h-[80vh] overflow-y-auto flex flex-col rounded border border-gray-200 no-scrollbar">
                    {
                        filteredSubCategories.map((subCategory, index) => {
                            // const link = `/${validURLConvertor(subCategory?.category[0]?.name)}-${subCategory?.category[0]?._id}/${validURLConvertor(subCategory.name)}-${subCategory._id}`
                            return (
                            <div 
                                key={subCategory._id + index} 
                                className={`flex flex-col my-3 lg:my-0 lg:flex-row lg:px-4 items-center justify-center ${index === 0 && "lg:mt-4 mt-8"} ${currentSubCategory?._id === subCategory._id ? "lg:bg-green-100 lg:border-l-4 border-r-4 border-green-600 md:border-r-4 " : "lg:hover:bg-green-100 lg:border lg:border-gray-200"}`}
                                onClick={() => {
                                    setCurrentSubCategory(subCategory)
                                    scrollToTop();
                                }}
                            >
                                <img 
                                    src={subCategory.image} 
                                    alt={subCategory.name}  
                                    className="w-12 h-12 lg:w-15 lg:h-15 object-scale-down lg:mt-3"
                                />
                                <button key={subCategory._id} className={`text-[10px] block lg:px-2 text-center w-full lg:text-left lg:text-sm ${currentSubCategory?._id === subCategory._id ? "font-bold" : ""}`}>
                                    {subCategory.name}
                                </button>
                            </div>
                        )})
                    }
                </div>

                {/* Right (Products By SubCategory) */}
                <div className="pl-2 pb-2 pr-2 overflow-y-scroll h-[80vh] border-r border-gray-200 bg-[#F4F6FB] top-0 no-scrollbar">
                    <div className="py-4 pl-6 text-md w-full bg-white flex items-center justify-between top-0">
                        <h2 className="font-bold">Buy {currentSubCategory?.name} online</h2>
                    </div>
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col justify-center items-center">
                            <img src={nothing_here_yet} alt="No products available" className="w-80 h-80" />
                            <p className="text-2xl text-[#F8CB46] font-bold">No Product Found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 mx-auto container py-4">
                            {filteredProducts
                                .sort((a, b) => (a.stock === 0) - (b.stock === 0)) // Moves out-of-stock items to the end
                                .map((product, index) => (
                                    <ProductCardForProductListPage data={product} key={index} />
                                ))
                            }
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default ProductList;
