/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useContext, useState, useEffect } from "react";
import summaryApi from "../common/summaryApi";
import Axios from "../utils/Axios";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
    const [addresses, setAddresses] = useState([]);

    const fetchAddress = async () => {
        try {
            const response = await Axios({ ...summaryApi.getAddress });
            console.log("response: ", response);

            if (response.data.success) {
                setAddresses(response.data.data);
                return response.data.data; // Return fetched addresses
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    useEffect(() => {
        fetchAddress();
    }, []);

    return (
        <AddressContext.Provider value={{ addresses, fetchAddress }}>
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => useContext(AddressContext);
