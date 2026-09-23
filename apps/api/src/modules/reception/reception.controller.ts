import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReceptionService } from './reception.service';
import { Roles } from '../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { UserRole } from '@swasthya/config';

@ApiTags('Reception')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.RECEPTIONIST, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('api/v1/reception')
export class ReceptionController {
  constructor(private readonly receptionService: ReceptionService) {}

  @Get('patients/search')
  @ApiOperation({ summary: 'Fast patient lookup by mobile or name' })
  async searchPatient(@Query('q') query: string) {
    return this.receptionService.searchPatient(query || '');
  }

  @Post('patients/walk-in')
  @ApiOperation({ summary: 'Create new walk-in patient profile at reception desk' })
  async createWalkInPatient(
    @Body() body: { fullName: string; mobile: string; gender?: string; city?: string },
  ) {
    return this.receptionService.createWalkInPatient(body);
  }

  @Post('tokens/generate')
  @ApiOperation({ summary: 'Generate OPD Token & collect payment receipt' })
  async generateToken(
    @Body()
    body: {
      doctorId: string;
      patientId: string;
      patientName: string;
      patientMobile: string;
      visitType: 'NEW' | 'FOLLOWUP';
      amount: number;
      paymentMethod: 'CASH' | 'UPI' | 'CARD';
    },
  ) {
    return this.receptionService.generateToken(body);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get daily reception fee collection register' })
  async getPaymentRegister() {
    return this.receptionService.getPaymentRegister();
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get daily reception desk collection metrics' })
  async getReceptionReports() {
    return this.receptionService.getReceptionReports();
  }
}
