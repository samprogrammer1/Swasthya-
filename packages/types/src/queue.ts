import { OPDSessionStatus, TokenStatus } from '@swasthya/config';

export interface IOPDSession {
  id: string;
  doctorId: string;
  doctorName: string;
  organizationName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status: OPDSessionStatus;
  currentTokenNumber: number;
  totalTokensIssued: number;
}

export interface IToken {
  id: string;
  tokenNumber: number;
  tokenCode: string;
  sessionId: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  status: TokenStatus;
  estimatedWaitMinutes: number;
  patientsAhead: number;
  createdAt: string;
}

export interface IQueueState {
  sessionId: string;
  doctorId: string;
  doctorName: string;
  sessionStatus: OPDSessionStatus;
  currentlyServingToken: number;
  nextCallingToken: number;
  totalWaiting: number;
  waitingTokens: IToken[];
}
