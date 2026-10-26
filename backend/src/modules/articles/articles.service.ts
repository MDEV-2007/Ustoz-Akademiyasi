import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { CreateArticleDto, UpdateArticleDto, QueryArticlesDto } from './dto/article.dto';
import { buildPaginationMeta } from '@/common/dto/pagination.dto';
import { ContentStatus, Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findPublicArticles(query: QueryArticlesDto) {
    const where: Prisma.ArticleWhereInput = {
      status: ContentStatus.PUBLISHED,
    };

    if (query.topic && query.topic !== 'Barchasi') {
      where.topic = query.topic;
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { excerpt: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          items: { orderBy: { sortOrder: 'asc' }, take: 4 },
        },
      }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  }

  async findPublicBySlug(slug: string) {
    const article = await this.prisma.article.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
      include: {
        items: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!article) {
      throw new NotFoundException(`«${slug}» maqolasi topilmadi.`);
    }

    return article;
  }

  async findAllAdmin(query: QueryArticlesDto) {
    const where: Prisma.ArticleWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.topic) where.topic = query.topic;

    const [total, items] = await Promise.all([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, fullName: true, email: true } },
          _count: { select: { items: true } },
        },
      }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  }

  async findOneAdmin(id: string) {
    const article = await this.prisma.article.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        author: true,
        items: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!article) {
      throw new NotFoundException("Maqola topilmadi.");
    }
    return article;
  }

  async create(dto: CreateArticleDto, userId?: string) {
    const existing = await this.prisma.article.findUnique({
      where: { slug: dto.slug.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException("Ushbu slug bo‘yicha maqola allaqachon mavjud.");
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const art = await tx.article.create({
        data: {
          title: dto.title.trim(),
          slug: dto.slug.toLowerCase().trim(),
          excerpt: dto.excerpt.trim(),
          content: dto.content?.trim(),
          intro: dto.intro?.trim(),
          coverImage: dto.coverImage,
          topic: dto.topic.trim(),
          sourceNote: dto.sourceNote?.trim(),
          readTime: dto.readTime || '4 daqiqa',
          authorId: userId,
          status: dto.status || ContentStatus.PUBLISHED,
          metaTitle: dto.metaTitle,
          metaDescription: dto.metaDescription,
          items: dto.items
            ? {
                create: dto.items.map((it, idx) => ({
                  arabicText: it.arabicText,
                  translit: it.translit,
                  translation: it.translation,
                  sortOrder: it.sortOrder ?? idx + 1,
                })),
              }
            : undefined,
        },
      });
      return art;
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'CREATE_ARTICLE',
          entityType: 'Article',
          entityId: created.id,
          details: { title: created.title, slug: created.slug },
        },
      });
    }

    return created;
  }

  async update(id: string, dto: UpdateArticleDto, userId?: string) {
    const article = await this.findOneAdmin(id);

    if (dto.slug && dto.slug !== article.slug) {
      const existing = await this.prisma.article.findUnique({
        where: { slug: dto.slug.toLowerCase().trim() },
      });
      if (existing) {
        throw new ConflictException("Ushbu slug band.");
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (dto.items) {
        await tx.articleItem.deleteMany({ where: { articleId: article.id } });
        await tx.articleItem.createMany({
          data: dto.items.map((it, idx) => ({
            articleId: article.id,
            arabicText: it.arabicText,
            translit: it.translit,
            translation: it.translation,
            sortOrder: it.sortOrder ?? idx + 1,
          })),
        });
      }

      return tx.article.update({
        where: { id: article.id },
        data: {
          title: dto.title?.trim(),
          slug: dto.slug?.toLowerCase().trim(),
          excerpt: dto.excerpt?.trim(),
          content: dto.content?.trim(),
          intro: dto.intro?.trim(),
          coverImage: dto.coverImage,
          topic: dto.topic?.trim(),
          sourceNote: dto.sourceNote?.trim(),
          readTime: dto.readTime,
          status: dto.status,
          metaTitle: dto.metaTitle,
          metaDescription: dto.metaDescription,
        },
      });
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'UPDATE_ARTICLE',
          entityType: 'Article',
          entityId: updated.id,
          details: { changes: dto as any },
        },
      });
    }

    return updated;
  }

  async remove(id: string, userId?: string) {
    const article = await this.findOneAdmin(id);
    await this.prisma.article.update({
      where: { id: article.id },
      data: { status: ContentStatus.ARCHIVED },
    });

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action: 'ARCHIVE_ARTICLE',
          entityType: 'Article',
          entityId: article.id,
        },
      });
    }

    return { success: true, message: "Maqola arxivlandi." };
  }
}
