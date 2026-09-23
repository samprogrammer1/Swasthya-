import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';

@Module({
  providers: [PrescriptionService],
  controllers: [PrescriptionController],
  exports: [PrescriptionService],
})
export class PrescriptionModule {}
