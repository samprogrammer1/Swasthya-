import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AbdmService } from './abdm.service';
import { Public, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';

@ApiTags('ABDM Integration')
@Controller('api/v1/abdm')
export class AbdmController {
  constructor(private readonly abdmService: AbdmService) {}

  @Public()
  @Post('verify-abha')
  @ApiOperation({ summary: 'Verify ABHA ID address against ABDM Gateway interface' })
  async verifyAbha(@Body() body: { abhaId: string }) {
    return this.abdmService.verifyAbhaAddress(body.abhaId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-consent')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request patient health record access consent' })
  async requestConsent(
    @CurrentUser('sub') doctorId: string,
    @Body() body: { patientAbhaId: string; purpose?: 'PATIENT_CARE' | 'EMERGENCY' },
  ) {
    return this.abdmService.requestHealthRecordConsent(
      body.patientAbhaId,
      doctorId,
      body.purpose,
    );
  }

  @Public()
  @Get('consent/:id')
  @ApiOperation({ summary: 'Check health record consent status' })
  async getConsent(@Param('id') id: string) {
    return this.abdmService.getConsentStatus(id);
  }
}
