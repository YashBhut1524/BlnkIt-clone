import axios from "axios";
import summaryApi, { baseURL } from "../src/common/summaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

//sending access token in header
Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken")

        if(accessToken) {
            config.headers.authorization = `Bearer ${accessToken}` 
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

//extend the life span of accesstoken with help of refreshToken
Axios.interceptors.request.use(
    async (response) => {
        return response
    },
    async (error) => {
        let originalRequest = error.config

        if(error.response.status === 401 && !originalRequest.retry) {
            originalRequest.retry = true

            const refreshToken = localStorage.getItem("refreshToken")

            if(refreshToken) {
                const newAccessToken = await refreshAccessToken()

                if(newAccessToken) {
                    originalRequest.headers.authorization = `Bearer ${newAccessToken}`
                    return Axios(originalRequest)
                }
            }
        }
        return Promise.reject(error)
    }
)

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await Axios({
            ...summaryApi.refreshToken,
            headers : {
                authorization: `Bearer ${refreshToken}`
            }
        })
        const accessToken = response.data.data.accessToken
        console.log("response: ", response);
        localStorage.setItem("accessToken", accessToken)
        return accessToken
    } catch (error) {
        console.log("error: ", error);
        
    }
}

export default Axios