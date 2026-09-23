import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async getOverviewAnalytics() {
    return {
      averageQueueWaitTimeMinutes: 38,
      averageConsultationDurationMinutes: 6.2,
      peakOpdHours: '10:00 AM - 11:30 AM',
      patientSatisfactionScore: 4.8,
      totalTokensGeneratedMonth: 5420,
      completionRatePercent: 94.2,
      skipRatePercent: 4.1,
      cancellationRatePercent: 1.7,
      doctorVelocityHistogram: [
        { doctorName: 'Dr. Ananya Sharma', avgConsultMins: 5.8, tokensPerHour: 10 },
        { doctorName: 'Dr. Ramesh Purohit', avgConsultMins: 7.2, tokensPerHour: 8 },
        { doctorName: 'Dr. Kirti Bhandari', avgConsultMins: 6.0, tokensPerHour: 10 },
      ],
      queueLatencyByHour: [
        { hour: '09:00 AM', waitTimeMins: 12 },
        { hour: '10:00 AM', waitTimeMins: 38 },
        { hour: '11:00 AM', waitTimeMins: 45 },
        { hour: '12:00 PM', waitTimeMins: 28 },
        { hour: '01:00 PM', waitTimeMins: 10 },
      ],
    };
  }
}
