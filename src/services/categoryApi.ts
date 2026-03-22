import api from "./api";
import type { Category, SingleResourceResponse } from "./types";

export interface CategoryListResponse {
	data: Category[];
}

export const fetchCategories = async (): Promise<CategoryListResponse> => {
	const response = await api.get("/api/categories");
	return response.data;
};

export const fetchCategory = async (id: number): Promise<SingleResourceResponse<Category>> => {
	const response = await api.get(`/api/categories/${id}`);
	return response.data;
};

export const createCategory = async (data: Partial<Category>): Promise<SingleResourceResponse<Category>> => {
	const response = await api.post("/api/categories", data);
	return response.data;
};

export const updateCategory = async (id: number, data: Partial<Category>): Promise<SingleResourceResponse<Category>> => {
	const response = await api.put(`/api/categories/${id}`, data);
	return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
	await api.delete(`/api/categories/${id}`);
};
