import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Basic health check endpoint' })
  checkHealth() {
    return {
      status: 'ok',
      service: 'Swasthya+ API Platform',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  @Public()
  @Get('api/v1/health')
  @ApiOperation({ summary: 'API v1 health check endpoint' })
  checkV1Health() {
    return {
      status: 'ok',
      version: 'v1',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      database: 'connected (mock/in-memory seed ready)',
      redis: 'ready',
    };
  }
}
