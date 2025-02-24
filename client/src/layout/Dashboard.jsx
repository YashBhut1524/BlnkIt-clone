import { Outlet } from "react-router-dom";
import UserMenuForMobileUser from "../pages/UserMenuForMobileUser";

function Dashboard() {
    return (
        <section className="bg-white">
            <div className="container mx-auto p-3 grid lg:grid-cols-[325px_1fr]">
                {/* Left */}
                <div className="py-4 sticky max-h-[calc(100vh-150px)] top-0 overflow-y-hidden hidden lg:block border-r border-gray-300">
                    <UserMenuForMobileUser />
                </div>
                {/* Right */}
                <div className="bg-white max-h-[70vh] overflow-y-scroll">
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default Dashboard;
