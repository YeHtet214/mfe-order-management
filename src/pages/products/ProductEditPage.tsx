import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { ProductForm, type ProductFormData } from "../../components/products/ProductForm";
import { AccessDenied } from "../../components/shared/AccessDenied";
import { useAuth } from "../../contexts/AuthContext";
import { fetchProduct, updateProduct } from "../../services/productApi";
import type { Product, ValidationErrorResponse } from "../../services/types";

export function ProductEditPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { hasPermission } = useAuth();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [isForbidden, setIsForbidden] = useState(false);
	const [externalErrors, setExternalErrors] = useState<Record<string, string[]>>({});

	useEffect(() => {
		const loadProduct = async () => {
			if (!id) return;
			if (!hasPermission("products.create")) {
				setIsForbidden(true);
				setLoading(false);
				return;
			}
			try {
				setLoading(true);
				const response = await fetchProduct(parseInt(id));
				setProduct(response.data);
			} catch (error: any) {
				console.error("Failed to fetch product:", error);
				if (error.response?.status === 403) {
					setIsForbidden(true);
				} else {
					navigate("/products");
				}
			} finally {
				setLoading(false);
			}
		};
		loadProduct();
	}, [id, navigate, hasPermission]);

	const handleSubmit = async (data: ProductFormData) => {
		if (!id) return;
		try {
			setExternalErrors({});
			await updateProduct(parseInt(id), data as any);
			navigate(`/products/${id}`);
		} catch (error: any) {
			if (error.response?.status === 422) {
				const validationErrors = error.response.data as ValidationErrorResponse;
				setExternalErrors(validationErrors.errors);
			} else if (error.response?.status === 403) {
				setIsForbidden(true);
			} else {
				console.error("Failed to update product:", error);
			}
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (isForbidden) {
		return (
			<div className="space-y-6 max-w-5xl mx-auto">
				<PageHeader title="Edit Product" />
				<AccessDenied message="You do not have permission to edit this product." />
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-5xl mx-auto">
			<PageHeader title={`Edit Product: ${product?.name}`} />

			<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
				<ProductForm
					isEdit
					initialData={product as any}
					onSubmit={handleSubmit}
					onCancel={() => navigate(`/products/${id}`)}
					externalErrors={externalErrors}
				/>
			</div>
		</div>
	);
}
