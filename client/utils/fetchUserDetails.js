import summaryApi from "../src/common/summaryApi";
import Axios from "./Axios";

const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...summaryApi.getUserDetails
        })
        // console.log("response: ", response);
        
        return response.data 

    } catch (error) {
        console.log(error);
    }
}

export default fetchUserDetails