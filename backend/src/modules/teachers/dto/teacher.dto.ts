import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GeneralStatus } from '@prisma/client';

export class CreateTeacherDto {
  @ApiProperty({ example: 'Professional Fonetika va Maxraj kafedrasi' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'dept-phonetics' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Fonetika va Maxraj' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiPropertyOptional({ example: 'Maxraj va Talaffuz mutaxassislari' })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiProperty({ example: 'Arab fonetikasi va klassik talaffuz qoidalari bo‘yicha malakali ustozlar' })
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @ApiProperty({ example: '0 dan boshlagan o‘quvchilarga 28 ta harfning artikulyatsion nuqtalarini o‘rgatish' })
  @IsString()
  @IsNotEmpty()
  focus: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({ default: 3 })
  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @ApiPropertyOptional({ type: [String], default: ['Arab tili', 'O‘zbek tili'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @ApiPropertyOptional({ enum: GeneralStatus, default: GeneralStatus.ACTIVE })
  @IsOptional()
  @IsEnum(GeneralStatus)
  status?: GeneralStatus;
}

export class UpdateTeacherDto extends CreateTeacherDto {}
