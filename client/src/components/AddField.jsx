/* eslint-disable react/prop-types */
import { IoCloseSharp } from "react-icons/io5"

function AddField({close, value, onChange, submit}) {
    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800/70 z-50 p-4 flex items-center justify-center">
            <div className="bg-white rounded p-4 w-full max-w-lg">
                <div className="flex items-center justify-between">
                    <h1 className="font-semibold text-lg">Add Field</h1>
                    <button onClick={close} className="w-fit block ml-auto cursor-pointer">
                        <IoCloseSharp size={25} />
                    </button>
                </div>
                <input
                    type="text"
                    className="p-2 my-4 border w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Field Name"
                    value={value}
                    onChange={onChange}
                />
                <button
                    className="bg-green-500 hover:bg-green-600 text-neutral-900 font-semibold py-2 px-4 w-36 text-center border border-green-500 rounded-lg shadow-md transition-all cursor-pointer"
                    onClick={submit}
                >
                    Add Field
                </button>
            </div>
        </section>
    )
}

export default AddField