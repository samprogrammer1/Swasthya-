import { Injectable, NotFoundException } from '@nestjs/common';

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string; // e.g. 1-0-1, 1-1-1, 0-0-1
  duration: string;  // e.g. 5 days, 14 days
  instructions?: string; // e.g. After meals
}

export interface PrescriptionRecord {
  id: string;
  prescriptionCode: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalName: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  patientAgeGender?: string;
  chiefComplaint: string;
  observations?: string;
  diagnosis: string;
  medicines: PrescriptionItem[];
  advice?: string;
  followUpDate?: string;
  createdAt: string;
}

@Injectable()
export class PrescriptionService {
  private prescriptions: Map<string, PrescriptionRecord> = new Map();

  constructor() {
    this.seedDemoPrescription();
  }

  private seedDemoPrescription() {
    const rx: PrescriptionRecord = {
      id: 'rx_01',
      prescriptionCode: 'RX-2026-10492',
      doctorId: 'usr_doctor_01',
      doctorName: 'Dr. Ananya Sharma',
      doctorSpecialty: 'Dermatology & Cosmetology',
      hospitalName: 'City Care Hospital Jodhpur',
      patientId: 'usr_patient_01',
      patientName: 'Sunita Agarwal',
      patientMobile: '+919876543214',
      patientAgeGender: '38F',
      chiefComplaint: 'Itching and redness on forearms for 3 days after monsoon exposure.',
      observations: 'Mild erythematous plaques with superficial scaling.',
      diagnosis: 'Acute Contact Dermatitis & Allergic Reaction',
      medicines: [
        {
          medicineName: 'Tab Allegra 120mg (Fexofenadine)',
          dosage: '1 Tab',
          frequency: '0-0-1 (Night)',
          duration: '7 days',
          instructions: 'Take after dinner with water',
        },
        {
          medicineName: 'Cream Desowen 0.05% (Desonide)',
          dosage: 'Topical Application',
          frequency: '1-0-1 (Twice daily)',
          duration: '5 days',
          instructions: 'Apply thin layer on affected area only',
        },
        {
          medicineName: 'Lotion Cetaphil Moisturizing',
          dosage: 'Topical',
          frequency: 'As needed',
          duration: '14 days',
          instructions: 'Apply gently after bath',
        },
      ],
      advice: 'Avoid harsh soaps, synthetic clothes, and direct sunlight. Keep skin well hydrated.',
      followUpDate: '2026-09-28',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    };

    this.prescriptions.set(rx.id, rx);
  }

  async createPrescription(doctorId: string, data: Partial<PrescriptionRecord>): Promise<PrescriptionRecord> {
    const id = `rx_${Date.now()}`;
    const code = `RX-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRx: PrescriptionRecord = {
      id,
      prescriptionCode: code,
      doctorId,
      doctorName: data.doctorName || 'Dr. Ananya Sharma',
      doctorSpecialty: data.doctorSpecialty || 'Dermatology',
      hospitalName: data.hospitalName || 'City Care Hospital Jodhpur',
      patientId: data.patientId || 'usr_patient_01',
      patientName: data.patientName || 'Patient',
      patientMobile: data.patientMobile || '+919876543214',
      patientAgeGender: data.patientAgeGender || '38F',
      chiefComplaint: data.chiefComplaint || 'General Consultation',
      observations: data.observations || '',
      diagnosis: data.diagnosis || 'Clinical evaluation',
      medicines: data.medicines || [],
      advice: data.advice || 'Follow general healthcare precautions.',
      followUpDate: data.followUpDate || '',
      createdAt: new Date().toISOString(),
    };

    this.prescriptions.set(id, newRx);
    return newRx;
  }

  async getPrescriptionsByDoctor(doctorId: string): Promise<PrescriptionRecord[]> {
    return Array.from(this.prescriptions.values()).filter((r) => r.doctorId === doctorId);
  }

  async getPrescriptionsByPatient(patientId: string): Promise<PrescriptionRecord[]> {
    return Array.from(this.prescriptions.values()).filter((r) => r.patientId === patientId);
  }

  async getById(id: string): Promise<PrescriptionRecord> {
    const rx = this.prescriptions.get(id);
    if (!rx) throw new NotFoundException('Prescription not found');
    return rx;
  }
}
