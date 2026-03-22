import api from "./api";
import type { ProductVariant, SingleResourceResponse } from "./types";

export interface VariantPayload {
	product_id: number;
	name: string;
	sku: string;
	price: number | null;
	stock_quantity: number;
	status: "active" | "inactive";
	attributes?: {
		attribute_name: string;
		attribute_value: string;
	}[];
}

export const createVariant = async (data: VariantPayload): Promise<SingleResourceResponse<ProductVariant>> => {
	const response = await api.post("/api/variants", data);
	return response.data;
};

export const updateVariant = async (id: number, data: Partial<VariantPayload>): Promise<SingleResourceResponse<ProductVariant>> => {
	const response = await api.put(`/api/variants/${id}`, data);
	return response.data;
};

export const deleteVariant = async (id: number): Promise<void> => {
	await api.delete(`/api/variants/${id}`);
};
