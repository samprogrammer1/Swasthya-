import { Injectable, NotFoundException } from '@nestjs/common';

export interface DoctorSchedule {
  doctorId: string;
  opdDays: string[];
  opdStartTime: string;
  opdEndTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
  tokenCapacityPerSession: number;
  consultationFee: number;
  isEmergencyClosure: boolean;
}

export interface DoctorReceptionistItem {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  assignedClinic: string;
  isAssigned: boolean;
  createdAt: string;
}

@Injectable()
export class DoctorsService {
  private schedules: Map<string, DoctorSchedule> = new Map();
  private receptionists: Map<string, DoctorReceptionistItem[]> = new Map();

  constructor() {
    this.seedDemoDoctorData();
  }

  private seedDemoDoctorData() {
    const doctorId = 'usr_doctor_01';

    this.schedules.set(doctorId, {
      doctorId,
      opdDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opdStartTime: '09:00 AM',
      opdEndTime: '01:00 PM',
      breakStartTime: '11:00 AM',
      breakEndTime: '11:15 AM',
      tokenCapacityPerSession: 40,
      consultationFee: 500,
      isEmergencyClosure: false,
    });

    this.receptionists.set(doctorId, [
      {
        id: 'usr_reception_01',
        fullName: 'Vikram Singh',
        mobile: '+919876543213',
        email: 'reception.citycare@swasthya.in',
        assignedClinic: 'City Care Hospital Jodhpur OPD Desk 2',
        isAssigned: true,
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
    ]);
  }

  async getSchedule(doctorId: string): Promise<DoctorSchedule> {
    const schedule = this.schedules.get(doctorId);
    if (!schedule) {
      // Default template if missing
      return {
        doctorId,
        opdDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opdStartTime: '09:00 AM',
        opdEndTime: '01:00 PM',
        tokenCapacityPerSession: 35,
        consultationFee: 500,
        isEmergencyClosure: false,
      };
    }
    return schedule;
  }

  async updateSchedule(doctorId: string, newSchedule: Partial<DoctorSchedule>): Promise<DoctorSchedule> {
    const current = await this.getSchedule(doctorId);
    const updated = {
      ...current,
      ...newSchedule,
    };
    this.schedules.set(doctorId, updated);
    return updated;
  }

  async getReceptionists(doctorId: string): Promise<DoctorReceptionistItem[]> {
    return this.receptionists.get(doctorId) || [];
  }

  async addReceptionist(doctorId: string, data: { fullName: string; mobile: string; email?: string; assignedClinic?: string }) {
    const doctorRecs = this.receptionists.get(doctorId) || [];

    const newRec: DoctorReceptionistItem = {
      id: `usr_rec_${Date.now()}`,
      fullName: data.fullName,
      mobile: data.mobile,
      email: data.email || `receptionist.${Date.now()}@swasthya.in`,
      assignedClinic: data.assignedClinic || 'City Care Hospital OPD Desk',
      isAssigned: true,
      createdAt: new Date().toISOString(),
    };

    doctorRecs.push(newRec);
    this.receptionists.set(doctorId, doctorRecs);
    return newRec;
  }

  async toggleReceptionistStatus(doctorId: string, receptionistId: string, isAssigned: boolean) {
    const doctorRecs = this.receptionists.get(doctorId) || [];
    const rec = doctorRecs.find((r) => r.id === receptionistId);
    if (!rec) throw new NotFoundException('Receptionist not found');

    rec.isAssigned = isAssigned;
    return rec;
  }
}
