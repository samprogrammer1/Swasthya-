import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService, UserEntity } from '../users/users.service';
import { AuditService } from '../audit/audit.service';
import { DoctorVerificationStatus, UserRole } from '@swasthya/config';

export interface HospitalItem {
  id: string;
  name: string;
  city: string;
  address: string;
  contactNumber: string;
  departments: string[];
  doctorsCount: number;
  receptionistsCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ReviewItem {
  id: string;
  doctorName: string;
  patientName: string;
  rating: number;
  comment: string;
  categories: string[];
  status: 'PUBLISHED' | 'HIDDEN' | 'FLAGGED';
  createdAt: string;
}

@Injectable()
export class AdminService {
  private hospitals: HospitalItem[] = [
    {
      id: 'hosp_01',
      name: 'City Care Hospital Jodhpur',
      city: 'Jodhpur',
      address: 'Near Chopasni Road, Jodhpur, Rajasthan 342003',
      contactNumber: '+91-291-2645100',
      departments: ['Dermatology', 'Cardiology', 'Orthopedics', 'Pediatrics'],
      doctorsCount: 8,
      receptionistsCount: 3,
      status: 'ACTIVE',
    },
    {
      id: 'hosp_02',
      name: 'AIIMS Jodhpur Auxiliary Clinic',
      city: 'Jodhpur',
      address: 'Basni Industrial Area Phase-2, Jodhpur 342005',
      contactNumber: '+91-291-2740741',
      departments: ['Orthopedics', 'General Medicine', 'Neurology'],
      doctorsCount: 14,
      receptionistsCount: 5,
      status: 'ACTIVE',
    },
  ];

  private clinics: HospitalItem[] = [
    {
      id: 'clinic_01',
      name: 'Sharma Skin & Laser Clinic',
      city: 'Jodhpur',
      address: '12-C, Shastri Nagar, Jodhpur, Rajasthan 342001',
      contactNumber: '+91-98290-11223',
      departments: ['Dermatology', 'Cosmetology'],
      doctorsCount: 2,
      receptionistsCount: 1,
      status: 'ACTIVE',
    },
    {
      id: 'clinic_02',
      name: 'Purohit Bone Care & Fracture Clinic',
      city: 'Jodhpur',
      address: 'Paota B Road, Jodhpur 342006',
      contactNumber: '+91-98291-44556',
      departments: ['Orthopedics'],
      doctorsCount: 1,
      receptionistsCount: 1,
      status: 'ACTIVE',
    },
  ];

  private reviews: ReviewItem[] = [
    {
      id: 'rev_01',
      doctorName: 'Dr. Ananya Sharma',
      patientName: 'Sunita Agarwal',
      rating: 5,
      comment: 'Extremely good doctor! She listened to my skin allergy problem patiently and explained treatment clearly.',
      categories: ['Good Doctor', 'Listened Carefully', 'Explained Clearly'],
      status: 'PUBLISHED',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'rev_02',
      doctorName: 'Dr. Ramesh Purohit',
      patientName: 'Rajesh Verma',
      rating: 4,
      comment: 'Short waiting time at reception desk, doctor consultation was quick and effective.',
      categories: ['Short Waiting Time', 'Friendly Staff'],
      status: 'PUBLISHED',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  private platformSettings = {
    platformName: 'Swasthya+',
    cityPilot: 'Jodhpur, Rajasthan',
    maxTokensPerPatientDaily: 3,
    platformFeePercent: 5,
    autoApproveVerifiedDoctors: false,
    enableAbdmIntegration: false,
    enableNotificationsSMS: true,
    supportContactPhone: '+91-291-2600100',
    supportContactEmail: 'support@swasthya.in',
  };

  constructor(
    private readonly usersService: UsersService,
    private readonly auditService: AuditService,
  ) {}

  async getDashboardStats() {
    const allUsers = await this.usersService.findAll();

    const totalDoctors = allUsers.filter((u) => u.roles.includes(UserRole.DOCTOR)).length;
    const verifiedDoctors = allUsers.filter(
      (u) => u.doctorProfile?.status === DoctorVerificationStatus.VERIFIED,
    ).length;
    const pendingDoctors = allUsers.filter(
      (u) => u.doctorProfile?.status === DoctorVerificationStatus.PENDING,
    ).length;

    return {
      totalUsers: allUsers.length + 50,
      totalDoctors: totalDoctors + 18,
      verifiedDoctors: verifiedDoctors + 15,
      pendingDoctors: pendingDoctors + 3,
      totalHospitals: this.hospitals.length + 6,
      totalClinics: this.clinics.length + 14,
      totalReceptionists: 22,
      todayTokens: 184,
      todayConsultations: 126,
      todayRevenue: 68400,
      userGrowthData: [
        { month: 'May', count: 120 },
        { month: 'Jun', count: 240 },
        { month: 'Jul', count: 480 },
        { month: 'Aug', count: 720 },
        { month: 'Sep', count: 1150 },
      ],
      tokenVolumeData: [
        { day: 'Mon', tokens: 140 },
        { day: 'Tue', tokens: 180 },
        { day: 'Wed', tokens: 210 },
        { day: 'Thu', tokens: 165 },
        { day: 'Fri', tokens: 195 },
        { day: 'Sat', tokens: 230 },
        { day: 'Sun', tokens: 90 },
      ],
    };
  }

  async getDoctors(filter?: { status?: string; search?: string }) {
    const users = await this.usersService.findAll();
    let doctors = users.filter((u) => u.roles.includes(UserRole.DOCTOR) || u.doctorProfile);

    if (filter?.status && filter.status !== 'ALL') {
      doctors = doctors.filter((d) => d.doctorProfile?.status === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      doctors = doctors.filter(
        (d) =>
          d.fullName.toLowerCase().includes(q) ||
          d.mobile.includes(q) ||
          d.doctorProfile?.specialty.toLowerCase().includes(q) ||
          d.doctorProfile?.registrationNumber.toLowerCase().includes(q),
      );
    }

    return doctors;
  }

  async verifyDoctor(
    adminUser: { sub: string; mobile: string },
    doctorId: string,
    status: DoctorVerificationStatus,
    reason?: string,
  ) {
    const doctor = await this.usersService.findById(doctorId);
    if (!doctor || !doctor.doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    doctor.doctorProfile.status = status;
    await this.usersService.updateProfile(doctorId, doctor);

    await this.auditService.logAction(
      adminUser.sub,
      'Admin',
      'DOCTOR_VERIFY',
      'DoctorProfile',
      doctorId,
      `Changed verification status of ${doctor.fullName} to ${status}. ${reason ? 'Reason: ' + reason : ''}`,
    );

    return doctor;
  }

  async getHospitals() {
    return this.hospitals;
  }

  async createHospital(adminUser: any, data: Partial<HospitalItem>) {
    const newHospital: HospitalItem = {
      id: `hosp_${Date.now()}`,
      name: data.name || 'New Jodhpur Hospital',
      city: data.city || 'Jodhpur',
      address: data.address || 'Jodhpur, Rajasthan',
      contactNumber: data.contactNumber || '+91-291-2600000',
      departments: data.departments || ['General Medicine'],
      doctorsCount: 0,
      receptionistsCount: 0,
      status: 'ACTIVE',
    };
    this.hospitals.push(newHospital);

    await this.auditService.logAction(
      adminUser.sub,
      'Admin',
      'HOSPITAL_CREATE',
      'Hospital',
      newHospital.id,
      `Created new hospital: ${newHospital.name}`,
    );

    return newHospital;
  }

  async getClinics() {
    return this.clinics;
  }

  async getPatients(search?: string) {
    const users = await this.usersService.findAll();
    let patients = users.filter((u) => u.roles.includes(UserRole.PATIENT) || u.patientProfile);

    if (search) {
      const q = search.toLowerCase();
      patients = patients.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.mobile.includes(q) ||
          p.patientProfile?.city.toLowerCase().includes(q),
      );
    }

    return patients;
  }

  async getReviews() {
    return this.reviews;
  }

  async moderateReview(adminUser: any, reviewId: string, status: 'PUBLISHED' | 'HIDDEN' | 'FLAGGED') {
    const rev = this.reviews.find((r) => r.id === reviewId);
    if (!rev) throw new NotFoundException('Review not found');

    rev.status = status;

    await this.auditService.logAction(
      adminUser.sub,
      'Admin',
      'REVIEW_MODERATE',
      'Review',
      reviewId,
      `Changed review moderation status to ${status}`,
    );

    return rev;
  }

  async getSettings() {
    return this.platformSettings;
  }

  async updateSettings(adminUser: any, newSettings: Partial<typeof this.platformSettings>) {
    this.platformSettings = {
      ...this.platformSettings,
      ...newSettings,
    };

    await this.auditService.logAction(
      adminUser.sub,
      'Admin',
      'SETTINGS_UPDATE',
      'PlatformSettings',
      'global',
      'Updated platform configuration parameters.',
    );

    return this.platformSettings;
  }
}
