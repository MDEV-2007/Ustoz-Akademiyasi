import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GeneralStatus } from '@prisma/client';

export class CreateFaqDto {
  @ApiProperty({ example: 'Arab tilini umuman 0 dan boshlasam, qaysi kursga yozilishim kerak?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 'Agar siz hali arab harflarini tanimasangiz...' })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ example: "Boshlang'ich" })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ enum: GeneralStatus, default: GeneralStatus.ACTIVE })
  @IsOptional()
  @IsEnum(GeneralStatus)
  status?: GeneralStatus;
}

export class UpdateFaqDto extends CreateFaqDto {}
