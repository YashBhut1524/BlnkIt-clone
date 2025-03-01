/* eslint-disable react/prop-types */

function ProductCardAdmin({ data }) {
    // Check if the unit contains only digits
    const formattedUnit = /^\d+$/.test(data?.unit) ? `${data.unit} Unit` : data.unit;

    return (
        <div className="max-w-50 w-auto shadow-lg p-1 rounded-lg flex flex-col items-center text-center transition-transform transform hover:scale-105 relative bg-gray-50">
            <div className="w-full h-32 flex items-center justify-center">
                <img
                    src={data?.image?.[0]}  
                    alt={data?.name}
                    className="w-20 h-20 object-contain"
                />
            </div>
            <p className="text-sm font-medium text-gray-800 line-clamp-2">{data?.name}</p>
            <p className="text-xs text-slate-600">{formattedUnit}</p>
        </div>
    );
}

export default ProductCardAdmin;
