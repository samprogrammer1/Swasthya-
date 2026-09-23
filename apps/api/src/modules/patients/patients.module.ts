import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { QueueModule } from '../queue/queue.module';
import { PrescriptionModule } from '../prescriptions/prescription.module';

@Module({
  imports: [QueueModule, PrescriptionModule],
  providers: [PatientsService],
  controllers: [PatientsController],
  exports: [PatientsService],
})
export class PatientsModule {}
