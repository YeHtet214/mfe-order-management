import { SearchInput } from "../shared/SearchInput";
import type { Category } from "../../services/types";

interface ProductFiltersProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusChange: (value: string) => void;
	categoryFilter: string;
	onCategoryChange: (value: string) => void;
	sort: string;
	onSortChange: (value: string) => void;
	categories: Category[];
}

export function ProductFilters({
	searchTerm,
	onSearchChange,
	statusFilter,
	onStatusChange,
	categoryFilter,
	onCategoryChange,
	sort,
	onSortChange,
	categories,
}: ProductFiltersProps) {
	return (
		<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
			<SearchInput
				placeholder="Search by name or SKU..."
				containerClassName="sm:max-w-xs w-full"
				value={searchTerm}
				onChange={(e) => onSearchChange(e.target.value)}
			/>
			<div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
				<select
					value={categoryFilter}
					onChange={(e) => onCategoryChange(e.target.value)}
					className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
				>
					<option value="">All Categories</option>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.id}>
							{cat.name}
						</option>
					))}
				</select>
				<select
					value={statusFilter}
					onChange={(e) => onStatusChange(e.target.value)}
					className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
				>
					<option value="">All Status</option>
					<option value="active">Active</option>
					<option value="inactive">Inactive</option>
				</select>
				<select
					value={sort}
					onChange={(e) => onSortChange(e.target.value)}
					className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
				>
					<option value="latest">Latest First</option>
					<option value="oldest">Oldest First</option>
				</select>
			</div>
		</div>
	);
}
