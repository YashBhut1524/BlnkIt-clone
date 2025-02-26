import summaryApi from "../src/common/summaryApi"
import Axios from "./Axios"
import AxiosToastError from "./AxiosToastError"

const deleteImage = async (image, path) => {
    try {

        const response = await Axios({
            ...summaryApi.deleteImage,
            data: {image, path}
        }) 

        return response
    } catch (error) {
        AxiosToastError(error)
        return error
    }
}

export default deleteImage