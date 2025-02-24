/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const userRole = useSelector((state) => state.user.role); // Get user role from Redux

    return allowedRoles.includes(userRole) ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
