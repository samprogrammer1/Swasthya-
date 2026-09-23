import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { Roles, CurrentUser, Public } from '../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { UserRole } from '@swasthya/config';

@ApiTags('Doctors')
@Controller('api/v1/doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Public()
  @Get(':doctorId/schedule')
  @ApiOperation({ summary: 'Get doctor OPD schedule and consultation timings' })
  async getSchedule(@Param('doctorId') doctorId: string) {
    return this.doctorsService.getSchedule(doctorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch('me/schedule')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update OPD schedule timings and daily token limit' })
  async updateSchedule(
    @CurrentUser('sub') doctorId: string,
    @Body() body: any,
  ) {
    return this.doctorsService.updateSchedule(doctorId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Get('me/receptionists')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get receptionist staff assigned to doctor OPD desk' })
  async getReceptionists(@CurrentUser('sub') doctorId: string) {
    return this.doctorsService.getReceptionists(doctorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post('me/receptionists')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new receptionist staff for OPD desk' })
  async addReceptionist(
    @CurrentUser('sub') doctorId: string,
    @Body() body: { fullName: string; mobile: string; email?: string; assignedClinic?: string },
  ) {
    return this.doctorsService.addReceptionist(doctorId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Patch('me/receptionists/:id/toggle')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable or disable receptionist desk access' })
  async toggleReceptionist(
    @CurrentUser('sub') doctorId: string,
    @Param('id') receptionistId: string,
    @Body() body: { isAssigned: boolean },
  ) {
    return this.doctorsService.toggleReceptionistStatus(doctorId, receptionistId, body.isAssigned);
  }
}
