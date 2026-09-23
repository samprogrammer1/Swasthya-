import { Module } from '@nestjs/common';
import { ReceptionService } from './reception.service';
import { ReceptionController } from './reception.controller';
import { QueueModule } from '../queue/queue.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [QueueModule, UsersModule],
  providers: [ReceptionService],
  controllers: [ReceptionController],
  exports: [ReceptionService],
})
export class ReceptionModule {}
