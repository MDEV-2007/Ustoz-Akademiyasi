import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTrialRegistrationDto {
  @ApiProperty({ example: 'Abdulloh Karimov', description: 'O‘quvchi yoki ota-onaning ism va familiyasi' })
  @IsString({ message: 'Ism matn ko‘rinishida bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Ism va familiya kiritilishi shart' })
  @MinLength(3, { message: 'Ism kamida 3 ta belgidan iborat bo‘lishi kerak' })
  fullName: string;

  @ApiProperty({ example: '+998 90 123-45-67', description: 'O‘zbekiston telefon raqami' })
  @IsString({ message: 'Telefon raqami kiritilishi shart' })
  @IsNotEmpty({ message: 'Telefon raqami bo‘sh bo‘lishi mumkin emas' })
  phone: string;

  @ApiPropertyOptional({ example: 'professional-fonetika', description: 'Tanlangan kurs slugi yoki ID si' })
  @IsOptional()
  @IsString()
  courseSlug?: string;

  @ApiPropertyOptional({ example: 'archakocha', description: 'Tanlangan filial slugi yoki ID si' })
  @IsOptional()
  @IsString()
  branchSlug?: string;

  @ApiPropertyOptional({ example: 'Kunduzgi guruhlar ma’qul', description: 'Qo‘shimcha izoh yoki qulay vaqt' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'Sinov darsiga yozilmoqchiman', description: 'Foydalanuvchi xabari' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 'Qo‘shimcha fikr yoki savol', description: 'Izoh' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ example: '14:00-16:00', description: 'O‘quvchi uchun ma’qul vaqt' })
  @IsOptional()
  @IsString()
  preferredTime?: string;

  @ApiPropertyOptional({ description: 'Takroriy yuborishdan himoya qiluvchi idempotensiya kaliti' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;

  @ApiPropertyOptional({ example: 'TELEGRAM_BOT', description: 'Ariza manbai (WEBSITE, TELEGRAM_BOT, etc.)' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ example: '123456789', description: 'Foydalanuvchining Telegram ID si' })
  @IsOptional()
  @IsString()
  telegramUserId?: string;

  @ApiPropertyOptional({ example: 'abdulloh_uz', description: 'Foydalanuvchining Telegram username' })
  @IsOptional()
  @IsString()
  telegramUsername?: string;

  @ApiPropertyOptional({ example: 'TRIAL_LESSON', description: 'So‘rov turi (TRIAL_LESSON, COURSE_INQUIRY, CONSULTATION)' })
  @IsOptional()
  @IsString()
  inquiryType?: string;

  @ApiPropertyOptional({ description: 'Qayta qo‘ng‘iroq vaqti' })
  @IsOptional()
  @IsString()
  callbackTime?: string;
}
