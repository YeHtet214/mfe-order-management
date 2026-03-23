import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { ConfirmDialog } from "../../components/shared/ConfirmDialog";
import { fetchProducts, deleteProduct } from "../../services/productApi";
import { fetchCategories } from "../../services/categoryApi";
import { ProductTable } from "../../components/products/ProductTable";
import { ProductFilters } from "../../components/products/ProductFilters";
import { AccessDenied } from "../../components/shared/AccessDenied";
import { useAuth } from "../../contexts/AuthContext";
import type { Product, Category, PaginationMeta } from "../../services/types";

export function ProductListPage() {
	const { hasPermission } = useAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("");
	const [categoryFilter, setCategoryFilter] = useState<string>("");
	const [sort, setSort] = useState<string>("latest");
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [meta, setMeta] = useState<PaginationMeta | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isForbidden, setIsForbidden] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const getProducts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			setIsForbidden(false);
			const response = await fetchProducts({
				search: searchTerm,
				status: statusFilter as "active" | "inactive" | undefined,
				category_id: categoryFilter ? parseInt(categoryFilter) : undefined,
				sort: sort as "latest" | "oldest",
				page: currentPage,
				per_page: 15,
			});
			setProducts(response.data);
			setMeta(response.meta);
		} catch (err: any) {
			console.error("Error fetching products:", err);
			if (err.response?.status === 403) {
				setIsForbidden(true);
				setError("You do not have permission to view products.");
			} else {
				setError("Failed to load products. Please try again later.");
			}
		} finally {
			setLoading(false);
		}
	}, [searchTerm, statusFilter, categoryFilter, sort, currentPage]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			getProducts();
		}, 300);
		return () => clearTimeout(timeoutId);
	}, [getProducts]);

	useEffect(() => {
		const loadCategories = async () => {
			try {
				const response = await fetchCategories();
				setCategories(response.data);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};
		loadCategories();
	}, []);

	const handleDeleteConfirm = async () => {
		if (!selectedProductId) return;
		try {
			await deleteProduct(selectedProductId);
			setIsDeleteDialogOpen(false);
			getProducts();
		} catch (error) {
			console.error("Error deleting product:", error);
		}
	};

	return (
		<div className="space-y-6 font-sans">
			<PageHeader
				title="Products"
				actions={
					hasPermission("products.create") && (
						<Link
							to="/products/create"
							className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 !text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all"
						>
							<Plus className="w-4 h-4" />
							Create Product
						</Link>
					)
				}
			/>

			{isForbidden ? (
				<AccessDenied message="You do not have the required permissions to view the product catalog." />
			) : (
				<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
					<ProductFilters
						searchTerm={searchTerm}
						onSearchChange={(val) => {
							setSearchTerm(val);
							setCurrentPage(1);
						}}
						statusFilter={statusFilter}
						onStatusChange={(val) => {
							setStatusFilter(val);
							setCurrentPage(1);
						}}
						categoryFilter={categoryFilter}
						onCategoryChange={(val) => {
							setCategoryFilter(val);
							setCurrentPage(1);
						}}
						sort={sort}
						onSortChange={(val) => {
							setSort(val);
							setCurrentPage(1);
						}}
						categories={categories}
					/>

					<ProductTable
						products={products}
						loading={loading}
						error={error}
						onDelete={(id) => {
							setSelectedProductId(id);
							setIsDeleteDialogOpen(true);
						}}
					/>

					{meta && meta.last_page > 1 && (
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
							<p className="text-sm text-gray-500 order-2 sm:order-1">
								Showing <span className="font-semibold">{meta.from}</span> to <span className="font-semibold">{meta.to}</span> of <span className="font-semibold">{meta.total}</span> products
							</p>
							<div className="flex items-center gap-2 order-1 sm:order-2">
								<button
									onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
									disabled={currentPage === 1 || loading}
									className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									<ChevronLeft className="w-5 h-5" />
								</button>
								<span className="text-sm font-semibold text-gray-700 px-4">
									Page {currentPage} of {meta.last_page}
								</span>
								<button
									onClick={() => setCurrentPage((prev) => Math.min(prev + 1, meta.last_page))}
									disabled={currentPage === meta.last_page || loading}
									className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									<ChevronRight className="w-5 h-5" />
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			<ConfirmDialog
				isOpen={isDeleteDialogOpen}
				title="Delete Product"
				description="Are you sure you want to delete this product? This action will perform a soft delete."
				onConfirm={handleDeleteConfirm}
				onClose={() => setIsDeleteDialogOpen(false)}
				variant="danger"
			/>
		</div>
	);
}
