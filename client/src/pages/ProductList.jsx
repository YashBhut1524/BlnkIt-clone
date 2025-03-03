import { useParams } from "react-router-dom";

function ProductList() {

    const params = useParams()
    // console.log("params: ", params);
    
    // Extracting IDs
    const categoryId = params.category.split("-").pop();
    const subcategoryId = params.subcategory.split("-").pop();
    // console.log("Category ID:", categoryId);
    // console.log("Subcategory ID:", subcategoryId);

    return (
        <section className="sticky top-28 lg:top-22">
            
            {/* Category */}
            <div className="bg-green-400 h-10">

            </div>
            <div
                className="lg:px-35 w-full mx-auto"
            >
                <div className="container sticky top-28 mx-auto grid grid-cols-[100px_1fr] lg:grid-cols-[260px_1fr] md:grid-cols-[162px_1fr]">
                    {/* Sub Category */}
                    <div className="mb-4 bg-red-400 min-h-[70vh] h-full">
                        {

                        }
                    </div>

                    {/* Sub Category's Products */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-6 bg-blue-400">
                        {/* Add product components here */}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductList;
