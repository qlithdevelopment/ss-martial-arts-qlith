import React from 'react';
const AdminTable = ({
    columns = [],
    data = [],
    isLoading = false,
    skeletonRows = 3,
    emptyIcon,
    emptyTitle = 'No records found',
    emptyMessage = 'Records will appear here once added.',
    footer,
}) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">

                    {/* Header */}
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`px-6 py-4 font-bold text-gray-900 ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-gray-50">

                        {/* Loading skeleton */}
                        {isLoading ? (
                            [...Array(skeletonRows)].map((_, rowIndex) => (
                                <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
                                    {columns.map((col, colIndex) => (
                                        <td key={`skeleton-cell-${colIndex}`} className="px-6 py-4">
                                            {col.skeleton ? col.skeleton() : (
                                                <div className="h-5 bg-gray-200 rounded w-24"></div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )

                            /* Empty state */
                            : data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                                        {emptyIcon && (
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                {emptyIcon}
                                            </div>
                                        )}
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{emptyTitle}</h3>
                                        <p className="text-gray-500 text-sm">{emptyMessage}</p>
                                    </td>
                                </tr>
                            )

                                /* Data rows */
                                : (
                                    data.map((row, rowIndex) => (
                                        <tr key={row.id ?? rowIndex} className="hover:bg-gray-50/50 transition-colors group">
                                            {columns.map((col, colIndex) => {
                                                const value = col.accessor ? row[col.accessor] : null;
                                                return (
                                                    <td
                                                        key={colIndex}
                                                        className={`px-6 py-4 text-sm text-gray-700 ${col.className || ''}`}
                                                    >
                                                        {col.render ? col.render(value, row) : (value ?? '—')}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                )}

                    </tbody>
                </table>
            </div>

            {/* Footer e.g. Pagination */}
            {footer && footer}
        </div>
    );
};

export default AdminTable;