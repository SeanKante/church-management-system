import { Controller, Get } from "@nestjs/common";
import type { ActivityItem, DashboardOverview } from "@cms/shared";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("overview")
  overview(): Promise<DashboardOverview> {
    return this.dashboardService.overview();
  }

  @Get("activity")
  activity(): Promise<ActivityItem[]> {
    return this.dashboardService.recentActivity();
  }
}
