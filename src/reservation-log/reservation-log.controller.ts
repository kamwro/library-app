import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';

import { AuthGuardRest } from '../auth/auth.guard.rest';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { USER_ROLE } from '../shared/const';

import type { ReservationLog } from './reservation-log.schema';
import { ReservationLogService } from './reservation-log.service';

@ApiTags('Logs')
@Controller('admin/reservation-logs')
export class ReservationLogController {
  readonly #reservationLogService: ReservationLogService;
  constructor(reservationLogService: ReservationLogService) {
    this.#reservationLogService = reservationLogService;
  }

  @Get()
  @ApiOperation({ summary: 'Reservation logs' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successfully fetched logs' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Invalid credentials' })
  @ApiBearerAuth()
  @UseGuards(AuthGuardRest, RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  async getLogs(): Promise<ReservationLog[]> {
    return await this.#reservationLogService.getLogs();
  }
}
