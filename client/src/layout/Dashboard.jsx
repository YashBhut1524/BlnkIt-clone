import { Outlet } from "react-router-dom";
import DashboardLeftSide from "../components/DashBoardLeftSide"

function Dashboard() {
    return (
        <section className="bg-white flex items-center justify-center pt-7">
            <div className="container mx-auto grid lg:grid-cols-[260px_1fr] h-[75vh] mb-10 shadow-2xl w-full max-w-5xl px-2">
                {/* Left Sidebar */}
                <div className="py-4 sticky max-h-[calc(100vh-150px)] top-0 overflow-y-hidden hidden lg:block border-r border-gray-300">
                    <DashboardLeftSide />
                </div>
                {/* Right Content */}
                <div className="bg-white max-h-[70vh] overflow-y-scroll px-4 pb-2">
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default Dashboard;
