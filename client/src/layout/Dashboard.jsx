import { Outlet } from "react-router-dom";
import UserMenuForMobileUser from "../pages/UserMenuForMobileUser";

function Dashboard() {
    return (
        <section className="bg-white">
            <div className="container mx-auto p-3 grid lg:grid-cols-[280px_1fr]">
                {/* Left */}
                <div className="py-4 sticky top-24 overflow-auto hidden lg:block border-r border-gray-300">
                    <UserMenuForMobileUser />
                </div>
                {/* Right */}
                <div className="bg-white min-h-[76vh]">
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default Dashboard;
