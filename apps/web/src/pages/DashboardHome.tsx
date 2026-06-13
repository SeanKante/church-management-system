import { useQuery } from "@tanstack/react-query";
import {
  CalendarPlus,
  ClipboardCheck,
  Megaphone,
  TrendingUp,
  UserPlus,
  Users,
  CalendarDays,
  Boxes,
} from "lucide-react";
import type { ActivityItem, DashboardOverview } from "@cms/shared";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";

const STAT_META = [
  { key: "totalMembers", label: "Total Members", icon: Users, suffix: "" },
  { key: "activeGroups", label: "Active Groups", icon: Boxes, suffix: "" },
  { key: "upcomingEvents", label: "Upcoming Events", icon: CalendarDays, suffix: "" },
  { key: "attendanceRate", label: "Attendance Rate", icon: TrendingUp, suffix: "%" },
] as const;

const QUICK_ACTIONS = [
  { label: "Add Member", icon: UserPlus },
  { label: "Create Event", icon: CalendarPlus },
  { label: "Send Announcement", icon: Megaphone },
  { label: "Record Attendance", icon: ClipboardCheck },
];

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function DashboardHome() {
  const { user } = useAuth();

  const overview = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => (await api.get<DashboardOverview>("/dashboard/overview")).data,
  });

  const activity = useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: async () => (await api.get<ActivityItem[]>("/dashboard/activity")).data,
  });

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.firstName ?? ""}`}
        description="Here's what's happening across your church today."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_META.map((stat) => {
          const value = overview.data?.[stat.key];
          return (
            <Card key={stat.key}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {overview.isLoading ? "—" : `${value ?? 0}${stat.suffix}`}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent>
            <h3 className="mb-4 text-sm font-semibold text-slate-700">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto flex-col items-start gap-2 py-3 text-left"
                >
                  <action.icon className="h-5 w-5 text-brand-600" />
                  <span className="text-xs font-medium text-slate-700">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent>
            <h3 className="mb-4 text-sm font-semibold text-slate-700">Recent Activity</h3>
            {activity.isLoading ? (
              <p className="text-sm text-slate-400">Loading activity…</p>
            ) : activity.data && activity.data.length > 0 ? (
              <ul className="space-y-3">
                {activity.data.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{item.message}</p>
                      <p className="text-xs text-slate-400">{relativeTime(item.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No recent activity yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
