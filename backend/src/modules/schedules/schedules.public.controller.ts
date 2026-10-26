import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { QuerySchedulesDto } from './dto/schedule.dto';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Public - Course Schedules')
@Controller('public/schedules')
export class SchedulesPublicController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Faol guruhlar dars jadvali (Kurs va filial bo‘yicha filtr)' })
  async findPublicSchedules(@Query() query: QuerySchedulesDto) {
    return this.schedulesService.findPublicSchedules(query);
  }
}
