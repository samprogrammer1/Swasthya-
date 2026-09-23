import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PrescriptionService } from './prescription.service';
import { Roles, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { UserRole } from '@swasthya/config';

@ApiTags('Prescriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create digital prescription for patient' })
  async createPrescription(
    @CurrentUser('sub') doctorId: string,
    @Body() body: any,
  ) {
    return this.prescriptionService.createPrescription(doctorId, body);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get prescriptions created by a specific doctor' })
  async getByDoctor(@Param('doctorId') doctorId: string) {
    return this.prescriptionService.getPrescriptionsByDoctor(doctorId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get medical prescriptions history for a patient' })
  async getByPatient(@Param('patientId') patientId: string) {
    return this.prescriptionService.getPrescriptionsByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prescription details by ID' })
  async getById(@Param('id') id: string) {
    return this.prescriptionService.getById(id);
  }
}
