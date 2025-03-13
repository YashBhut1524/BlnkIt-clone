import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { CiStopwatch } from "react-icons/ci";
import { FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaCaretUp } from "react-icons/fa";
import minute_delivery from "../assets/minute_delivery.png";
import Best_Prices_Offers from "../assets/Best_Prices_Offers.png"
import Wide_Assortment from "../assets/Wide_Assortment.png"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import AddToCartButton from "../components/AddToCartButton";

function ProductDetails() {

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    useEffect(() => {
        scrollToTop();
    }, []);


    const params = useParams();
    let productId = params?.product.split("-").pop();

    const navigate = useNavigate();

    const containerRef = useRef(null);

    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showMoreDetails, setShowMoreDetails] = useState(false);

    const formattedUnit = /^\d+$/.test(productData?.unit) ? `${productData?.unit} Unit` : productData?.unit;

    const firstDetail = productData?.more_details
        ? Object.entries(productData.more_details)[0]
        : null;

    // Scroll Left Function
    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -100, behavior: "smooth" });
        }
    };

    // Scroll Right Function
    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: 100, behavior: "smooth" });
        }
    };

    const fetchProductData = async () => {
        try {
            const response = await Axios({
                ...summaryApi.getProductById,
                data: { id: productId },
            });
            // console.log("response: ", response);

            if (response.data.success) {
                setProductData(response.data.data);
                setImages(response.data.data.image);
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRedirectToProductList = (categoryId, subCategoryId) => {
        navigate("/products-list", { state: { categoryId, subCategoryId } });

    }
    
    // Set selectedImage once images array is updated
    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [images]);

    useEffect(() => {
        fetchProductData();
        // console.log(productData);
    }, []);

    return (
        <>
            {/* lg and above screen */}
            <div className="hidden lg:grid lg:grid-cols-[48vw_1fr] w-full px-24 mb-5 mx-auto">
                {/* Left Section: Image & Description */}
                <div className="flex flex-col border-r-1 border-gray-200">
                    <div className="h-[81vh] flex flex-col gap-5 justify-center items-center bg-white border-b-1 border-gray-200">
                        {loading ? (
                            <div className="w-110 h-110 flex justify-center items-center">
                                <span className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full"></span>
                            </div>
                        ) : (
                            selectedImage && (
                                <img
                                    src={selectedImage}
                                    alt="Product"
                                    className="w-100 h-100 object-contain"
                                />
                            )
                        )}
                        {/* Other images */}
                        <div className="relative w-full flex flex-col items-center justify-center">
                            {/* Image Thumbnails with Arrows */}
                            <div className="flex gap-10 items-center w-[60%] mt-4">
                                {/* Left Arrow */}
                                {images.length > 5 && (
                                    <button
                                        onClick={scrollLeft}
                                        className="bg-white p-2 rounded-full shadow-black shadow-md hover:bg-gray-100 z-10"
                                    >
                                        <FaAngleLeft />
                                    </button>
                                )}

                                {/* Thumbnails */}
                                <div
                                    ref={containerRef}
                                    className="flex pt-2 gap-3 pb-2 overflow-x-hidden scroll-smooth snap-x snap-mandatory"
                                    style={{ scrollPaddingLeft: "1rem", scrollPaddingRight: "1rem" }}
                                >
                                    {images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt="Thumbnail"
                                            className={`w-20 h-20 object-cover rounded-lg cursor-pointer snap-center transition-transform hover:scale-110 border-2 ${
                                                selectedImage === image ? "border-green-500" : "border-transparent"
                                            }`}
                                            onClick={() => setSelectedImage(image)}
                                        />
                                    ))}
                                </div>

                                {/* Right Arrow */}
                                {images.length > 5 && (
                                    <button
                                        onClick={scrollRight}
                                        className=" bg-white p-2 rounded-full shadow-black shadow-md hover:bg-gray-100 z-10"
                                    >
                                        <FaAngleRight />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Description */}
                    <div className="mt-4 p-4 bg-white rounded-lg">
                        <h1 className="text-2xl font-semibold">Product Details</h1>
                        <div className="flex flex-col gap-4 mt-5">
                            {
                                productData?.more_details &&
                                Object.entries(productData.more_details).map(([key, value], index, array) => (
                                    <div key={index} className="flex flex-col gap-2">
                                        {/* Show description at the end of the list */}
                                        {index === array.length - 1 && (
                                            <>
                                                <span className="font-semibold text-md">Description</span>
                                                <span className="font-semibold text-sm text-[#666666]">{productData.description}</span>
                                            </>
                                        )}
                                        <span className="font-semibold text-md">{key}</span>
                                        <span className="font-semibold text-sm text-[#666666]">{value}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {/* Right Section: Other Details (Sticky) */}
                <div className="flex flex-col w-full h-full bg-white pb-10">
                    <div className="sticky top-24 pt-10 pb-15 bg-white px-10 ">
                        {/* URL, Name, Time */}
                        <div className="border-b-1 border-gray-200 pb-3">
                            {/* Url */}
                            <div className="text-[13px]">
                                <Link to={"/"} className="font-medium">Home / </Link>

                                <span
                                    className="font-medium cursor-pointer"
                                    onClick={() => handleRedirectToProductList(productData?.category[0]._id, productData?.subCategory[0]._id,)}
                                >
                                    {productData?.subCategory[0].name} / </span>
                                <span className="text-[#666666]">{productData?.name}</span>
                            </div>
                            {/* Product Name */}
                            <h1 className="text-2xl font-bold font-sans mt-3">{productData?.name}</h1>
                            {/* Time */}
                            <div className='px-2 py-1 rounded w-fit flex bg-[#F5F5F5] items-center justify-center mt-2 '>
                                <CiStopwatch size={12} /> <span className="text-xs font-semibold">8 MINS</span>
                            </div>
                            {/* View similar Product Text */}
                            <div
                                className="flex items-center mt-2 cursor-pointer"
                                onClick={() => handleRedirectToProductList(productData?.category[0]._id, productData?.subCategory[0]._id,)}
                            >
                                <p className="text-[#0C831F] text-lg font-semibold">View other products</p>
                                <FaCaretRight className="text-[#0C831F]" />
                            </div>
                        </div>
                        <div className="my-5">
                            {/* product Details */}
                            <div className="flex justify-between">
                                {/* Unit, Price */}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-[0.8rem] text-[#666666]">{formattedUnit}</span>
                                    {productData?.stock === 0 ? (
                                        <span className="text-md font-bold text-red-500">Out of Stock</span>
                                    ) : productData?.discount > 0 ? (
                                        <div className="flex items-center gap-1">
                                            <span className="text-md font-bold text-gray-500">MRP</span>
                                            <span className="text-md font-bold line-through text-gray-500">
                                                &#8377;{productData?.price}
                                            </span>
                                            <span className="text-md font-bold text-black">
                                                &#8377;{(productData?.price - (productData?.price * productData?.discount / 100)).toFixed(2)}
                                            </span>
                                            <span className="text-white px-1 rounded bg-[#538CEE] font-semibold text-[x-small]">
                                                {`${productData?.discount}% OFF`}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm font-medium">
                                            MRP <span className="font-bold">&#8377;{productData?.price}</span>
                                        </span>
                                    )}
                                    <span className="text-[0.8rem] text-[#666666]">(Inclusive of all taxes)</span>
                                </div>
                                {/* add button */}
                                <div className="w-fit">
                                    <AddToCartButton data={productData || ""}/>
                                </div>
                            </div>
                            {/* Other Info about blinkit */}
                            <div className="mt-5">
                                <h3 className="font-bold">Why shop from blinkit?</h3>
                                <div className="flex pt-4 items-center gap-4">
                                    <img src={minute_delivery} alt="" className="w-15 h-15" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs">Superfast Delivery</span>
                                        <span className="text-[0.8rem] text-[#666666] leading-none">
                                            Get your order delivered to your doorstep at the earliest from dark stores near you
                                        </span>
                                    </div>
                                </div>
                                <div className="flex pt-4 items-center gap-4">
                                    <img src={Best_Prices_Offers} alt="" className="w-15 h-15" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs">Best Prices & Offers</span>
                                        <span className="text-[0.8rem] text-[#666666] leading-none">
                                            Best price destination with offers directly from the manufacturers.
                                        </span>
                                    </div>
                                </div>
                                <div className="flex pt-4 items-center gap-4">
                                    <img src={Wide_Assortment} alt="" className="w-15 h-15" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs">Wide Assortment</span>
                                        <span className="text-[0.8rem] text-[#666666] leading-none">
                                            Choose from 5000+ products across food, personal care, household & other categories.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive Image Container */}
            <div className="w-full mx-auto block lg:hidden xl:hidden">
                {/* Image Section */}
                <div className="xs:h-[65vh] h-auto bg-white flex justify-center">
                    {
                        loading ? (
                            <div className="w-110 h-110 flex justify-center items-center">
                                <span className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-green-500 rounded-full"></span>
                            </div>
                        ) : (
                            <Swiper
                                modules={[Pagination]}
                                pagination={{ clickable: true }}
                                loop={true}
                                className="xs:h-[65vh] h-auto bg-red-600 flex justify-center"
                            >
                                {images?.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover md:object-contain" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )
                    }

                </div>
                {/* Product Details */}
                <div className="mt-10 px-3">
                    <span className="text-xl font-bold">{productData?.name}</span>
                    {/* Time */}
                    <div className='px-1 rounded w-fit flex bg-[#F5F5F5] items-center justify-center mt-2 '>
                        <CiStopwatch size={12} /> <span className="text-[0.6rem] font-semibold">8 MINS</span>
                    </div>
                    {/* View similar Product Text */}
                    <div
                        className="flex items-center mt-2 pb-2 cursor-pointer border-b-1 border-gray-200"
                        onClick={() => handleRedirectToProductList(productData?.category[0]._id, productData?.subCategory[0]._id,)}
                    >
                        <p className="text-[#0C831F] text-sm font-semibold">View other products</p>
                        <FaCaretRight className="text-[#0C831F]" />
                    </div>
                    {/* Unit, Price */}
                    <div className="flex justify-between pt-2">
                        <div className="flex flex-col">
                            <span className="font-semibold text-[0.8rem] text-[#666666]">{formattedUnit}</span>
                            {productData?.stock === 0 ? (
                                <span className="text-md font-bold text-red-500">Out of Stock</span>
                            ) : productData?.discount > 0 ? (
                                <div className="flex items-center gap-1">
                                    <span className="text-md font-bold text-gray-500">MRP</span>
                                    <span className="text-md font-bold line-through text-gray-500">
                                        &#8377;{productData?.price}
                                    </span>
                                    <span className="text-md font-bold text-black">
                                        &#8377;{(productData?.price - (productData?.price * productData?.discount / 100)).toFixed(2)}
                                    </span>
                                    <span className="text-white px-1 rounded bg-[#538CEE] font-semibold text-[x-small]">
                                        {`${productData?.discount}% OFF`}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm font-medium">
                                    MRP <span className="font-bold">&#8377;{productData?.price}</span>
                                </span>
                            )}
                            <span className="text-[0.6rem] text-[#666666]">(Inclusive of all taxes)</span>
                        </div>
                        {/* add button */}
                        <div className="w-fit">
                            <AddToCartButton data={productData || ""}/>
                        </div>
                    </div>
                    {/* Product other info */}
                    <div className="mt-4 bg-white rounded-lg mb-5">
                        <h1 className="text-2xl font-semibold">Product Details</h1>
                        <div className="flex flex-col gap-4 mt-5">
                            <span className="font-semibold text-md">{firstDetail?.[0]}</span>
                            <span className="font-semibold text-sm text-[#666666]">{firstDetail?.[1]}</span>
                            {
                                !showMoreDetails ? (
                                    <button
                                        className="flex items-center text-sm font-semibold"
                                        onClick={() => setShowMoreDetails(true)}
                                    >
                                        <p className="text-[#0C831F]">View More Details</p>
                                        <FaCaretDown className="text-[#0C831F]" />
                                    </button>
                                ) : (
                                    <>
                                        {productData?.more_details &&
                                            Object.entries(productData.more_details)
                                                .slice(1) // Skip the first entry
                                                .map(([key, value], index, array) => (
                                                    <div key={index} className="flex flex-col gap-2">
                                                        <span className="font-semibold text-md">{key}</span>
                                                        <span className="font-semibold text-sm text-[#666666]">{value}</span>

                                                        {/* Show description at the end of the list */}
                                                        {index === array.length - 1 && productData.description && (
                                                            <>
                                                                <span className="font-semibold text-md">Description</span>
                                                                <span className="font-semibold text-sm text-[#666666]">{productData.description}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                ))
                                        }
                                        <button
                                            className="flex items-center text-sm font-semibold"
                                            onClick={() => setShowMoreDetails(false)}  // Hide details on click
                                        >
                                            <p className="text-[#0C831F]">View Less Details</p>
                                            <FaCaretUp className="text-[#0C831F] " />
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ProductDetails;
