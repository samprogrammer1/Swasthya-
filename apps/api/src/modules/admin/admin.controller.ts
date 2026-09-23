import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { Roles, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { UserRole, DoctorVerificationStatus } from '@swasthya/config';
import { AuditService } from '../audit/audit.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@Controller('api/v1/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly auditService: AuditService,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get overall platform admin metrics and telemetry' })
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('doctors')
  @ApiOperation({ summary: 'Get list of doctors with verification status filter' })
  async getDoctors(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getDoctors({ status, search });
  }

  @Patch('doctors/:id/verify')
  @ApiOperation({ summary: 'Verify, reject or suspend a doctor account' })
  async verifyDoctor(
    @CurrentUser() adminUser: any,
    @Param('id') doctorId: string,
    @Body() body: { status: DoctorVerificationStatus; reason?: string },
  ) {
    return this.adminService.verifyDoctor(adminUser, doctorId, body.status, body.reason);
  }

  @Get('hospitals')
  @ApiOperation({ summary: 'List all registered hospitals in platform' })
  async getHospitals() {
    return this.adminService.getHospitals();
  }

  @Post('hospitals')
  @ApiOperation({ summary: 'Create a new hospital entity' })
  async createHospital(
    @CurrentUser() adminUser: any,
    @Body() body: { name: string; city: string; address: string; contactNumber: string },
  ) {
    return this.adminService.createHospital(adminUser, body);
  }

  @Get('clinics')
  @ApiOperation({ summary: 'List all registered clinics' })
  async getClinics() {
    return this.adminService.getClinics();
  }

  @Get('patients')
  @ApiOperation({ summary: 'Search and list registered patients (Least privilege view)' })
  async getPatients(@Query('search') search?: string) {
    return this.adminService.getPatients(search);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'List doctor & hospital reviews for moderation' })
  async getReviews() {
    return this.adminService.getReviews();
  }

  @Patch('reviews/:id/moderate')
  @ApiOperation({ summary: 'Moderate, hide or restore review status' })
  async moderateReview(
    @CurrentUser() adminUser: any,
    @Param('id') reviewId: string,
    @Body() body: { status: 'PUBLISHED' | 'HIDDEN' | 'FLAGGED' },
  ) {
    return this.adminService.moderateReview(adminUser, reviewId, body.status);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Retrieve system operational audit logs' })
  async getAuditLogs(@Query('search') search?: string) {
    return this.auditService.getLogs({ search });
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get global platform settings and feature flags' })
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update platform operational parameters' })
  async updateSettings(@CurrentUser() adminUser: any, @Body() body: any) {
    return this.adminService.updateSettings(adminUser, body);
  }
}
