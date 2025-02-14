import axios from "axios";
import { baseURL } from "../common/summaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

export default Axios