import { DoctorVerificationStatus } from '@swasthya/config';

export interface IDoctorFilter {
  specialty?: string;
  city?: string;
  status?: DoctorVerificationStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IVerifyDoctorDto {
  status: DoctorVerificationStatus;
  rejectionReason?: string;
}
