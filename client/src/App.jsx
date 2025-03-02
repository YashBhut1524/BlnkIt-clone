import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import toast, { Toaster } from 'react-hot-toast';
import Login from "./components/Login";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";
import Axios from "./utils/Axios";
import summaryApi from "./common/summaryApi";
import { setAllCategory, setAllSubCategory, setLoadingCategory } from "./store/productSlice";
import AxiosToastError from "./utils/AxiosToastError";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    // console.log("userData: ", userData);
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
        try {
            dispatch(setLoadingCategory(true))
            const response = await Axios({
                ...summaryApi.getCategory,
            })
            // console.log("response: ", response);
            if(response.data.success) {
                dispatch(setAllCategory(response.data.data))
            } else {
                toast.error(response.data.message)
            } 
        } catch (error) {
            AxiosToastError(error)
        } finally {
          dispatch(setLoadingCategory(false))
        }
    }

    const fetchSubCategory = async () => {
      try {
          const response = await Axios({
              ...summaryApi.getSubCategory,
          })
          // console.log("response: ", response);
          if(response.data.success) {
              dispatch(setAllSubCategory(response.data.data))
          } else {
              toast.error(response.data.message)
          }
      } catch (error) {
          AxiosToastError(error)
      }
  }
    
    useEffect(() => {
      fetchUser()
      fetchCategory()
      fetchSubCategory()
  }, [])
  

  return (
    <>
      <Header setIsLoginOpen={setIsLoginOpen} />
      
      <main className="min-h-[77vh] w-full bg-white">
        <Outlet context={{ setIsLoginOpen }} />
      </main> 

      <Footer />
      <Toaster />

      {/* Check if Login Component is Being Rendered */}
      {isLoginOpen && (
        <>
          {/* {console.log("Rendering Login Popup")} */}
          <Login setIsLoginOpen={setIsLoginOpen} />
        </>
      )}
    </>
  );
}

export default App;
