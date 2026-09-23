import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AuditModule } from './modules/audit/audit.module';
import { AdminModule } from './modules/admin/admin.module';
import { QueueModule } from './modules/queue/queue.module';
import { PrescriptionModule } from './modules/prescriptions/prescription.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { ReceptionModule } from './modules/reception/reception.module';
import { PatientsModule } from './modules/patients/patients.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AbdmModule } from './modules/abdm/abdm.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { JwtAuthGuard, RolesGuard, PermissionsGuard } from './common/guards';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    AuthModule,
    UsersModule,
    AuditModule,
    AdminModule,
    QueueModule,
    PrescriptionModule,
    DoctorsModule,
    ReceptionModule,
    PatientsModule,
    OrganizationsModule,
    NotificationsModule,
    AbdmModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
