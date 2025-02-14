import {createBrowserRouter} from "react-router-dom"
import App from "../App"
import Home from "../pages/Home"
import SearchPage from "../pages/SearchPage"
import ForgotPassword from "../pages/ForgotPassword"
import VerifyForgotPasswordOTP from "../pages/VerifyForgotPasswordOTP"
import ResetPassword from "../pages/ResetPassword"

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
            }
        ]
    }
])

export default router