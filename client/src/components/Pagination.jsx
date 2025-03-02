/* eslint-disable react/prop-types */
import { useState } from "react";

const Pagination = ({ pageNum, setPageNum, totalPageCount }) => {
    const [inputPage, setInputPage] = useState(pageNum);

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
    };

    return (
        <div className="flex justify-center items-center gap-4 mt-4">
            <button 
                className={`px-4 py-2 rounded-md shadow-sm transition duration-200 active:scale-95 
                    ${pageNum === 1 ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                onClick={() => setPageNum(1)}
                disabled={pageNum === 1}
            >
                First Page
            </button>

            <button 
                className={`px-4 py-2 rounded-md shadow-sm transition duration-200 active:scale-95 
                    ${pageNum === 1 ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                onClick={() => setPageNum(pageNum - 1)}
                disabled={pageNum === 1}
            >
                Previous
            </button>

            <input
                type="text"
                value={inputPage}
                onChange={handlePageInput}
                onBlur={handlePageSubmit}
                onKeyDown={(e) => e.key === "Enter" && handlePageSubmit()}
                className="text-gray-800 font-medium text-center w-12 px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="text-gray-800 font-medium">/ {totalPageCount}</span>

            <button 
                className={`px-4 py-2 rounded-md shadow-sm transition duration-200 active:scale-95 
                    ${pageNum === totalPageCount ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                onClick={() => setPageNum(pageNum + 1)}
                disabled={pageNum === totalPageCount}
            >
                Next
            </button>

            <button 
                className={`px-4 py-2 rounded-md shadow-sm transition duration-200 active:scale-95 
                    ${pageNum === totalPageCount ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                onClick={() => setPageNum(totalPageCount)}
                disabled={pageNum === totalPageCount}
            >
                Last Page
            </button>
        </div>
    );
};

export default Pagination;
