import PropTypes from "prop-types";
import image from "../assets/NoData.svg"

function NoData({ message = "No Data Found", subMessage = "Try adding some data."}) {

    return (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <img src={image} alt="No Data" className="w-70 h-70" />
            <p className="mt-4 text-lg font-semibold">{message}</p>
            <p className="text-sm">{subMessage}</p>
        </div>
    );
}

NoData.propTypes = {
    message: PropTypes.string,
    subMessage: PropTypes.string,
    image: PropTypes.string,
};

export default NoData;
