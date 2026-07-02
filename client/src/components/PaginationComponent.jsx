import React from "react";

const PaginationComponent = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.last_page <= 1) return null;

  const { current_page, last_page, total } = pagination;

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-600">
        Showing Page{" "}
        <span className="font-bold text-primary">{current_page}</span> of{" "}
        <span className="font-bold text-primary">{last_page}</span>
        <span className="mx-2 text-gray-300">|</span>
        Total Records: <span className="font-bold text-primary">{total}</span>
      </p>

      <div className="flex gap-2">
        <button
          disabled={current_page === 1}
          onClick={() => onPageChange(current_page - 1)}
          className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-100"
        >
          Prev
        </button>

        {[...Array(last_page)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm rounded-lg border
                ${
                  current_page === page
                    ? "bg-primary text-white "
                    : "hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={current_page === last_page}
          onClick={() => onPageChange(current_page + 1)}
          className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;
