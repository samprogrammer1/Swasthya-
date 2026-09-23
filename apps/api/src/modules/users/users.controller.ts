import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get currently authenticated user profile' })
  async getMyProfile(@CurrentUser('sub') userId: string) {
    const user = await this.usersService.findById(userId);
    return user;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update currently authenticated user profile' })
  async updateMyProfile(
    @CurrentUser('sub') userId: string,
    @Body() updateDto: { fullName?: string; email?: string },
  ) {
    const updated = await this.usersService.updateProfile(userId, updateDto);
    return updated;
  }
}
