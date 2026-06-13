import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { Permission } from "@cms/shared";
import { MembersService } from "./members.service";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { PermissionsGuard } from "../auth/guards/permissions.guard";

@Controller("members")
@UseGuards(PermissionsGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @RequirePermissions(Permission.MEMBERS_VIEW)
  findAll(@Query("search") search?: string) {
    return this.membersService.findAll(search);
  }
}
