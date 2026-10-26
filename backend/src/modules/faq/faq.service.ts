import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';
import { GeneralStatus } from '@prisma/client';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  async findPublicFaqs(category?: string) {
    const where: any = { status: GeneralStatus.ACTIVE };
    if (category && category !== 'Barchasi') {
      where.category = category;
    }
    return this.prisma.fAQ.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.fAQ.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async findOneAdmin(id: string) {
    const faq = await this.prisma.fAQ.findUnique({ where: { id } });
    if (!faq) {
      throw new NotFoundException("Savol-javob topilmadi.");
    }
    return faq;
  }

  async create(dto: CreateFaqDto, userId?: string) {
    const created = await this.prisma.fAQ.create({
      data: {
        question: dto.question.trim(),
        answer: dto.answer.trim(),
        category: dto.category.trim(),
        sortOrder: dto.sortOrder || 0,
        status: dto.status || GeneralStatus.ACTIVE,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_FAQ',
          entityType: 'FAQ',
          entityId: created.id,
        },
      });
    }

    return created;
  }

  async update(id: string, dto: UpdateFaqDto, userId?: string) {
    const faq = await this.findOneAdmin(id);

    const updated = await this.prisma.fAQ.update({
      where: { id: faq.id },
      data: {
        question: dto.question?.trim(),
        answer: dto.answer?.trim(),
        category: dto.category?.trim(),
        sortOrder: dto.sortOrder,
        status: dto.status,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_FAQ',
          entityType: 'FAQ',
          entityId: updated.id,
          details: { changes: dto as any },
        },
      });
    }

    return updated;
  }

  async remove(id: string, userId?: string) {
    const faq = await this.findOneAdmin(id);
    await this.prisma.fAQ.delete({ where: { id: faq.id } });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'DELETE_FAQ',
          entityType: 'FAQ',
          entityId: faq.id,
        },
      });
    }

    return { success: true, message: "Savol-javob o‘chirildi." };
  }
}
