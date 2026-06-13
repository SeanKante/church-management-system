import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};
    const members = await this.prisma.member.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { tags: true, groupLinks: { include: { group: true } } },
    });
    return members.map((m) => ({
      id: m.id,
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      phone: m.phone,
      isActive: m.isActive,
      joinedAt: m.joinedAt.toISOString(),
      tags: m.tags.map((t) => t.label),
      groups: m.groupLinks.map((g) => g.group.name),
    }));
  }
}
