import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { OPDSessionStatus, TokenStatus } from '@swasthya/config';
import { IOPDSession, IToken, IQueueState } from '@swasthya/types';
import { QueueGateway } from './queue.gateway';

@Injectable()
export class QueueService {
  private sessions: Map<string, IOPDSession> = new Map();
  private tokens: Map<string, IToken[]> = new Map();

  constructor(
    @Inject(forwardRef(() => QueueGateway))
    private readonly queueGateway: QueueGateway,
  ) {
    this.seedDemoSession();
  }

  private seedDemoSession() {
    const doctorId = 'usr_doctor_01';
    const sessionId = 'session_doc_01_today';

    const session: IOPDSession = {
      id: sessionId,
      doctorId,
      doctorName: 'Dr. Ananya Sharma',
      organizationName: 'City Care Hospital Jodhpur',
      sessionDate: new Date().toISOString().split('T')[0],
      startTime: '09:00 AM',
      endTime: '01:00 PM',
      status: OPDSessionStatus.OPEN,
      currentTokenNumber: 18,
      totalTokensIssued: 21,
    };

    const initialTokens: IToken[] = [
      {
        id: 'tok_18',
        tokenNumber: 18,
        tokenCode: 'SW-018',
        sessionId,
        patientId: 'usr_patient_01',
        patientName: 'Sunita Agarwal',
        patientMobile: '+919876543214',
        status: TokenStatus.IN_CONSULTATION,
        estimatedWaitMinutes: 0,
        patientsAhead: 0,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'tok_19',
        tokenNumber: 19,
        tokenCode: 'SW-019',
        sessionId,
        patientId: 'usr_pat_02',
        patientName: 'Mukesh Sharma',
        patientMobile: '+919829011111',
        status: TokenStatus.WAITING,
        estimatedWaitMinutes: 5,
        patientsAhead: 1,
        createdAt: new Date(Date.now() - 3000000).toISOString(),
      },
      {
        id: 'tok_20',
        tokenNumber: 20,
        tokenCode: 'SW-020',
        sessionId,
        patientId: 'usr_pat_03',
        patientName: 'Pooja Bishnoi',
        patientMobile: '+919829022222',
        status: TokenStatus.WAITING,
        estimatedWaitMinutes: 12,
        patientsAhead: 2,
        createdAt: new Date(Date.now() - 2400000).toISOString(),
      },
      {
        id: 'tok_21',
        tokenNumber: 21,
        tokenCode: 'SW-021',
        sessionId,
        patientId: 'usr_pat_04',
        patientName: 'Vikram Gehlot',
        patientMobile: '+919829033333',
        status: TokenStatus.WAITING,
        estimatedWaitMinutes: 18,
        patientsAhead: 3,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ];

    this.sessions.set(doctorId, session);
    this.tokens.set(sessionId, initialTokens);
  }

  async getQueueState(doctorId: string): Promise<IQueueState> {
    const session = this.sessions.get(doctorId);
    if (!session) {
      throw new NotFoundException('No active OPD session found for this doctor');
    }

    const sessionTokens = this.tokens.get(session.id) || [];
    const waitingTokens = sessionTokens.filter(
      (t) => t.status === TokenStatus.WAITING || t.status === TokenStatus.CALLED,
    );

    const currentlyServing = sessionTokens.find((t) => t.status === TokenStatus.IN_CONSULTATION);
    const nextToken = waitingTokens[0];

    return {
      sessionId: session.id,
      doctorId,
      doctorName: session.doctorName,
      sessionStatus: session.status,
      currentlyServingToken: currentlyServing ? currentlyServing.tokenNumber : session.currentTokenNumber,
      nextCallingToken: nextToken ? nextToken.tokenNumber : session.currentTokenNumber + 1,
      totalWaiting: waitingTokens.length,
      waitingTokens: sessionTokens,
    };
  }

  async updateSessionStatus(doctorId: string, status: OPDSessionStatus): Promise<IOPDSession> {
    const session = this.sessions.get(doctorId);
    if (!session) throw new NotFoundException('Session not found');

    session.status = status;
    this.sessions.set(doctorId, session);

    const state = await this.getQueueState(doctorId);
    this.queueGateway.broadcastQueueUpdate(doctorId, 'QUEUE_UPDATED', state);

    return session;
  }

  async callNextToken(doctorId: string): Promise<IToken> {
    let session = this.sessions.get(doctorId);
    if (!session) {
      this.seedDemoSession();
      session = this.sessions.get(doctorId)!;
    }

    const sessionTokens = this.tokens.get(session.id) || [];

    // Mark current serving as COMPLETED
    const currentServing = sessionTokens.find((t) => t.status === TokenStatus.IN_CONSULTATION);
    if (currentServing) {
      currentServing.status = TokenStatus.COMPLETED;
    }

    // Find next waiting token
    const nextToken = sessionTokens.find(
      (t) => t.status === TokenStatus.WAITING || t.status === TokenStatus.CALLED,
    );

    // Strictly require a real token! No fake patient creation.
    if (!nextToken) {
      throw new BadRequestException('No patients currently waiting in queue');
    }

    nextToken.status = TokenStatus.IN_CONSULTATION;
    session.currentTokenNumber = nextToken.tokenNumber;
    this.recalculateWaitTimes(session.id);

    const state = await this.getQueueState(doctorId);
    this.queueGateway.broadcastQueueUpdate(doctorId, 'TOKEN_CALLED', {
      tokenNumber: nextToken.tokenNumber,
      patientName: nextToken.patientName,
      queueState: state,
    });
    this.queueGateway.broadcastQueueUpdate(doctorId, 'QUEUE_UPDATED', state);

    return nextToken;
  }

  async resumeToken(doctorId: string, tokenId: string): Promise<IToken> {
    let session = this.sessions.get(doctorId);
    if (!session) {
      this.seedDemoSession();
      session = this.sessions.get(doctorId)!;
    }

    const sessionTokens = this.tokens.get(session.id) || [];
    const token = sessionTokens.find((t) => t.id === tokenId);
    if (!token) throw new NotFoundException('Token not found');

    const currentServing = sessionTokens.find((t) => t.status === TokenStatus.IN_CONSULTATION);
    if (currentServing && currentServing.id !== tokenId) {
      currentServing.status = TokenStatus.COMPLETED;
    }

    token.status = TokenStatus.IN_CONSULTATION;
    session.currentTokenNumber = token.tokenNumber;

    this.recalculateWaitTimes(session.id);

    const state = await this.getQueueState(doctorId);
    this.queueGateway.broadcastQueueUpdate(doctorId, 'TOKEN_CALLED', {
      tokenNumber: token.tokenNumber,
      patientName: token.patientName,
      queueState: state,
    });
    this.queueGateway.broadcastQueueUpdate(doctorId, 'QUEUE_UPDATED', state);

    return token;
  }

  async skipToken(doctorId: string, tokenId: string): Promise<IToken> {
    let session = this.sessions.get(doctorId);
    if (!session) {
      this.seedDemoSession();
      session = this.sessions.get(doctorId)!;
    }

    const sessionTokens = this.tokens.get(session.id) || [];
    const token = sessionTokens.find((t) => t.id === tokenId);
    if (!token) throw new NotFoundException('Token not found');

    token.status = TokenStatus.SKIPPED;
    this.recalculateWaitTimes(session.id);

    const state = await this.getQueueState(doctorId);
    this.queueGateway.broadcastQueueUpdate(doctorId, 'QUEUE_UPDATED', state);

    return token;
  }

  async holdToken(doctorId: string, tokenId: string): Promise<IToken> {
    let session = this.sessions.get(doctorId);
    if (!session) {
      this.seedDemoSession();
      session = this.sessions.get(doctorId)!;
    }

    const sessionTokens = this.tokens.get(session.id) || [];
    const token = sessionTokens.find((t) => t.id === tokenId);
    if (!token) throw new NotFoundException('Token not found');

    token.status = TokenStatus.SKIPPED;
    const state = await this.getQueueState(doctorId);
    this.queueGateway.broadcastQueueUpdate(doctorId, 'QUEUE_UPDATED', state);
    return token;
  }

  async completeToken(doctorId: string, tokenId: string): Promise<IToken> {
    let session = this.sessions.get(doctorId);
    if (!session) {
      this.seedDemoSession();
      session = this.sessions.get(doctorId)!;
    }

    const sessionTokens = this.tokens.get(session.id) || [];
    const token = sessionTokens.find((t) => t.id === tokenId);
    if (!token) throw new NotFoundException('Token not found');

    token.status = TokenStatus.COMPLETED;
    const state = await this.getQueueState(doctorId);
    this.queueGateway.broadcastQueueUpdate(doctorId, 'QUEUE_UPDATED', state);
    return token;
  }

  async addEmergencyToken(doctorId: string, patientName: string, patientMobile: string): Promise<IToken> {
    let session = this.sessions.get(doctorId);
    if (!session) {
      this.seedDemoSession();
      session = this.sessions.get(doctorId)!;
    }

    const sessionTokens = this.tokens.get(session.id) || [];
    session.totalTokensIssued += 1;
    const newTokenNumber = session.totalTokensIssued;

    const emergencyToken: IToken = {
      id: `tok_em_${Date.now()}`,
      tokenNumber: newTokenNumber,
      tokenCode: `EM-${newTokenNumber}`,
      sessionId: session.id,
      patientId: `pat_em_${Date.now()}`,
      patientName: `[EMERGENCY] ${patientName}`,
      patientMobile,
      status: TokenStatus.WAITING,
      estimatedWaitMinutes: 0,
      patientsAhead: 0,
      createdAt: new Date().toISOString(),
    };

    sessionTokens.unshift(emergencyToken);
    this.recalculateWaitTimes(session.id);

    const state = await this.getQueueState(doctorId);
    this.queueGateway.broadcastQueueUpdate(doctorId, 'QUEUE_UPDATED', state);

    return emergencyToken;
  }

  private recalculateWaitTimes(sessionId: string) {
    const sessionTokens = this.tokens.get(sessionId) || [];
    let aheadCount = 0;

    sessionTokens.forEach((t) => {
      if (t.status === TokenStatus.WAITING) {
        t.patientsAhead = aheadCount;
        t.estimatedWaitMinutes = aheadCount * 6;
        aheadCount++;
      }
    });
  }
}
