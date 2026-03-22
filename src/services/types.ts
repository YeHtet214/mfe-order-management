export interface PaginationLinks {
	first: string;
	last: string;
	prev: string | null;
	next: string | null;
}

export interface PaginationMeta {
	current_page: number;
	from: number;
	last_page: number;
	path: string;
	per_page: number;
	to: number;
	total: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	links: PaginationLinks;
	meta: PaginationMeta;
}

export interface Category {
	id: number;
	name: string;
	slug: string;
	description: string | null;
	status: "active" | "inactive";
	created_at: string;
	updated_at: string;
}

export interface VariantAttribute {
	id: number;
	product_variant_id: number;
	attribute_name: string;
	attribute_value: string;
	created_at: string;
	updated_at: string;
}

export interface ProductVariant {
	id: number;
	product_id: number;
	name: string;
	sku: string;
	price: string | null;
	stock_quantity: number;
	status: "active" | "inactive";
	created_at: string;
	updated_at: string;
	attributes: VariantAttribute[];
}

export interface Product {
	id: number;
	category_id: number | null;
	name: string;
	slug: string;
	description: string | null;
	sku: string;
	base_price: string;
	stock_quantity: number;
	status: "active" | "inactive";
	has_variants: boolean;
	created_at: string;
	updated_at: string;
	category?: Category | null;
	variants: ProductVariant[];
}

export interface SingleResourceResponse<T> {
	data: T;
}

export interface Role {
	id: number;
	name: string;
	slug: string;
	permissions_count?: number;
	permissions?: Permission[];
	created_at: string;
	updated_at: string;
}

export interface User {
	id: number;
	name: string;
	email: string;
	status: "active" | "inactive";
	role: Role;
	created_at: string;
	updated_at: string;
}

export interface Permission {
	id: number;
	name: string;
	slug: string;
	resource: string;
	action: string;
}

export interface PermissionGroup {
	resource: string;
	label: string;
	permissions: Permission[];
}

export interface MeResponse {
	message: string;
	user: User;
	role: Role;
	permissions: string[];
}

export interface ValidationErrorResponse {
	message: string;
	errors: Record<string, string[]>;
}

export interface GenericErrorResponse {
	message: string;
}
