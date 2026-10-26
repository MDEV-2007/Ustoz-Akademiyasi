import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GeneralStatus } from '@prisma/client';

export class QuerySchedulesDto {
  @ApiPropertyOptional({ description: 'Kurs ID yoki slugi' })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({ description: 'Filial ID yoki slugi' })
  @IsOptional()
  @IsString()
  branchId?: string;

  @ApiPropertyOptional({ description: 'Ustoz ID si' })
  @IsOptional()
  @IsString()
  teacherId?: string;
}

export class CreateScheduleDto {
  @ApiProperty({ description: 'Kurs ID si' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ description: 'Filial ID si' })
  @IsString()
  @IsNotEmpty()
  branchId: string;

  @ApiPropertyOptional({ description: 'Ustoz ID si' })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ example: ['DUSHANBA', 'CHORSHANBA', 'JUMA'], description: 'Hafta kunlari' })
  @IsArray()
  @IsString({ each: true })
  daysOfWeek: string[];

  @ApiProperty({ example: '09:00', description: 'Boshlanish vaqti' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ example: '10:30', description: 'Tugash vaqti' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiPropertyOptional({ example: '2026-11-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2027-02-01' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiPropertyOptional({ enum: GeneralStatus, default: GeneralStatus.ACTIVE })
  @IsOptional()
  @IsEnum(GeneralStatus)
  status?: GeneralStatus;
}

export class UpdateScheduleDto extends CreateScheduleDto {}
