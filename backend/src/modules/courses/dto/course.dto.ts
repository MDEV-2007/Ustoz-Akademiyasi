import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentStatus } from '@prisma/client';
import { PaginationQueryDto } from '@/common/dto/pagination.dto';

export class QueryCoursesDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Kategoriya ID si yoki slugi' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Daraja bo‘yicha filtr (masalan: A1, B1-C1)' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ description: 'Auditoriya (Bolalar, Kattalar)' })
  @IsOptional()
  @IsString()
  audience?: string;

  @ApiPropertyOptional({ description: 'Faqat tanlangan/asosiy kurslar' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ enum: ContentStatus, description: 'Nashr holati (Admin uchun)' })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

export class CourseOutcomeInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CourseModuleInputDto {
  @ApiProperty({ example: '1-modul: Harflar maxraji' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Alif, Ba, Ta tovushlari' })
  @IsString()
  @IsNotEmpty()
  topics: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CourseFaqInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateCourseDto {
  @ApiProperty({ example: 'Professional Fonetika' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'professional-fonetika' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Arab harflarini asl maxrajidan o‘rganish kursi' })
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @ApiProperty({ example: 'Batafsil dars metodikasi va dasturi...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Kategoriya ID si' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: '0 dan boshlovchi o‘smirlar va kattalar' })
  @IsString()
  @IsNotEmpty()
  targetAudience: string;

  @ApiProperty({ example: 'A1 — Boshlang‘ich' })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  durationMonths?: number;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @IsNumber()
  priceAmount?: number;

  @ApiPropertyOptional({ default: 'UZS' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  ageMinimum?: number;

  @ApiPropertyOptional({ example: 99 })
  @IsOptional()
  @IsNumber()
  ageMaximum?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  entryRequirements?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  durationNote?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  priceStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  methodology?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  plateType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: ContentStatus, default: ContentStatus.PUBLISHED })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ type: [CourseOutcomeInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseOutcomeInputDto)
  outcomes?: CourseOutcomeInputDto[];

  @ApiPropertyOptional({ type: [CourseModuleInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseModuleInputDto)
  syllabusModules?: CourseModuleInputDto[];

  @ApiPropertyOptional({ type: [CourseFaqInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CourseFaqInputDto)
  faqs?: CourseFaqInputDto[];

  @ApiPropertyOptional({ type: [String], description: 'Ushbu kurs mavjud bo‘lgan filial ID lari' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  branchIds?: string[];
}

export class UpdateCourseDto extends CreateCourseDto {}
