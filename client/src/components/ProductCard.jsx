/* eslint-disable react/prop-types */
import { CiStopwatch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { validURLConvertor } from "../utils/validURLConvertor";
import disscountBannerSVG from "../assets/disscountBanner.svg";

function ProductCard({data}) {

    const formattedUnit = /^\d+$/.test(data?.unit) ? `${data.unit} Unit` : data.unit;

    const url = `product/${validURLConvertor(data.name)}-${data._id}`

    return (
        <Link to={url} className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white border-gray-200 relative'>
            
            {
                data.discount > 0 && (
                    <div className="absolute left-3 w-8 h-8 flex items-center justify-center">
                        <img src={disscountBannerSVG} alt="discount" className="w-full h-full absolute"/>
                        <div className="absolute flex flex-col items-center justify-center text-white text-[10px] font-bold">
                            <span>{data.discount}%</span>
                            <span>OFF</span>
                        </div>
                    </div>
                )
            }

            <div className='h-25 rounded'>
                <img 
                    src={data.image[0]} 
                    alt={data.name}
                    className="w-full h-full object-scale-down scale-120"
                />
            </div>
            <div className='p-1 rounded w-fit flex bg-[#F8F8F8] items-center justify-center mt-2'>
                <CiStopwatch size={12}/> <span className="text-[9px] font-semibold">8 MINS</span>
            </div>
            <div className='line-clamp-2 font-semibold text-sm'>
                {data.name}
            </div>
            <div className='text-xs text-[#6B6666] flex items-center'>
                {formattedUnit}
            </div>
            <div className='flex items-center justify-between gap-3'>
                <div className=''>
                    <span className="text-[11px] font-bold">₹{data.price}</span>
                </div>
                <div className="rounded w-fit">
                    <button className="px-4 py-1 text-green-700 border-2 border-green-700 rounded-lg font-medium transition-all duration-200 hover:bg-green-700 hover:text-white">
                        ADD
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard