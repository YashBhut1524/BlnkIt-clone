import summaryApi from "../src/common/summaryApi"
import Axios from "./Axios"
import AxiosToastError from "./AxiosToastError"

const uploadImage = async (image, path) => {
    try {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("path", path); 

        const response = await Axios({
            ...summaryApi.uploadImage,
            data: formData,
        });
        return response;
    } catch (error) {
        AxiosToastError(error);
        return error;
    }
};


export default uploadImage