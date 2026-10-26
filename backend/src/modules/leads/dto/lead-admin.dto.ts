import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { RegistrationStatus } from '@prisma/client';
import { PaginationQueryDto } from '@/common/dto/pagination.dto';

export class QueryLeadsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: RegistrationStatus, description: 'Ariza holati bo‘yicha filtr' })
  @IsOptional()
  @IsEnum(RegistrationStatus)
  status?: RegistrationStatus;

  @ApiPropertyOptional({ description: 'Manba bo‘yicha filtr (masalan: TELEGRAM_BOT, WEBSITE)' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: 'Kurs ID yoki slugi bo‘yicha filtr' })
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional({ description: 'Filial ID yoki slugi bo‘yicha filtr' })
  @IsOptional()
  @IsString()
  branchId?: string;

  @ApiPropertyOptional({ description: 'Biriktirilgan menejer ID si' })
  @IsOptional()
  @IsString()
  managerId?: string;

  @ApiPropertyOptional({ description: 'Boshlanish sanasi (ISO 8601: 2026-10-01)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Tugash sanasi (ISO 8601: 2026-10-31)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class UpdateLeadStatusDto {
  @ApiPropertyOptional({ enum: RegistrationStatus, description: 'Yangi status' })
  @IsEnum(RegistrationStatus)
  status: RegistrationStatus;

  @ApiPropertyOptional({ description: 'Status o‘zgarishi sababi yoki izoh' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ description: 'Status o‘zgarishi sababi yoki izoh' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Qayta qo‘ng‘iroq vaqti (agar status CALLBACK bo‘lsa)' })
  @IsOptional()
  @IsString()
  callbackTime?: string;

  @ApiPropertyOptional({ description: 'Amalni bajargan operator nomi' })
  @IsOptional()
  @IsString()
  operatorName?: string;
}

export class AssignManagerDto {
  @ApiPropertyOptional({ description: 'Menejer (User) ID si' })
  @IsString()
  managerId: string;
}

export class UpdateInternalNotesDto {
  @ApiPropertyOptional({ description: 'Ichki ma’muriyat izohlari' })
  @IsString()
  internalNotes: string;
}
