import { Injectable, NotFoundException } from '@nestjs/common';

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  headDoctorName: string;
  doctorsCount: number;
  opdDeskCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface OrganizationDetails {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'CLINIC';
  city: string;
  address: string;
  contactNumber: string;
  activeDoctorsCount: number;
  activeReceptionistsCount: number;
  todayTokensCount: number;
  departments: DepartmentItem[];
}

@Injectable()
export class OrganizationsService {
  private organizations: Map<string, OrganizationDetails> = new Map();
  private doctorOrganizations: Map<string, string[]> = new Map(); // doctorId -> orgIds[]

  constructor() {
    this.seedDemoData();
  }

  private seedDemoData() {
    const cityCareHosp: OrganizationDetails = {
      id: 'org_city_care_jodhpur',
      name: 'City Care Hospital Jodhpur',
      type: 'HOSPITAL',
      city: 'Jodhpur',
      address: 'Near Chopasni Road, Jodhpur, Rajasthan 342003',
      contactNumber: '+91-291-2645100',
      activeDoctorsCount: 8,
      activeReceptionistsCount: 3,
      todayTokensCount: 184,
      departments: [
        {
          id: 'dept_derm',
          name: 'Dermatology & Cosmetology',
          code: 'DERM',
          headDoctorName: 'Dr. Ananya Sharma',
          doctorsCount: 2,
          opdDeskCount: 2,
          status: 'ACTIVE',
        },
        {
          id: 'dept_ortho',
          name: 'Orthopedics & Joint Care',
          code: 'ORTHO',
          headDoctorName: 'Dr. Ramesh Purohit',
          doctorsCount: 3,
          opdDeskCount: 2,
          status: 'ACTIVE',
        },
        {
          id: 'dept_peds',
          name: 'Pediatrics & Child Health',
          code: 'PEDS',
          headDoctorName: 'Dr. Kirti Bhandari',
          doctorsCount: 2,
          opdDeskCount: 1,
          status: 'ACTIVE',
        },
      ],
    };

    const sharmaClinic: OrganizationDetails = {
      id: 'org_sharma_clinic',
      name: 'Sharma Skin & Laser Clinic',
      type: 'CLINIC',
      city: 'Jodhpur',
      address: '12-C, Shastri Nagar, Jodhpur 342001',
      contactNumber: '+91-98290-11223',
      activeDoctorsCount: 2,
      activeReceptionistsCount: 1,
      todayTokensCount: 45,
      departments: [
        {
          id: 'dept_derm_private',
          name: 'Dermatology OPD',
          code: 'SKIN',
          headDoctorName: 'Dr. Ananya Sharma',
          doctorsCount: 2,
          opdDeskCount: 1,
          status: 'ACTIVE',
        },
      ],
    };

    this.organizations.set(cityCareHosp.id, cityCareHosp);
    this.organizations.set(sharmaClinic.id, sharmaClinic);

    // Dr. Ananya Sharma belongs to BOTH City Care Hospital and Sharma Skin Clinic!
    this.doctorOrganizations.set('usr_doctor_01', ['org_city_care_jodhpur', 'org_sharma_clinic']);
    this.doctorOrganizations.set('usr_doctor_02', ['org_city_care_jodhpur']);
  }

  async getOrganization(id: string): Promise<OrganizationDetails> {
    const org = this.organizations.get(id);
    if (!org) {
      // Default to City Care Hospital
      return this.organizations.get('org_city_care_jodhpur')!;
    }
    return org;
  }

  async getDoctorOrganizations(doctorId: string): Promise<OrganizationDetails[]> {
    const orgIds = this.doctorOrganizations.get(doctorId) || ['org_city_care_jodhpur'];
    return orgIds.map((id) => this.organizations.get(id)!).filter(Boolean);
  }

  async addDepartment(orgId: string, name: string, code: string, headDoctorName: string): Promise<DepartmentItem> {
    const org = await this.getOrganization(orgId);
    const newDept: DepartmentItem = {
      id: `dept_${Date.now()}`,
      name,
      code: code || name.slice(0, 4).toUpperCase(),
      headDoctorName: headDoctorName || 'Chief Consultant',
      doctorsCount: 1,
      opdDeskCount: 1,
      status: 'ACTIVE',
    };
    org.departments.push(newDept);
    this.organizations.set(org.id, org);
    return newDept;
  }
}
