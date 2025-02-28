import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function Pagination({ page, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize);

  const pageNumbers = useMemo(() => {
    const numbers = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      numbers.push(1, 2);

      if (page > 4) {
        numbers.push("ellipsis-1");
      }

      for (
        let i = Math.max(3, page - 2);
        i <= Math.min(totalPages - 2, page + 2);
        i++
      ) {
        numbers.push(i);
      }

      if (page < totalPages - 3) {
        numbers.push("ellipsis-2");
      }

      numbers.push(totalPages - 1, totalPages);
    }

    return numbers;
  }, [page, totalPages]);

  return (
    <>
      {typeof total === "number" && total > 0 && (
        <p className="py-2 mt-3 text-sm text-slate-400">
          Menampilkan entri {(page - 1) * pageSize + 1} sampai{" "}
          {Math.min(page * pageSize, total)} dari {total} data
        </p>
      )}

      <div className="flex justify-center mt-4 flex-wrap space-x-1">
        {pageNumbers.map((num) =>
          typeof num === "string" ? (
            <span key={num} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={num}
              className={cn(
                "px-3 py-1 rounded-md transition-colors hover:cursor-pointer",
                page === num
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              )}
              onClick={() => {
                if (num !== page) onChange(num); // Hindari set state yang sama
              }}
            >
              {num}
            </button>
          )
        )}
      </div>
    </>
  );
}
