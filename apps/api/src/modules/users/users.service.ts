import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRole, DoctorVerificationStatus } from '@swasthya/config';
import { IUser, IPatientProfile, IDoctorProfile, IReceptionistProfile } from '@swasthya/types';

export interface UserEntity extends IUser {
  passwordHash?: string;
  patientProfile?: IPatientProfile;
  doctorProfile?: IDoctorProfile;
  receptionistProfile?: IReceptionistProfile;
}

@Injectable()
export class UsersService {
  private users: Map<string, UserEntity> = new Map();

  constructor() {
    this.seedInitialUsers();
  }

  private seedInitialUsers() {
    // 1. Super Admin
    const superAdmin: UserEntity = {
      id: 'usr_super_admin_01',
      mobile: '+919876543210',
      email: 'superadmin@swasthya.in',
      fullName: 'Sameer Khan (Super Admin)',
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 2. Platform Admin
    const admin: UserEntity = {
      id: 'usr_admin_01',
      mobile: '+919876543211',
      email: 'admin.jodhpur@swasthya.in',
      fullName: 'Rajesh Verma (Platform Admin)',
      roles: [UserRole.ADMIN],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 3. Doctor (Verified)
    const doctor1: UserEntity = {
      id: 'usr_doctor_01',
      mobile: '+919876543212',
      email: 'dr.ananya@swasthya.in',
      fullName: 'Dr. Ananya Sharma',
      roles: [UserRole.DOCTOR],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      doctorProfile: {
        id: 'doc_prof_01',
        userId: 'usr_doctor_01',
        qualification: 'MBBS, MD (Dermatology)',
        specialty: 'Dermatology & Cosmetology',
        experienceYears: 12,
        registrationNumber: 'RJ-MED-2014-8891',
        consultationFee: 500,
        bio: 'Senior Dermatologist specializing in laser treatments, acne care, and skin allergies at Jodhpur City Care Clinic.',
        status: DoctorVerificationStatus.VERIFIED,
        ratingAverage: 4.9,
        ratingCount: 142,
        hospitalNames: ['City Care Hospital Jodhpur', 'Sharma Skin Clinic'],
        clinicNames: ['Sharma Skin Clinic Shastri Nagar'],
      },
    };

    // 4. Doctor (Pending Verification)
    const doctor2: UserEntity = {
      id: 'usr_doctor_02',
      mobile: '+919876543215',
      email: 'dr.ramesh@swasthya.in',
      fullName: 'Dr. Ramesh Purohit',
      roles: [UserRole.DOCTOR],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      doctorProfile: {
        id: 'doc_prof_02',
        userId: 'usr_doctor_02',
        qualification: 'MS (Orthopedics)',
        specialty: 'Orthopedics & Joint Replacement',
        experienceYears: 8,
        registrationNumber: 'RJ-MED-2018-4421',
        consultationFee: 600,
        bio: 'Orthopedic specialist for joint pains, fractures, and sports injuries.',
        status: DoctorVerificationStatus.PENDING,
        ratingAverage: 4.5,
        ratingCount: 18,
        hospitalNames: ['AIIMS Jodhpur Auxiliary Clinic'],
        clinicNames: ['Purohit Bone Care'],
      },
    };

    // 5. Receptionist
    const receptionist: UserEntity = {
      id: 'usr_reception_01',
      mobile: '+919876543213',
      email: 'reception.citycare@swasthya.in',
      fullName: 'Vikram Singh',
      roles: [UserRole.RECEPTIONIST],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      receptionistProfile: {
        id: 'rec_prof_01',
        userId: 'usr_reception_01',
        organizationId: 'org_city_care_jodhpur',
        organizationName: 'City Care Hospital Jodhpur',
        isAssigned: true,
      },
    };

    // 6. Patient
    const patient: UserEntity = {
      id: 'usr_patient_01',
      mobile: '+919876543214',
      email: 'sunita.agarwal@gmail.com',
      fullName: 'Sunita Agarwal',
      roles: [UserRole.PATIENT],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patientProfile: {
        id: 'pat_prof_01',
        userId: 'usr_patient_01',
        gender: 'FEMALE',
        dateOfBirth: '1988-06-14',
        bloodGroup: 'B+',
        address: '14, Ratanada Road',
        city: 'Jodhpur',
        state: 'Rajasthan',
        pincode: '342001',
        abhaId: '12-3456-7890-1234',
        emergencyContact: '+919876500000',
      },
    };

    [superAdmin, admin, doctor1, doctor2, receptionist, patient].forEach((u) => {
      this.users.set(u.id, u);
      this.users.set(u.mobile, u); // map mobile as well for fast lookup
    });
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    return this.users.get(id);
  }

  async findByMobile(mobile: string): Promise<UserEntity | undefined> {
    return this.users.get(mobile);
  }

  async findAll(): Promise<UserEntity[]> {
    const unique = new Map<string, UserEntity>();
    this.users.forEach((user) => unique.set(user.id, user));
    return Array.from(unique.values());
  }

  async createPatientUser(mobile: string, fullName: string): Promise<UserEntity> {
    const existing = await this.findByMobile(mobile);
    if (existing) {
      throw new ConflictException('User with this mobile already exists');
    }

    const id = `usr_pat_${Date.now()}`;
    const newUser: UserEntity = {
      id,
      mobile,
      fullName: fullName || 'Patient ' + mobile.slice(-4),
      roles: [UserRole.PATIENT],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      patientProfile: {
        id: `pat_prof_${Date.now()}`,
        userId: id,
        gender: 'OTHER',
        city: 'Jodhpur',
        state: 'Rajasthan',
      },
    };

    this.users.set(id, newUser);
    this.users.set(mobile, newUser);
    return newUser;
  }

  async updateProfile(id: string, updateData: Partial<IUser>): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updated = {
      ...user,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    this.users.set(user.id, updated);
    this.users.set(user.mobile, updated);
    return updated;
  }
}
