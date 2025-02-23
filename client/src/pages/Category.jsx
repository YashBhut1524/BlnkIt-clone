import { useState } from "react"
import UploadCategoryModel from "../components/UploadCategoryModel"

function Category() {

    const [openUploadCategoryModel, setOpenUploadCategoryModel] = useState(false)

    return (
        <section>
            <div className="p-2 bg-white shadow-xl flex items-center justify-between">
                <h2 className="font-semibold">Category</h2>
                <button 
                    className=" p-2 bg-[#0C831F] text-white font-bold rounded-md hover:bg-[#2c4e33] transition"
                    onClick={() => setOpenUploadCategoryModel(true)}
                >
                    Add Category
                </button>
            </div>
            {
                openUploadCategoryModel && (
                    <UploadCategoryModel close={() => setOpenUploadCategoryModel(false)}/>
                )
            }
        </section>
    )
}

export default Category