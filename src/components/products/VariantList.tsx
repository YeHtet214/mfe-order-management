import { Edit2, Trash2, Plus } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import type { ProductVariant } from "../../services/types";

interface VariantListProps {
	variants: ProductVariant[];
	onEdit: (variant: ProductVariant) => void;
	onDelete: (id: number) => void;
	onCreate: () => void;
}

export function VariantList({ variants, onEdit, onDelete, onCreate }: VariantListProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-bold text-gray-900">Product Variants</h3>
				<button
					onClick={onCreate}
					className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
				>
					<Plus className="w-3.5 h-3.5" />
					Add Variant
				</button>
			</div>

			{variants.length === 0 ? (
				<div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
					<p className="text-gray-500 text-sm">No variants created for this product yet.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{variants.map((variant) => (
						<div
							key={variant.id}
							className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex justify-between items-start mb-3">
								<div>
									<h4 className="font-bold text-gray-900">{variant.name}</h4>
									<p className="text-xs text-gray-500">{variant.sku}</p>
								</div>
								<StatusBadge
									status={variant.status}
									variant={variant.status === "active" ? "success" : "danger"}
								/>
							</div>

							<div className="flex flex-wrap gap-2 mb-4">
								{variant.attributes.map((attr) => (
									<span
										key={attr.id}
										className="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-600 rounded-md border border-gray-200"
									>
										{attr.attribute_name}: {attr.attribute_value}
									</span>
								))}
							</div>

							<div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
								<div className="space-y-0.5">
									<p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Price / Stock</p>
									<p className="text-sm font-bold text-gray-900">
										${variant.price ? parseFloat(variant.price).toFixed(2) : "N/A"}{" "}
										<span className="text-gray-300 mx-1">|</span> {variant.stock_quantity} in stock
									</p>
								</div>
								<div className="flex gap-2">
									<button
										onClick={() => onEdit(variant)}
										className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
										title="Edit Variant"
									>
										<Edit2 className="w-4 h-4" />
									</button>
									<button
										onClick={() => onDelete(variant.id)}
										className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
										title="Delete Variant"
									>
										<Trash2 className="w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
