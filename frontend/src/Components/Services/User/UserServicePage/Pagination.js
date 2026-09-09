import React from "react";

const Pagination = ({
  page,
  pagination,
  onPageChange,
}) => {

  const {
    totalPages,
    hasPreviousPage,
    hasNextPage,
  } = pagination;


  return (
    <div className="user-pagination">

      {/* PREVIOUS */}

      <button
        type="button"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </button>


      {/* PAGE NUMBERS */}

      <div className="user-pagination-pages">

        {Array.from(
          {
            length: totalPages,
          },
          (_, index) => index + 1
        ).map((pageNumber) => (

          <button
            key={pageNumber}
            type="button"
            className={
              pageNumber === page
                ? "active"
                : ""
            }
            onClick={() =>
              onPageChange(pageNumber)
            }
          >
            {pageNumber}
          </button>

        ))}

      </div>


      {/* NEXT */}

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>

    </div>
  );
};

export default Pagination;