import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import toast, { Toaster } from 'react-hot-toast';
import Login from "./components/Login";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Axios from "./utils/Axios";
import summaryApi from "./common/summaryApi";
import { setAllCategory, setAllSubCategory, setLoadingCategory } from "./store/productSlice";
import AxiosToastError from "./utils/AxiosToastError";
import { handleAddItem } from "./store/cartProductSlice";
import CartButtonForMobile from "./components/CartButtonForMobile"
import CartSideMenu from "./components/CartSideMenu";
import AddNewAddress from "./components/AddNewAddress";
import AddressMenu from "./components/AddressMenu";

function App() {

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);
  const [isAddressMenuOpen, setIsAddressMenuOpen] = useState(false);
  const [openAddNewAddressMenu, setOpenAddNewAddressMenu] = useState(false);

  const dispatch = useDispatch()
  const user = useSelector((state) => state.user);

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    // console.log("userData: ", userData);
    dispatch(setUserDetails(userData.data))
  }

  // console.warn = () => {};
  // console.error = () => {};

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

  const fetchCartItem = async () => {
    try {
        const response = await Axios({
            ...summaryApi.getCartItems,
        })
        // console.log("response: ", response);

        if (response.data.success) {
            dispatch(handleAddItem(response.data.data))
        }

    } catch (error) {
        console.log(error);
    }
}

    useEffect(() => {
      fetchCartItem()
      fetchUser()
      fetchCategory()
      fetchSubCategory()
  }, [])

  useEffect(() => {
    if (user._id) { // Fetch cart only if the user is logged in
      fetchCartItem();
    }
  }, [user]);

  return (
    <>
      <Header 
        setIsLoginOpen={setIsLoginOpen} 
        setIsCartMenuOpen={setIsCartMenuOpen}
      />
      
      <main className="min-h-[77vh] w-full bg-white">
        <Outlet 
          context={{ setIsLoginOpen }} 
        />
      </main> 

      <Footer />
      <Toaster />

      {/* Cart option for mobile if there is something in cart */}
      <CartButtonForMobile />

      {/* CartSideMenu for laptop and xl screen */}
      {
        isCartMenuOpen && (
          <>
            <CartSideMenu 
              setIsCartMenuOpen={setIsCartMenuOpen}
              setIsAddressMenuOpen={setIsAddressMenuOpen}
            />
          </>
        )
      }
      {
        isCartMenuOpen && isAddressMenuOpen && (
          <>
            <AddressMenu 
              setIsCartMenuOpen={setIsCartMenuOpen}
              setIsAddressMenuOpen={setIsAddressMenuOpen}
              setOpenAddNewAddressMenu={setOpenAddNewAddressMenu}
            />
          </>
        )
      }

      {     
        openAddNewAddressMenu && (
          <>
            <AddNewAddress 
              setOpenAddNewAddressMenu={setOpenAddNewAddressMenu}
            />
          </>
        )
      }

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
