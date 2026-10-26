import { Controller, Post, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { LeadsService } from './leads.service';
import { CreateTrialRegistrationDto } from './dto/create-trial-registration.dto';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Trial Registrations')
@Controller('public/trial-registrations')
export class LeadsPublicController {
  constructor(private readonly leadsService: LeadsService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Bepul sinov darsiga ariza topshirish' })
  @ApiResponse({ status: 201, description: 'Ariza qabul qilindi va referenceId taqdim etildi' })
  @ApiResponse({ status: 400, description: 'Kiritilgan ma’lumotlar yaroqsiz' })
  @ApiResponse({ status: 409, description: 'Qisqa vaqt ichida takroriy ariza' })
  async createRegistration(@Body() dto: CreateTrialRegistrationDto, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.leadsService.createPublicRegistration(dto, ip, userAgent);
  }
}
