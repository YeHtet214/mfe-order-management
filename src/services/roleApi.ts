import api from "./api";
import type { Role } from "./types";

export interface RoleListParams {
  dropdown?: 0 | 1;
  search?: string;
  status?: "active" | "inactive";
  per_page?: number;
  page?: number;
}

export interface RoleListResponse {
  data: Role[];
}

export const fetchRoles = async (params?: RoleListParams): Promise<RoleListResponse> => {
  const response = await api.get("/api/roles", { params });
  return response.data;
};
