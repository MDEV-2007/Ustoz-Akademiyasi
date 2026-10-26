import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { GeneralStatus } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findPublicCategories() {
    return this.prisma.courseCategory.findMany({
      where: { status: GeneralStatus.ACTIVE },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        sortOrder: true,
      },
    });
  }

  async findAllAdmin() {
    return this.prisma.courseCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { courses: true } },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.courseCategory.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { courses: true },
    });

    if (!category) {
      throw new NotFoundException("Kategoriya topilmadi.");
    }
    return category;
  }

  async create(dto: CreateCategoryDto, userId?: string) {
    const existing = await this.prisma.courseCategory.findUnique({
      where: { slug: dto.slug.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException("Ushbu slug bo‘yicha kategoriya allaqachon mavjud.");
    }

    const created = await this.prisma.courseCategory.create({
      data: {
        name: dto.name.trim(),
        slug: dto.slug.toLowerCase().trim(),
        description: dto.description?.trim(),
        sortOrder: dto.sortOrder || 0,
        status: dto.status || GeneralStatus.ACTIVE,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_CATEGORY',
          entityType: 'CourseCategory',
          entityId: created.id,
          details: { name: created.name, slug: created.slug },
        },
      });
    }

    return created;
  }

  async update(id: string, dto: UpdateCategoryDto, userId?: string) {
    const category = await this.findOne(id);

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.prisma.courseCategory.findUnique({
        where: { slug: dto.slug.toLowerCase().trim() },
      });
      if (existing) {
        throw new ConflictException("Ushbu slug band.");
      }
    }

    const updated = await this.prisma.courseCategory.update({
      where: { id: category.id },
      data: {
        name: dto.name?.trim(),
        slug: dto.slug?.toLowerCase().trim(),
        description: dto.description?.trim(),
        sortOrder: dto.sortOrder,
        status: dto.status,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_CATEGORY',
          entityType: 'CourseCategory',
          entityId: updated.id,
          details: { changes: dto as any },
        },
      });
    }

    return updated;
  }

  async remove(id: string, userId?: string) {
    const category = await this.findOne(id);
    await this.prisma.courseCategory.delete({ where: { id: category.id } });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'DELETE_CATEGORY',
          entityType: 'CourseCategory',
          entityId: category.id,
        },
      });
    }

    return { success: true, message: "Kategoriya o‘chirildi." };
  }
}
