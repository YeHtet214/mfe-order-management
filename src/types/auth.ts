
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

export interface MeResponse {
  message: string;
  user: User;
  role: Role;
  permissions: string[];
}
