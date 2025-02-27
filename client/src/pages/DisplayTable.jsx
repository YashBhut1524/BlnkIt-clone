/* eslint-disable react/prop-types */
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from '@tanstack/react-table';

function DisplayTable({ data, columns }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(), // Enable pagination
    });

    return (
        <div className="p-4 overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg shadow-md">
                {/* Table Head */}
                <thead className="bg-gray-900 text-white text-center sticky top-0">
                    {table.getHeaderGroups()?.map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            <th className="px-4 py-2 text-sm font-semibold border-b border-gray-500 border-r">#</th>
                            {headerGroup.headers.map((header) => (
                                <th 
                                    key={header.id} 
                                    className="px-6 py-3 text-sm font-semibold border-b border-gray-500 border-r last:border-r-0 text-center"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                {/* Table Body */}
                <tbody>
                    {table.getRowModel().rows?.map((row, rowIndex) => (
                        <tr 
                            key={row.id} 
                            className={`${rowIndex % 2 === 0 ? "bg-gray-100" : "bg-gray-200"} hover:bg-gray-300 transition-all`}
                        >
                            <td className="px-6 py-3 text-center border-b border-r border-gray-400">{rowIndex + 1}</td>
                            {row.getVisibleCells().map((cell) => (
                                <td 
                                    key={cell.id} 
                                    className="px-6 py-3 border-b border-r border-gray-400 last:border-r-0 text-center"
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 mt-4">
                
                {/* Page Size Selector */}
                <div className="w-full sm:w-auto flex justify-center">
                    <select 
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                        className="border p-2 rounded-md w-40 sm:w-auto"
                    >
                        {[5, 10, 20].map((size) => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => table.previousPage()} 
                        disabled={!table.getCanPreviousPage()} 
                        className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-center">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <button 
                        onClick={() => table.nextPage()} 
                        disabled={!table.getCanNextPage()} 
                        className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DisplayTable;
