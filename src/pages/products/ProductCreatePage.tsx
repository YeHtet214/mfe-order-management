import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { ProductForm, type ProductFormData } from "../../components/products/ProductForm";
import { AccessDenied } from "../../components/shared/AccessDenied";
import { useAuth } from "../../contexts/AuthContext";
import { createProduct } from "../../services/productApi";
import type { ValidationErrorResponse } from "../../services/types";

export function ProductCreatePage() {
	const navigate = useNavigate();
	const { hasPermission } = useAuth();
	const [externalErrors, setExternalErrors] = useState<Record<string, string[]>>({});
	const [isForbidden, setIsForbidden] = useState(false);

	useEffect(() => {
		if (!hasPermission("products.create")) {
			setIsForbidden(true);
		}
	}, [hasPermission]);

	const handleSubmit = async (data: ProductFormData) => {
		try {
			setExternalErrors({});
			const response = await createProduct(data as any);
			navigate(`/products/${response.data.id}`);
		} catch (error: any) {
			if (error.response?.status === 422) {
				const validationErrors = error.response.data as ValidationErrorResponse;
				setExternalErrors(validationErrors.errors);
			} else if (error.response?.status === 403) {
				setIsForbidden(true);
			} else {
				console.error("Failed to create product:", error);
			}
		}
	};

	if (isForbidden) {
		return (
			<div className="space-y-6 max-w-5xl mx-auto">
				<PageHeader title="Create New Product" />
				<AccessDenied message="You do not have permission to create new products." />
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-5xl mx-auto">
			<PageHeader title="Create New Product" />

			<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
				<ProductForm
					onSubmit={handleSubmit}
					onCancel={() => navigate("/products")}
					externalErrors={externalErrors}
				/>
			</div>
		</div>
	);
}
