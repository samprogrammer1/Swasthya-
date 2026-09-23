import { UserRole, DoctorVerificationStatus } from '@swasthya/config';

export interface IUser {
  id: string;
  mobile: string;
  email?: string;
  fullName: string;
  roles: UserRole[];
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPatientProfile {
  id: string;
  userId: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  abhaId?: string;
  emergencyContact?: string;
}

export interface IDoctorProfile {
  id: string;
  userId: string;
  qualification: string;
  specialty: string;
  experienceYears: number;
  registrationNumber: string;
  consultationFee: number;
  bio?: string;
  status: DoctorVerificationStatus;
  ratingAverage: number;
  ratingCount: number;
  hospitalNames?: string[];
  clinicNames?: string[];
}

export interface IReceptionistProfile {
  id: string;
  userId: string;
  organizationId: string;
  organizationName: string;
  isAssigned: boolean;
}
