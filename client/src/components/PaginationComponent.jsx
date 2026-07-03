import React from "react";

const PaginationComponent = ({
  pagination,
  onPageChange,
  theme = "light",
}) => {
  if (!pagination || pagination.last_page <= 1) return null;

  const { current_page, last_page, total } = pagination;

  const isDark = theme === "dark";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
      <p
        className={`text-sm ${
          isDark ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Showing Page{" "}
        <span className="font-bold text-primary">{current_page}</span> of{" "}
        <span className="font-bold text-primary">{last_page}</span>
        <span
          className={`mx-2 ${
            isDark ? "text-gray-600" : "text-gray-300"
          }`}
        >
          |
        </span>
        Total Records:{" "}
        <span className="font-bold text-primary">{total}</span>
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          disabled={current_page === 1}
          onClick={() => onPageChange(current_page - 1)}
          className={`px-3 py-1 text-sm rounded-lg border transition-colors disabled:opacity-50
            ${
              isDark
                ? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          Prev
        </button>

        {[...Array(last_page)].map((_, i) => {
          const page = i + 1;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm rounded-lg border transition-colors
                ${
                  current_page === page
                    ? "bg-primary text-white border-primary"
                    : isDark
                    ? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={current_page === last_page}
          onClick={() => onPageChange(current_page + 1)}
          className={`px-3 py-1 text-sm rounded-lg border transition-colors disabled:opacity-50
            ${
              isDark
                ? "border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;