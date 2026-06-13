import { Permission, Role } from "./rbac.js";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  permissions: Permission[];
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface DashboardOverview {
  totalMembers: number;
  activeGroups: number;
  upcomingEvents: number;
  attendanceRate: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}
