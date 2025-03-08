/* eslint-disable no-unused-vars */
import summaryApi from "../common/summaryApi";
import Axios from "./Axios";

const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...summaryApi.getUserDetails
        })
        // console.log("response: ", response);
        
        return response.data 

    } catch (error) {
        // console.log(error);
        console.log("User is not logged in.");
        
    }
}

export default fetchUserDetails