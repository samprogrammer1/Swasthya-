import { Injectable, NotFoundException } from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { PrescriptionService } from '../prescriptions/prescription.service';
import { UserRole, DoctorVerificationStatus, TokenStatus } from '@swasthya/config';

export interface FamilyMemberItem {
  id: string;
  fullName: string;
  relation: 'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD';
  age: number;
  gender: string;
}

export interface PatientNotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'QUEUE_NEAR' | 'TOKEN_CALLED' | 'PRESCRIPTION_READY' | 'SYSTEM';
  createdAt: string;
  isRead: boolean;
}

@Injectable()
export class PatientsService {
  private familyMembers: Map<string, FamilyMemberItem[]> = new Map();
  private notifications: Map<string, PatientNotificationItem[]> = new Map();

  constructor(
    private readonly queueService: QueueService,
    private readonly prescriptionService: PrescriptionService,
  ) {
    this.seedDemoPatientData();
  }

  private seedDemoPatientData() {
    const patientId = 'usr_patient_01';

    this.familyMembers.set(patientId, [
      {
        id: 'fam_01',
        fullName: 'Rameshwar Agarwal',
        relation: 'FATHER',
        age: 65,
        gender: 'MALE',
      },
      {
        id: 'fam_02',
        fullName: 'Aarav Agarwal',
        relation: 'CHILD',
        age: 8,
        gender: 'MALE',
      },
    ]);

    this.notifications.set(patientId, [
      {
        id: 'notif_01',
        title: 'Token #20 is being served',
        message: 'Your token #27 is near. Please start moving towards City Care Hospital Jodhpur OPD.',
        type: 'QUEUE_NEAR',
        createdAt: new Date(Date.now() - 600000).toISOString(),
        isRead: false,
      },
      {
        id: 'notif_02',
        title: 'Prescription Digital Copy Ready',
        message: 'Dr. Ananya Sharma issued a digital Rx for your visit. Tap to download PDF.',
        type: 'PRESCRIPTION_READY',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
      },
    ]);
  }

  async getDoctors(query?: string, specialty?: string) {
    const doctors = [
      {
        id: 'usr_doctor_01',
        fullName: 'Dr. Ananya Sharma',
        specialty: 'Dermatology & Cosmetology',
        qualification: 'MBBS, MD (Dermatology)',
        experienceYears: 12,
        consultationFee: 500,
        ratingAverage: 4.9,
        ratingCount: 142,
        status: DoctorVerificationStatus.VERIFIED,
        hospitalName: 'City Care Hospital Jodhpur',
        clinicName: 'Sharma Skin Clinic Shastri Nagar',
        location: 'Shastri Nagar, Jodhpur',
        opdStatus: 'OPEN',
        currentTokenNumber: 18,
      },
      {
        id: 'usr_doctor_02',
        fullName: 'Dr. Ramesh Purohit',
        specialty: 'Orthopedics & Joint Replacement',
        qualification: 'MS (Orthopedics)',
        experienceYears: 8,
        consultationFee: 600,
        ratingAverage: 4.5,
        ratingCount: 38,
        status: DoctorVerificationStatus.VERIFIED,
        hospitalName: 'AIIMS Jodhpur Auxiliary Clinic',
        clinicName: 'Purohit Bone Care',
        location: 'Paota B Road, Jodhpur',
        opdStatus: 'OPEN',
        currentTokenNumber: 11,
      },
      {
        id: 'usr_doctor_03',
        fullName: 'Dr. Kirti Bhandari',
        specialty: 'Pediatrics & Child Care',
        qualification: 'MD (Pediatrics)',
        experienceYears: 15,
        consultationFee: 400,
        ratingAverage: 4.8,
        ratingCount: 96,
        status: DoctorVerificationStatus.VERIFIED,
        hospitalName: 'City Care Hospital Jodhpur',
        clinicName: 'Bhandari Children Clinic',
        location: 'Residency Road, Jodhpur',
        opdStatus: 'OPEN',
        currentTokenNumber: 22,
      },
    ];

    let result = doctors;
    if (specialty && specialty !== 'ALL') {
      result = result.filter((d) => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (d) =>
          d.fullName.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.hospitalName.toLowerCase().includes(q),
      );
    }

    return result;
  }

  async getDoctorDetails(doctorId: string) {
    const doctors = await this.getDoctors();
    const doc = doctors.find((d) => d.id === doctorId) || doctors[0];
    const queueState = await this.queueService.getQueueState(doctorId);

    return {
      ...doc,
      queueState,
    };
  }

  async getMyTokens(patientId: string) {
    return [
      {
        id: 'tok_27',
        tokenNumber: 27,
        tokenCode: 'SW-027',
        doctorName: 'Dr. Ananya Sharma',
        doctorSpecialty: 'Dermatology',
        hospitalName: 'City Care Hospital Jodhpur',
        status: TokenStatus.WAITING,
        currentlyServingToken: 18,
        patientsAhead: 8,
        estimatedWaitMinutes: 45,
        date: new Date().toISOString().split('T')[0],
      },
      {
        id: 'tok_12',
        tokenNumber: 12,
        tokenCode: 'SW-012',
        doctorName: 'Dr. Ramesh Purohit',
        doctorSpecialty: 'Orthopedics',
        hospitalName: 'AIIMS Jodhpur Auxiliary Clinic',
        status: TokenStatus.COMPLETED,
        currentlyServingToken: 12,
        patientsAhead: 0,
        estimatedWaitMinutes: 0,
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      },
    ];
  }

  async bookToken(patientId: string, doctorId: string, familyMemberId?: string) {
    const docDetails = await this.getDoctorDetails(doctorId);
    const myTokens = await this.getMyTokens(patientId);

    const nextTokenNumber = 27;
    const newToken = {
      id: `tok_${Date.now()}`,
      tokenNumber: nextTokenNumber,
      tokenCode: `SW-0${nextTokenNumber}`,
      doctorId,
      doctorName: docDetails.fullName,
      doctorSpecialty: docDetails.specialty,
      hospitalName: docDetails.hospitalName,
      patientId,
      patientName: 'Sunita Agarwal',
      status: TokenStatus.WAITING,
      currentlyServingToken: docDetails.queueState?.currentlyServingToken || 18,
      patientsAhead: 8,
      estimatedWaitMinutes: 45,
      date: new Date().toISOString().split('T')[0],
    };

    return newToken;
  }

  async getFamilyMembers(patientId: string) {
    return this.familyMembers.get(patientId) || [];
  }

  async addFamilyMember(patientId: string, data: Partial<FamilyMemberItem>) {
    const list = this.familyMembers.get(patientId) || [];
    const newMember: FamilyMemberItem = {
      id: `fam_${Date.now()}`,
      fullName: data.fullName || 'Family Member',
      relation: data.relation || 'SPOUSE',
      age: data.age || 30,
      gender: data.gender || 'FEMALE',
    };
    list.push(newMember);
    this.familyMembers.set(patientId, list);
    return newMember;
  }

  async getNotifications(patientId: string) {
    return this.notifications.get(patientId) || [];
  }
}
