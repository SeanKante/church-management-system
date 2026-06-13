import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { permissionsForRole, Role } from "@cms/shared";
import type { AuthResponse, AuthUser } from "@cms/shared";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto, RegisterDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException("Email is already registered");
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: Role.MEMBER,
      },
    });
    await this.prisma.activityLog.create({
      data: { type: "member", message: `${user.firstName} ${user.lastName} registered an account` },
    });
    return this.buildResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return this.buildResponse(user);
  }

  private buildResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }): AuthResponse {
    const role = user.role as Role;
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role,
      permissions: permissionsForRole(role),
    };
    const accessToken = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    return { accessToken, user: authUser };
  }
}
