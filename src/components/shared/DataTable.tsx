import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function DataTable<T>({ columns, data, onRowClick, isLoading, error }: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {error ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-sm">
                <div className="flex flex-col items-center justify-center gap-2 text-red-500 font-medium">
                  <AlertCircle className="w-8 h-8" />
                  <p>{error}</p>
                </div>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick ? "cursor-pointer hover:bg-gray-50 transition-colors" : "")}
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-900", column.className)}
                  >
                    {typeof column.accessor === "function"
                      ? column.accessor(row)
                      : (row[column.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
