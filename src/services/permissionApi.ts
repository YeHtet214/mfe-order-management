import api from "./api";
import type { PermissionGroup } from "./types";

export interface PermissionListResponse {
  data: PermissionGroup[];
}

export const fetchPermissions = async (): Promise<PermissionListResponse> => {
  const response = await api.get("/api/permissions");
  return response.data;
};
