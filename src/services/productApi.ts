import api from "./api";
import type { Product, PaginatedResponse, SingleResourceResponse } from "./types";

export interface ProductListParams {
	search?: string;
	category_id?: number;
	status?: "active" | "inactive";
	sort?: "latest" | "oldest";
	per_page?: number;
	page?: number;
}

export const fetchProducts = async (params?: ProductListParams): Promise<PaginatedResponse<Product>> => {
	const response = await api.get("/api/products", { params });
	return response.data;
};

export const fetchProduct = async (id: number): Promise<SingleResourceResponse<Product>> => {
	const response = await api.get(`/api/products/${id}`);
	return response.data;
};

export const createProduct = async (data: Partial<Product>): Promise<SingleResourceResponse<Product>> => {
	const response = await api.post("/api/products", data);
	return response.data;
};

export const updateProduct = async (id: number, data: Partial<Product>): Promise<SingleResourceResponse<Product>> => {
	const response = await api.put(`/api/products/${id}`, data);
	return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
	await api.delete(`/api/products/${id}`);
};
