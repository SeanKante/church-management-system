import {
  BarChart3,
  CalendarDays,
  Church,
  ClipboardCheck,
  FileVideo,
  HeartHandshake,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Permission } from "@cms/shared";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  permission?: Permission;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "People", to: "/members", icon: Users, permission: Permission.MEMBERS_VIEW },
  { label: "Church Structure", to: "/structure", icon: Church, permission: Permission.STRUCTURE_VIEW },
  { label: "Events", to: "/events", icon: CalendarDays, permission: Permission.EVENTS_VIEW },
  { label: "Attendance", to: "/attendance", icon: ClipboardCheck, permission: Permission.ATTENDANCE_VIEW },
  { label: "Communication", to: "/communication", icon: MessageSquare, permission: Permission.COMMUNICATION_SEND },
  { label: "Pastoral Care", to: "/pastoral-care", icon: HeartHandshake, permission: Permission.PASTORAL_VIEW },
  { label: "Content", to: "/content", icon: FileVideo, permission: Permission.CONTENT_VIEW },
  { label: "Analytics", to: "/analytics", icon: BarChart3, permission: Permission.ANALYTICS_VIEW },
  { label: "User Management", to: "/users", icon: ShieldCheck, permission: Permission.USERS_MANAGE },
];
