import { Controller, Get, Param } from '@nestjs/common';
import { TableAvailabilityService } from './table-availability.service';

// avail + ability

@Controller('table-availability')
export class TableAvailabilityController {
  constructor(
    //Inject
    private readonly tableAvailabilityService: TableAvailabilityService,
  ) {}

  // http://localhost:5050/table-availability/2025-01-28
  @Get('/:date')
  public async getTableAvailabilityOnDate(@Param('date') date: string) {
    return this.tableAvailabilityService.getTableAvailabilityByDay(date);
  }
}
