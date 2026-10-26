import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/database/prisma.service';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { User, UserStatus } from '@prisma/client';
import { LoginDto, ChangePasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedException("Elektron pochta yoki parol noto‘g‘ri.");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Ushbu hisob faol holatda emas yoki vaqtincha bloklangan.");
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Elektron pochta yoki parol noto‘g‘ri.");
    }

    // Update lastLoginAt
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Record Audit Log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        details: { email: user.email, role: user.role },
        ipAddress,
        userAgent,
      },
    });

    return this.generateTokens(user, ipAddress, userAgent);
  }

  async refreshTokens(rawRefreshToken: string, ipAddress?: string, userAgent?: string) {
    if (!rawRefreshToken) {
      throw new UnauthorizedException("Refresh token taqdim etilmadi.");
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(rawRefreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException("Refresh token muddati tugagan yoki yaroqsiz.");
    }

    const tokenHash = this.hashToken(rawRefreshToken);
    const existingToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!existingToken || existingToken.revoked || existingToken.expiresAt < new Date()) {
      throw new UnauthorizedException("Ushbu sessiya bekor qilingan yoki topilmadi.");
    }

    const user = existingToken.user;
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("Foydalanuvchi hisobi faol emas.");
    }

    // Revoke old token as part of rotation
    await this.prisma.refreshToken.update({
      where: { id: existingToken.id },
      data: { revoked: true, revokedAt: new Date() },
    });

    return this.generateTokens(user, ipAddress, userAgent);
  }

  async logout(rawRefreshToken: string) {
    if (!rawRefreshToken) return { success: true };
    const tokenHash = this.hashToken(rawRefreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true, revokedAt: new Date() },
    });
    return { success: true, message: "Muvaffaqiyatli tizimdan chiqildi." };
  }

  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true, revokedAt: new Date() },
    });
    return { success: true, message: "Barcha faol sessiyalar bekor qilindi." };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("Foydalanuvchi topilmadi.");
    }

    const isMatch = await argon2.verify(user.passwordHash, dto.currentPassword);
    if (!isMatch) {
      throw new BadRequestException("Amaldagi parol noto‘g‘ri kiritildi.");
    }

    const newPasswordHash = await argon2.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Revoke all refresh tokens on password change for security
    await this.logoutAll(userId);

    // Record audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'CHANGE_PASSWORD',
        entityType: 'User',
        entityId: userId,
        details: { message: 'Password changed successfully' },
      },
    });

    return { success: true, message: "Parol muvaffaqiyatli yangilandi. Iltimos, qayta tizimga kiring." };
  }

  private async generateTokens(user: User, ipAddress?: string, userAgent?: string) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessSecret = this.configService.get<string>('jwt.accessSecret')!;
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret')!;
    const accessTtl = this.configService.get<string>('jwt.accessTtl') || '15m';
    const refreshTtl = this.configService.get<string>('jwt.refreshTtl') || '7d';

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: accessTtl as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshTtl as any,
    });

    // Save hashed refresh token to DB with 7-day expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}
