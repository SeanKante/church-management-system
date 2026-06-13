import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permission } from "@cms/shared";
import type { AuthUser } from "@cms/shared";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) {
      return true;
    }
    const user = context.switchToHttp().getRequest().user as AuthUser | undefined;
    if (!user) {
      throw new ForbiddenException("Missing authenticated user");
    }
    const granted = new Set(user.permissions);
    const ok = required.every((p) => granted.has(p));
    if (!ok) {
      throw new ForbiddenException("Insufficient permissions");
    }
    return true;
  }
}
