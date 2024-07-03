export interface Role {
  roleName: string;
  permissions: RolePermission;
}

export interface RolePermission {
  CanAdd: boolean;
  CanDelete: boolean;
  CanRead: boolean;
  CanUpdate: boolean;
}
