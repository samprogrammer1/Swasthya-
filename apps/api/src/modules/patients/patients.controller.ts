import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { Public, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';

@ApiTags('Patients')
@Controller('api/v1/patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Public()
  @Get('doctors')
  @ApiOperation({ summary: 'Search doctors and OPD clinics in Jodhpur' })
  async getDoctors(@Query('q') query?: string, @Query('specialty') specialty?: string) {
    return this.patientsService.getDoctors(query, specialty);
  }

  @Public()
  @Get('doctors/:id')
  @ApiOperation({ summary: 'Get doctor details and live queue preview' })
  async getDoctorDetails(@Param('id') id: string) {
    return this.patientsService.getDoctorDetails(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-tokens')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get patient active and historical OPD tokens' })
  async getMyTokens(@CurrentUser('sub') patientId: string) {
    return this.patientsService.getMyTokens(patientId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('book-token')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book OPD Token for doctor session' })
  async bookToken(
    @CurrentUser('sub') patientId: string,
    @Body() body: { doctorId: string; familyMemberId?: string },
  ) {
    return this.patientsService.bookToken(patientId, body.doctorId, body.familyMemberId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('family')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get family member profile list' })
  async getFamily(@CurrentUser('sub') patientId: string) {
    return this.patientsService.getFamilyMembers(patientId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('family')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new family member to patient profile' })
  async addFamily(
    @CurrentUser('sub') patientId: string,
    @Body() body: any,
  ) {
    return this.patientsService.addFamilyMember(patientId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get patient notifications and queue alerts' })
  async getNotifications(@CurrentUser('sub') patientId: string) {
    return this.patientsService.getNotifications(patientId);
  }
}
