import { useState, useEffect } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import AxiosToastError from "../../utils/AxiosToastError";
import Axios from "../../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const outletContext = useOutletContext();
    const location = useLocation();
    const navigate = useNavigate();
    const success = location.state?.data?.success
    // console.log("success: ", success);
    const email = location.state?.email || "";
    
    // Redirect if accessed directly
    useEffect(() => {
        if (!email && !success) {
            toast.error("Unauthorized access! Redirecting...");
            navigate("/forgot-password", { replace: true }); // Redirect to forgot password
        }
    }, [email, navigate, success]);

    const [data, setData] = useState({
        email: email,
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const isDisabled = !data.newPassword || !data.confirmPassword || data.newPassword !== data.confirmPassword;

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await Axios({
                ...summaryApi.resetPassword,
                data
            });
            // console.log("Reset Password response: ", response);
            
            if (response.data.error) {
                toast.error(response.data.message);
            } else {
                toast.success("Password reset successfully! You can now log in.");
                navigate("/");

                if (outletContext?.setIsLoginOpen) {
                    outletContext.setIsLoginOpen(true);
                }
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full flex flex-col items-center justify-center bg-gray-50 px-4 py-20">
            <h1 className="text-3xl font-semibold text-gray-900">Reset Your Password</h1>
            <p className="text-gray-600 mt-2 max-w-md">
                Set a new password for <b>{email}</b>.
            </p>

            <form onSubmit={handleResetPassword} className="w-full max-w-md mt-6 space-y-4">
                <input
                    type="password"
                    name="newPassword"
                    value={data.newPassword}
                    onChange={handleChange}
                    placeholder="New Password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />

                <input
                    type="password"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm New Password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />

                <button
                    type="submit"
                    className={`w-full py-3 rounded-lg transition duration-200 ${
                        isDisabled || loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                    disabled={isDisabled || loading}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
