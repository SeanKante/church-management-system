/** Roles available in the system, ordered loosely from most to least privileged. */
export enum Role {
  ADMIN = "ADMIN",
  PASTOR = "PASTOR",
  LEADER = "LEADER",
  MEMBER = "MEMBER",
}

/** Fine-grained permissions checked by the backend RBAC guard. */
export enum Permission {
  // Members
  MEMBERS_VIEW = "members:view",
  MEMBERS_MANAGE = "members:manage",
  // Church structure
  STRUCTURE_VIEW = "structure:view",
  STRUCTURE_MANAGE = "structure:manage",
  // Events
  EVENTS_VIEW = "events:view",
  EVENTS_MANAGE = "events:manage",
  // Attendance
  ATTENDANCE_VIEW = "attendance:view",
  ATTENDANCE_MANAGE = "attendance:manage",
  // Communication
  COMMUNICATION_SEND = "communication:send",
  // Pastoral care
  PASTORAL_VIEW = "pastoral:view",
  PASTORAL_MANAGE = "pastoral:manage",
  // Content / sermons
  CONTENT_VIEW = "content:view",
  CONTENT_MANAGE = "content:manage",
  // Analytics
  ANALYTICS_VIEW = "analytics:view",
  // User & role management
  USERS_MANAGE = "users:manage",
}

/** Default permission set granted to each role. */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.PASTOR]: [
    Permission.MEMBERS_VIEW,
    Permission.MEMBERS_MANAGE,
    Permission.STRUCTURE_VIEW,
    Permission.STRUCTURE_MANAGE,
    Permission.EVENTS_VIEW,
    Permission.EVENTS_MANAGE,
    Permission.ATTENDANCE_VIEW,
    Permission.ATTENDANCE_MANAGE,
    Permission.COMMUNICATION_SEND,
    Permission.PASTORAL_VIEW,
    Permission.PASTORAL_MANAGE,
    Permission.CONTENT_VIEW,
    Permission.CONTENT_MANAGE,
    Permission.ANALYTICS_VIEW,
  ],
  [Role.LEADER]: [
    Permission.MEMBERS_VIEW,
    Permission.STRUCTURE_VIEW,
    Permission.EVENTS_VIEW,
    Permission.EVENTS_MANAGE,
    Permission.ATTENDANCE_VIEW,
    Permission.ATTENDANCE_MANAGE,
    Permission.PASTORAL_VIEW,
    Permission.CONTENT_VIEW,
  ],
  [Role.MEMBER]: [
    Permission.EVENTS_VIEW,
    Permission.CONTENT_VIEW,
  ],
};

export function permissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
