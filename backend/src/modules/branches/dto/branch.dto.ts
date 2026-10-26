import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GeneralStatus } from '@prisma/client';

export class CreateBranchDto {
  @ApiProperty({ example: "Archako'cha filiali" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "ARCHAKO'CHA FILIALI" })
  @IsString()
  @IsNotEmpty()
  officialLabel: string;

  @ApiProperty({ example: 'archakocha' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ example: "Shayxontohur / Ko'kcha yo'nalishi" })
  @IsString()
  @IsNotEmpty()
  area: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: "Toshkent sh., Archako'cha hududi" })
  @IsOptional()
  @IsString()
  addressNote?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiPropertyOptional({ example: 41.311081 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 69.240562 })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: '+998 55 518 44 00' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ default: 'Dushanba – Shanba (guruhlar jadvali bo‘yicha)' })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: "Barcha asosiy o'quv yo'nalishlari faol filial." })
  @IsOptional()
  @IsString()
  highlight?: string;

  @ApiPropertyOptional({ type: [String], default: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ enum: GeneralStatus, default: GeneralStatus.ACTIVE })
  @IsOptional()
  @IsEnum(GeneralStatus)
  status?: GeneralStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional({ type: [String], description: 'Filialda mavjud kurs ID yoki sluglari' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  courseIds?: string[];
}

export class UpdateBranchDto extends CreateBranchDto {}
