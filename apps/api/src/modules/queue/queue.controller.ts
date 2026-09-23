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
import { QueueService } from './queue.service';
import { Roles, CurrentUser, Public } from '../../common/decorators';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { UserRole, OPDSessionStatus } from '@swasthya/config';

@ApiTags('Queue')
@Controller('api/v1/queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Public()
  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get live OPD queue state for a doctor' })
  async getQueueState(@Param('doctorId') doctorId: string) {
    return this.queueService.getQueueState(doctorId);
  }

  @Public()
  @Patch('doctor/:doctorId/status')
  @ApiOperation({ summary: 'Update OPD Session status (OPEN, PAUSED, CLOSED)' })
  async updateSessionStatus(
    @Param('doctorId') doctorId: string,
    @Body() body: { status: OPDSessionStatus },
  ) {
    return this.queueService.updateSessionStatus(doctorId, body.status);
  }

  @Public()
  @Post('doctor/:doctorId/call-next')
  @ApiOperation({ summary: 'Advance queue to next patient in line' })
  async callNextToken(@Param('doctorId') doctorId: string) {
    return this.queueService.callNextToken(doctorId);
  }

  @Public()
  @Post('doctor/:doctorId/resume/:tokenId')
  @ApiOperation({ summary: 'Resume consultation for a held patient token' })
  async resumeToken(
    @Param('doctorId') doctorId: string,
    @Param('tokenId') tokenId: string,
  ) {
    return this.queueService.resumeToken(doctorId, tokenId);
  }

  @Public()
  @Post('doctor/:doctorId/skip/:tokenId')
  @ApiOperation({ summary: 'Skip absent patient token' })
  async skipToken(
    @Param('doctorId') doctorId: string,
    @Param('tokenId') tokenId: string,
  ) {
    return this.queueService.skipToken(doctorId, tokenId);
  }

  @Public()
  @Post('doctor/:doctorId/hold/:tokenId')
  @ApiOperation({ summary: 'Put patient token on temporary hold' })
  async holdToken(
    @Param('doctorId') doctorId: string,
    @Param('tokenId') tokenId: string,
  ) {
    return this.queueService.holdToken(doctorId, tokenId);
  }

  @Public()
  @Post('doctor/:doctorId/complete/:tokenId')
  @ApiOperation({ summary: 'Complete consultation for patient token' })
  async completeToken(
    @Param('doctorId') doctorId: string,
    @Param('tokenId') tokenId: string,
  ) {
    return this.queueService.completeToken(doctorId, tokenId);
  }

  @Public()
  @Post('doctor/:doctorId/emergency')
  @ApiOperation({ summary: 'Insert emergency walk-in token at front of queue' })
  async addEmergencyToken(
    @Param('doctorId') doctorId: string,
    @Body() body: { patientName: string; patientMobile: string },
  ) {
    return this.queueService.addEmergencyToken(doctorId, body.patientName, body.patientMobile);
  }
}
