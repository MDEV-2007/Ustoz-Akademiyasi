import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';
import { ContentStatus } from '@prisma/client';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findPublicTestimonials() {
    // Only return testimonials where publication consent is confirmed and status is PUBLISHED
    return this.prisma.testimonial.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        consentConfirmed: true,
      },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        displayName: true,
        text: true,
        rating: true,
        photo: true,
        course: { select: { title: true } },
        branch: { select: { name: true } },
      },
    });
  }

  async findAllAdmin() {
    return this.prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        course: { select: { title: true } },
        branch: { select: { name: true } },
      },
    });
  }

  async findOneAdmin(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
      include: { course: true, branch: true },
    });
    if (!testimonial) {
      throw new NotFoundException("Fikr topilmadi.");
    }
    return testimonial;
  }

  async create(dto: CreateTestimonialDto, userId?: string) {
    const created = await this.prisma.testimonial.create({
      data: {
        displayName: dto.displayName.trim(),
        text: dto.text.trim(),
        courseId: dto.courseId,
        branchId: dto.branchId,
        rating: dto.rating || 5,
        photo: dto.photo,
        consentConfirmed: dto.consentConfirmed,
        status: dto.status || ContentStatus.PUBLISHED,
        displayOrder: dto.displayOrder || 0,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_TESTIMONIAL',
          entityType: 'Testimonial',
          entityId: created.id,
        },
      });
    }

    return created;
  }

  async update(id: string, dto: UpdateTestimonialDto, userId?: string) {
    const testimonial = await this.findOneAdmin(id);

    const updated = await this.prisma.testimonial.update({
      where: { id: testimonial.id },
      data: {
        displayName: dto.displayName?.trim(),
        text: dto.text?.trim(),
        courseId: dto.courseId,
        branchId: dto.branchId,
        rating: dto.rating,
        photo: dto.photo,
        consentConfirmed: dto.consentConfirmed,
        status: dto.status,
        displayOrder: dto.displayOrder,
      },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_TESTIMONIAL',
          entityType: 'Testimonial',
          entityId: updated.id,
          details: { changes: dto as any },
        },
      });
    }

    return updated;
  }

  async remove(id: string, userId?: string) {
    const testimonial = await this.findOneAdmin(id);
    await this.prisma.testimonial.delete({ where: { id: testimonial.id } });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'DELETE_TESTIMONIAL',
          entityType: 'Testimonial',
          entityId: testimonial.id,
        },
      });
    }

    return { success: true, message: "Fikr o‘chirildi." };
  }
}
