import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ContentStatus } from '@prisma/client';
import { PaginationQueryDto } from '@/common/dto/pagination.dto';

export class QueryArticlesDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Mavzu bo‘yicha filtr (masalan: Kundalik lug‘at)' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ enum: ContentStatus })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

export class ArticleItemInputDto {
  @ApiProperty({ example: 'السَّلَامُ عَلَيْكُمْ' })
  @IsString()
  @IsNotEmpty()
  arabicText: string;

  @ApiProperty({ example: 'As-salamu alaykum' })
  @IsString()
  @IsNotEmpty()
  translit: string;

  @ApiProperty({ example: 'Sizga tinchlik va omonlik bo‘lsin' })
  @IsString()
  @IsNotEmpty()
  translation: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateArticleDto {
  @ApiProperty({ example: "Kundalik hayotda kerak bo'ladigan 10 ta Arabcha so'z va ibora" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'kundalik-hayotda-kerak-boladigan-10-ta-arabcha-soz' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: "Arab tilini o'rganishni boshlagan har bir inson uchun..." })
  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  intro?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({ example: "Kundalik lug'at" })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiPropertyOptional({ example: 'Instagram (@ustoz_akademiyasi) rasmiy o‘quv rukni asosida' })
  @IsOptional()
  @IsString()
  sourceNote?: string;

  @ApiPropertyOptional({ default: '4 daqiqa' })
  @IsOptional()
  @IsString()
  readTime?: string;

  @ApiPropertyOptional({ enum: ContentStatus, default: ContentStatus.PUBLISHED })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ type: [ArticleItemInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleItemInputDto)
  items?: ArticleItemInputDto[];
}

export class UpdateArticleDto extends CreateArticleDto {}
