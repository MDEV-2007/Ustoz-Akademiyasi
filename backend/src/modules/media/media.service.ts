import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

@Injectable()
export class MediaService {
  private readonly uploadDir: string;
  private readonly maxSizeBytes: number;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const dir = this.configService.get<string>('storage.uploadDir') || 'uploads';
    this.uploadDir = path.resolve(process.cwd(), dir);
    const maxMb = this.configService.get<number>('storage.maxSizeMb') || 10;
    this.maxSizeBytes = maxMb * 1024 * 1024;

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File, altText?: string, userId?: string) {
    if (!file) {
      throw new BadRequestException("Fayl yuklanmadi.");
    }

    if (file.size > this.maxSizeBytes) {
      throw new BadRequestException(`Fayl hajmi ruxsat etilgan maksimal hajmdan oshib ketdi (${this.maxSizeBytes / (1024 * 1024)}MB).`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException("Faqat ruxsat etilgan rasm formatlari yuklanishi mumkin (JPEG, PNG, WEBP, SVG, GIF).");
    }

    // Generate secure randomized storage key
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(this.uploadDir, randomName);

    await fs.promises.writeFile(filePath, file.buffer);

    const asset = await this.prisma.mediaAsset.create({
      data: {
        storageKey: randomName,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        altText: altText?.trim() || null,
        uploadedById: userId || null,
      },
    });

    const publicUrl = `/uploads/${randomName}`;

    return {
      id: asset.id,
      storageKey: asset.storageKey,
      url: publicUrl,
      originalFilename: asset.originalFilename,
      mimeType: asset.mimeType,
      sizeBytes: asset.sizeBytes,
      altText: asset.altText,
      createdAt: asset.createdAt,
    };
  }

  async findAll() {
    return this.prisma.mediaAsset.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        uploadedBy: { select: { fullName: true, email: true } },
      },
    });
  }

  async findOne(id: string) {
    const asset = await this.prisma.mediaAsset.findFirst({
      where: { OR: [{ id }, { storageKey: id }] },
    });
    if (!asset) {
      throw new NotFoundException("Fayl topilmadi.");
    }
    return asset;
  }

  async remove(id: string) {
    const asset = await this.findOne(id);
    const filePath = path.join(this.uploadDir, asset.storageKey);

    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath).catch(() => {});
    }

    await this.prisma.mediaAsset.delete({ where: { id: asset.id } });
    return { success: true, message: "Fayl o‘chirildi." };
  }
}
