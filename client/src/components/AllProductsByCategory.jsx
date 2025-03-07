import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import summaryApi from '../common/summaryApi';
import { FaAngleDown } from 'react-icons/fa6';
import ProductCardForProductListPage from './ProductCardForProductListPage';

function AllProductsByCategory() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const [loading, setLoading] = useState(true);
    const [productData, setProductData] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const allCategory = useSelector(state => state.product.allCategory) || [];
    
    const location = useLocation();
    const categoryId = location.state?.categoryId;

    // Only set the category on mount or when categoryId changes
    useEffect(() => {
        if (categoryId) {
            setCurrentCategory(categoryId);
        }
    }, [categoryId]);

    const fetchProductsByCategory = async () => {
        if (!currentCategory) return;

        try {
            setLoading(true);
            const response = await Axios({
                ...summaryApi.getProductByCategory,
                data: { id: currentCategory },
            });

            if (response.data.success) {
                setProductData(response.data.data);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductsByCategory();
    }, [currentCategory]); // Runs only when currentCategory changes

    return (
        <section className="lg:px-35 w-full mx-auto mt-3 h-full">
            {/* Sticky Category Section */}
            <div className="fixed hidden lg:flex top-22 left-0 w-full bg-white z-10 shadow-md overflow-visible">
                <div className="w-full max-w-screen-xl mx-auto flex justify-center text-[#666666]">
                    {allCategory.slice(0, 6).map((category) => (
                        <div
                            key={category._id}
                            className={`px-5 py-2 text-md cursor-pointer ${currentCategory === category._id && "bg-gray-200"}`}
                            onClick={() => {
                                setCurrentCategory(category._id);
                                scrollToTop();
                            }}
                        >
                            {category.name}
                        </div>
                    ))}
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
                                            setCurrentCategory(category._id);
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
            {/* Empty Space */}
            <div className='border border-gray-300 h-17'></div>
            {/* Category name for md and sm screen */}
            <div className="fixed lg:hidden flex top-30 left-0 w-full bg-white z-10 shadow-md p-2">
                <span>
                    {allCategory.find(cat => cat._id === currentCategory)?.name || "Select a Category"}
                </span>
            </div>
            {/* Product List */}
            <div className='border-1 border-gray-200 bg-[#F2F4FA]'>
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-3">
                        {[...productData]
                            .sort((a, b) => (a.stock === 0) - (b.stock === 0)) // Moves out-of-stock items to the end 
                            .map((product) => (
                                <div 
                                    key={product._id} 
                                    className="relative hover:shadow-2xl hover:scale-105 transition duration-200"
                                >
                                    <ProductCardForProductListPage data={product}/>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </section>
    );
}

export default AllProductsByCategory;
