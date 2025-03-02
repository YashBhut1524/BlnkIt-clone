import banner from "../assets/banner.jpg";
import pharmaBanner from "../assets/pharmacy.jpg";
import babycare from "../assets/babycare.jpg";
import pet from "../assets/Pet.jpg";
import android_feed from "../assets/android_feed.jpg";
import { useSelector } from "react-redux";

function Home() {

    const loadingCategory = useSelector(state => state.product.loadingCategory);
    const categoryData = useSelector(state => state.product.allCategory);

    return (
        <section>
            {/* Large Screen Layout */}
            <div className="hidden lg:block w-[95vw] mx-auto">
                <div className="w-full h-full rounded bg-white">
                    <img src={banner} alt="Main Banner" className="w-full h-full" />
                </div>
                <div className="w-full flex gap-5 rounded mt-4 px-[2vw]">
                    <img src={pharmaBanner} alt="Pharmacy" className="w-[30%] rounded-lg shadow-md" />
                    <img src={pet} alt="Pet Care" className="w-[30%] rounded-lg shadow-md" />
                    <img src={babycare} alt="Baby Care" className="w-[30%] rounded-lg shadow-md" />
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="block lg:hidden mx-auto px-2 my-4 w-[95vw]">
                <img src={android_feed} alt="Mobile Banner" className="w-full rounded-xl" />
            </div>

            {/* Category Section */}
            <div className="w-[95vw] mx-auto my-4">
    <div className="px-[2vw]">
        <h2 className="font-bold text-lg mb-3">Shop By Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-3 md:gap-4">
            {loadingCategory ? (
                new Array(20).fill(null).map((_, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
                    >
                        <div className="bg-blue-100 min-h-24 rounded"></div>
                        <div className="bg-blue-100 h-8 rounded"></div>
                    </div>
                ))
            ) : (
                categoryData.map((category, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col items-center justify-center bg-white rounded-lg  transition-transform transform hover:scale-110 relative"
                    >
                        <img 
                            src={category.image} 
                            alt={`Category ${index}`} 
                            className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 object-contain"
                        />
                    </div>
                ))
            )}
        </div>
    </div>
</div>

        </section>
    );
}

export default Home;
