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
import Addresses from "../pages/Addresses"

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
                ]
            }
        ]
    }
])

export default router