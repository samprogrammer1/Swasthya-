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
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user notification feed' })
  async getMyNotifications(@CurrentUser('sub') userId: string) {
    return this.notificationsService.getByUser(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark single notification as read' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Post('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read for current user' })
  async markAllAsRead(@CurrentUser('sub') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Post('dispatch-test')
  @ApiOperation({ summary: 'Dispatch test notification event' })
  async dispatchTest(
    @CurrentUser('sub') userId: string,
    @Body()
    body: {
      event: 'TOKEN_CREATED' | 'TOKEN_NEAR' | 'TOKEN_CALLED' | 'PRESCRIPTION_CREATED';
      title: string;
      message: string;
      channel?: 'IN_APP' | 'SMS' | 'PUSH' | 'EMAIL';
    },
  ) {
    return this.notificationsService.createNotification(
      userId,
      '+919876543214',
      body.event,
      body.title,
      body.message,
      body.channel || 'IN_APP',
    );
  }
}
