import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { Roles, CurrentUser, Public } from '../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { UserRole } from '@swasthya/config';

@ApiTags('Organizations')
@Controller('api/v1/organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get hospital or clinic organizational profile and departments' })
  async getOrganization(@Param('id') id: string) {
    return this.organizationsService.getOrganization(id);
  }

  @Public()
  @Get('doctor/:doctorId/affiliations')
  @ApiOperation({ summary: 'Get multi-organization affiliations for a doctor' })
  async getDoctorOrganizations(@Param('doctorId') doctorId: string) {
    return this.organizationsService.getDoctorOrganizations(doctorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOSPITAL_ADMIN, UserRole.CLINIC_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @Post(':id/departments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new department to hospital structure' })
  async addDepartment(
    @Param('id') orgId: string,
    @Body() body: { name: string; code: string; headDoctorName: string },
  ) {
    return this.organizationsService.addDepartment(orgId, body.name, body.code, body.headDoctorName);
  }
}
