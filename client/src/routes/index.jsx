import {createBrowserRouter} from "react-router-dom"
import App from "../App"
import Home from "../pages/Home"
import SearchPage from "../pages/SearchPage"
import ForgotPassword from "../pages/ForgotPassword"
import VerifyForgotPasswordOTP from "../pages/VerifyForgotPasswordOTP"
import ResetPassword from "../pages/ResetPassword"
import UserMenuForMobileUser from "../pages/UserMenuForMobileUser"
import Dashboard from "../layout/Dashboard"
import Profile from "../pages/Profile"
import MyOrders from "../pages/MyOrders"
import UploadProduct from "../pages/UploadProduct"
import Category from "../pages/Category"
import SubCategory from "../pages/SubCategory"
import ProductsAdmin from "../pages/ProductsAdmin"
import ProtectedRoute from "../components/ProtectedRoute"
import UpdateProduct from "../pages/UpdateProduct"
import ProductList from "../pages/ProductList"
import ProductDetails from "../pages/ProductDetails"
import AllProductsByCategory from "../components/AllProductsByCategory"
import ViewCart from "../pages/ViewCart"
import Addresses from "../components/Addresses"
import AddNewAddress from "../components/AddNewAddress"
import EditAddress from "../components/EditAddress"
import CheckOut from "../pages/CheckOut"
import AllOrderAdmin from "../pages/AllOrderAdmin"
import Success from "../pages/Success"
import Cancel from "../pages/Cancel"
import OrderDetails from "../pages/OrderDetails"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "search",
                element: <SearchPage />
            },            
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "verify-forgot-password-otp",
                element: <VerifyForgotPasswordOTP />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "user-menu",
                element: <UserMenuForMobileUser />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "my-orders",
                        element: <MyOrders />
                    },
                    {
                        path: "addresses",
                        element: <Addresses />
                    },
                    {
                        path: "order-details/:orderId",
                        element: <OrderDetails />
                    },
                    {
                        path: "products",
                        element: <ProtectedRoute element={<ProductsAdmin />} allowedRoles={["ADMIN"]} />
                    },
                    {
                        path: "upload-product",
                        element: <ProtectedRoute element={<UploadProduct />} allowedRoles={["ADMIN"]} />
                    },
                    {
                        path: "category",
                        element: <ProtectedRoute element={<Category />} allowedRoles={["ADMIN"]} />
                    },
                    {
                        path: "sub-category",
                        element: <ProtectedRoute element={<SubCategory />} allowedRoles={["ADMIN"]} />
                    },
                    {
                        path: "update-product/:id",
                        element: <ProtectedRoute element={<UpdateProduct />} allowedRoles={["ADMIN"]} />
                    },
                    {
                        path: "all-orders",
                        element: <ProtectedRoute element={<AllOrderAdmin />} allowedRoles={["ADMIN"]} />
                    },
                ]
            },
            // {
            //     path: ":category",
            //     children: [
            //         {
            //             path: ":subcategory",
            //             element: <ProductDetails />
            //         }
            //     ]
            // },
            {
                path: "products-list/:product",
                element: <ProductDetails />
            },
            {
                path: "products-list/:categoryId/:subCategoryId",
                element: <ProductList />
            },
            {
                path: "all-products-by-category",
                element: <AllProductsByCategory />
            },
            {
                path: "cart",
                element: <ViewCart />
            },
            // {
            //     path: "address",
            //     element: <Addresses />
            // },
            {
                path: "add-new-address",
                element: <AddNewAddress />
            },
            {
                path: "edit-address",
                element: <EditAddress />
            },
            {
                path: "checkout",
                element: <CheckOut />
            },
            {
                path: "success",
                element: <Success />
            },
            {
                path: "cancel",
                element: <Cancel />
            },
        ]
    }
]);

export default router