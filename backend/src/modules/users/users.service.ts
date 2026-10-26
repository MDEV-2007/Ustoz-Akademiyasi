import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateUserDto, UpdateUserDto, QueryUsersDto } from './dto/user.dto';
import { buildPaginationMeta } from '@/common/dto/pagination.dto';
import * as argon2 from 'argon2';
import { Prisma, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryUsersDto) {
    const where: Prisma.UserWhereInput = {};
    if (query.role) where.role = query.role;
    if (query.status) where.status = query.status;

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { fullName: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("Foydalanuvchi topilmadi.");
    }
    return user;
  }

  async create(dto: CreateUserDto, creatorId?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException("Ushbu elektron pochta manzili bilan foydalanuvchi allaqachon ro‘yxatdan o‘tgan.");
    }

    const passwordHash = await argon2.hash(dto.password);

    let status = dto.status || UserStatus.ACTIVE;
    if (dto.isActive !== undefined && !dto.status) {
      status = dto.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE;
    }

    const created = await this.prisma.user.create({
      data: {
        fullName: dto.fullName.trim(),
        email: dto.email.toLowerCase().trim(),
        phone: dto.phone?.trim(),
        passwordHash,
        role: dto.role,
        status,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (creatorId) {
      await this.prisma.auditLog.create({
        data: {
          userId: creatorId,
          action: 'CREATE_USER',
          entityType: 'User',
          entityId: created.id,
          details: { email: created.email, role: created.role },
        },
      });
    }

    return created;
  }

  async update(id: string, dto: UpdateUserDto, modifierId?: string) {
    const user = await this.findOne(id);

    if (dto.email && dto.email.toLowerCase().trim() !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase().trim() },
      });
      if (existing) {
        throw new ConflictException("Ushbu elektron pochta band.");
      }
    }

    let status = dto.status;
    if (dto.isActive !== undefined && !dto.status) {
      status = dto.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE;
    }

    const data: Prisma.UserUpdateInput = {
      fullName: dto.fullName?.trim(),
      email: dto.email?.toLowerCase().trim(),
      phone: dto.phone?.trim(),
      role: dto.role,
      status,
    };

    if (dto.password) {
      data.passwordHash = await argon2.hash(dto.password);
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (modifierId) {
      await this.prisma.auditLog.create({
        data: {
          userId: modifierId,
          action: 'UPDATE_USER',
          entityType: 'User',
          entityId: updated.id,
          details: { changes: { email: dto.email, role: dto.role, status: dto.status } },
        },
      });
    }

    return updated;
  }

  async remove(id: string, modifierId?: string) {
    const user = await this.findOne(id);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { status: UserStatus.INACTIVE },
    });

    // Revoke all tokens
    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revoked: true, revokedAt: new Date() },
    });

    if (modifierId) {
      await this.prisma.auditLog.create({
        data: {
          userId: modifierId,
          action: 'DEACTIVATE_USER',
          entityType: 'User',
          entityId: user.id,
        },
      });
    }

    return { success: true, message: "Foydalanuvchi faolsizlantirildi." };
  }
}
