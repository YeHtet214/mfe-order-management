import { Eye, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable } from "../shared/DataTable";
import { StatusBadge } from "../shared/StatusBadge";
import { useAuth } from "../../contexts/AuthContext";
import type { Product } from "../../services/types";

interface ProductTableProps {
	products: Product[];
	loading: boolean;
	onDelete: (id: number) => void;
	error?: string | null;
}

export function ProductTable({ products, loading, onDelete, error }: ProductTableProps) {
	const { hasPermission } = useAuth();
	const columns = [
		{
			header: "Name / SKU",
			accessor: (row: Product) => (
				<div>
					<p className="font-semibold text-gray-900 leading-none">{row.name}</p>
					<p className="text-xs text-gray-500 mt-1">{row.sku}</p>
				</div>
			),
		},
		{
			header: "Category",
			accessor: (row: Product) => row.category?.name || "N/A",
		},
		{
			header: "Price",
			accessor: (row: Product) => `$${parseFloat(row.base_price).toFixed(2)}`,
		},
		{
			header: "Stock",
			accessor: (row: Product) => {
				if (row.has_variants) {
					return <span className="text-blue-600 font-medium italic text-xs">Variant-based</span>;
				}
				return row.stock_quantity;
			},
		},
		{
			header: "Status",
			accessor: (row: Product) => (
				<StatusBadge
					status={row.status}
					variant={row.status === "active" ? "success" : "danger"}
				/>
			),
		},
		{
			header: "Actions",
			accessor: (row: Product) => (
				<div className="flex items-center gap-2">
					<Link
						to={`/products/${row.id}`}
						className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
						title="View Details"
					>
						<Eye className="w-4 h-4" />
					</Link>
					{hasPermission("products.create") && (
						<>
							<Link
								to={`/products/${row.id}/edit`}
								className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
								title="Edit Product"
							>
								<Edit2 className="w-4 h-4" />
							</Link>
							<button
								onClick={() => onDelete(row.id)}
								className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
								title="Delete Product"
							>
								<Trash2 className="w-4 h-4" />
							</button>
						</>
					)}
				</div>
			),
		},
	];

	return <DataTable columns={columns as any} data={products} isLoading={loading} error={error} />;
}
