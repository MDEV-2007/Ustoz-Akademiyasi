import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@ustozakademiyasi.uz', description: 'Foydalanuvchi elektron pochtasi' })
  @IsEmail({}, { message: 'Elektron pochta manzili formati noto‘g‘ri' })
  @IsNotEmpty({ message: 'Elektron pochta kiritilishi shart' })
  email: string;

  @ApiProperty({ example: 'SecureAdminPassword2026!#', description: 'Maxfiy parol' })
  @IsString({ message: 'Parol satr ko‘rinishida bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Aylantiriluvchi yangilash tokeni (Refresh token)' })
  @IsString({ message: 'Refresh token satr ko‘rinishida bo‘lishi kerak' })
  @IsNotEmpty({ message: 'Refresh token kiritilishi shart' })
  refreshToken: string;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Hozirgi amaldagi parol' })
  @IsString()
  @IsNotEmpty({ message: 'Hozirgi parol kiritilishi shart' })
  currentPassword: string;

  @ApiProperty({ minLength: 8, description: 'Yangi parol (kamida 8 ta belgi)' })
  @IsString()
  @IsNotEmpty({ message: 'Yangi parol kiritilishi shart' })
  @MinLength(8, { message: 'Yangi parol kamida 8 ta belgidan iborat bo‘lishi kerak' })
  newPassword: string;
}
