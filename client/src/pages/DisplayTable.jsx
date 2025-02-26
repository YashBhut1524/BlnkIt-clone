/* eslint-disable react/prop-types */
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';

function DisplayTable({ data = [], columns = [] }) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
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

                {/* Table Footer */}
                <tfoot className="bg-gray-800 text-white">
                    {table.getFooterGroups()?.map((footerGroup) => (
                        <tr key={footerGroup.id}>
                            <th className="px-6 py-3 border-t border-gray-600 border-r"></th>
                            {footerGroup.headers.map((header) => (
                                <th 
                                    key={header.id} 
                                    className="px-6 py-3 border-t border-gray-600 border-r last:border-r-0"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.footer, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
        </div>
    );
}

export default DisplayTable;
