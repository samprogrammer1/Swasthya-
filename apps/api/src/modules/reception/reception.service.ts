import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { UsersService } from '../users/users.service';
import { TokenStatus } from '@swasthya/config';
import { IToken } from '@swasthya/types';

export interface ReceptionPaymentRecord {
  id: string;
  tokenId: string;
  tokenNumber: number;
  patientName: string;
  patientMobile: string;
  doctorName: string;
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD';
  status: 'SUCCESS' | 'PENDING';
  createdAt: string;
}

@Injectable()
export class ReceptionService {
  private paymentRecords: ReceptionPaymentRecord[] = [
    {
      id: 'pay_01',
      tokenId: 'tok_18',
      tokenNumber: 18,
      patientName: 'Sunita Agarwal',
      patientMobile: '+919876543214',
      doctorName: 'Dr. Ananya Sharma',
      amount: 500,
      paymentMethod: 'UPI',
      status: 'SUCCESS',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'pay_02',
      tokenId: 'tok_19',
      tokenNumber: 19,
      patientName: 'Mukesh Sharma',
      patientMobile: '+919829011111',
      doctorName: 'Dr. Ananya Sharma',
      amount: 500,
      paymentMethod: 'CASH',
      status: 'SUCCESS',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  constructor(
    private readonly queueService: QueueService,
    private readonly usersService: UsersService,
  ) {}

  async searchPatient(query: string) {
    return this.usersService.findAll().then((users) =>
      users.filter(
        (u) =>
          u.mobile.includes(query) ||
          u.fullName.toLowerCase().includes(query.toLowerCase()) ||
          u.id.includes(query),
      ),
    );
  }

  async createWalkInPatient(data: { fullName: string; mobile: string; gender?: string; city?: string }) {
    return this.usersService.createPatientUser(data.mobile, data.fullName);
  }

  async generateToken(data: {
    doctorId: string;
    patientId: string;
    patientName: string;
    patientMobile: string;
    visitType: 'NEW' | 'FOLLOWUP';
    amount: number;
    paymentMethod: 'CASH' | 'UPI' | 'CARD';
  }): Promise<{ token: IToken; payment: ReceptionPaymentRecord }> {
    const doctorId = data.doctorId || 'usr_doctor_01';

    // Get live queue state to calculate next token number
    const queueState = await this.queueService.getQueueState(doctorId);
    const sessionTokens = queueState.waitingTokens;

    const nextTokenNumber = sessionTokens.length + 18; // Next sequential token
    const tokenId = `tok_${Date.now()}`;

    const generatedToken: IToken = {
      id: tokenId,
      tokenNumber: nextTokenNumber,
      tokenCode: `SW-0${nextTokenNumber}`,
      sessionId: queueState.sessionId,
      patientId: data.patientId,
      patientName: data.patientName,
      patientMobile: data.patientMobile,
      status: TokenStatus.WAITING,
      estimatedWaitMinutes: (sessionTokens.length + 1) * 6,
      patientsAhead: sessionTokens.length,
      createdAt: new Date().toISOString(),
    };

    sessionTokens.push(generatedToken);

    // Record payment receipt
    const payment: ReceptionPaymentRecord = {
      id: `pay_${Date.now()}`,
      tokenId,
      tokenNumber: nextTokenNumber,
      patientName: data.patientName,
      patientMobile: data.patientMobile,
      doctorName: queueState.doctorName,
      amount: data.amount || 500,
      paymentMethod: data.paymentMethod || 'CASH',
      status: 'SUCCESS',
      createdAt: new Date().toISOString(),
    };

    this.paymentRecords.unshift(payment);

    return {
      token: generatedToken,
      payment,
    };
  }

  async getPaymentRegister(): Promise<ReceptionPaymentRecord[]> {
    return this.paymentRecords;
  }

  async getReceptionReports() {
    const totalPayments = this.paymentRecords.reduce((acc, p) => acc + p.amount, 0);
    const cashTotal = this.paymentRecords.filter((p) => p.paymentMethod === 'CASH').reduce((acc, p) => acc + p.amount, 0);
    const upiTotal = this.paymentRecords.filter((p) => p.paymentMethod === 'UPI').reduce((acc, p) => acc + p.amount, 0);
    const cardTotal = this.paymentRecords.filter((p) => p.paymentMethod === 'CARD').reduce((acc, p) => acc + p.amount, 0);

    return {
      totalTokensIssued: 27,
      walkInTokens: 18,
      onlineTokens: 9,
      completedTokens: 17,
      cancelledTokens: 1,
      totalRevenue: totalPayments + 12500,
      breakdown: {
        cash: cashTotal + 8000,
        upi: upiTotal + 4500,
        card: cardTotal,
      },
    };
  }
}
