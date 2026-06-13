import { Injectable } from "@nestjs/common";
import type { ActivityItem, DashboardOverview } from "@cms/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(): Promise<DashboardOverview> {
    const now = new Date();
    const [totalMembers, activeGroups, upcomingEvents, attendanceAgg] = await Promise.all([
      this.prisma.member.count({ where: { isActive: true } }),
      this.prisma.group.count({ where: { isActive: true } }),
      this.prisma.event.count({ where: { startsAt: { gte: now } } }),
      this.prisma.attendance.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

    const total = attendanceAgg.reduce((sum, row) => sum + row._count._all, 0);
    const present = attendanceAgg
      .filter((row) => row.status === "PRESENT")
      .reduce((sum, row) => sum + row._count._all, 0);
    const attendanceRate = total === 0 ? 0 : Math.round((present / total) * 100);

    return { totalMembers, activeGroups, upcomingEvents, attendanceRate };
  }

  async recentActivity(limit = 10): Promise<ActivityItem[]> {
    const logs = await this.prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return logs.map((log) => ({
      id: log.id,
      type: log.type,
      message: log.message,
      createdAt: log.createdAt.toISOString(),
    }));
  }
}
