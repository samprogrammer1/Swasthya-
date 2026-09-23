import { Injectable } from '@nestjs/common';

export interface AuditLogItem {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  private logs: AuditLogItem[] = [
    {
      id: 'aud_101',
      actorId: 'usr_super_admin_01',
      actorName: 'Sameer Khan (Super Admin)',
      action: 'DOCTOR_VERIFY',
      entity: 'DoctorProfile',
      entityId: 'doc_prof_01',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      details: 'Approved Dr. Ananya Sharma registration RJ-MED-2014-8891 after license verification.',
      ipAddress: '192.168.1.1',
    },
    {
      id: 'aud_102',
      actorId: 'usr_admin_01',
      actorName: 'Rajesh Verma (Platform Admin)',
      action: 'HOSPITAL_CREATE',
      entity: 'Hospital',
      entityId: 'hosp_01',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      details: 'Created hospital entry: City Care Hospital Jodhpur with 6 OPD departments.',
      ipAddress: '192.168.1.5',
    },
  ];

  async logAction(
    actorId: string,
    actorName: string,
    action: string,
    entity: string,
    entityId: string,
    details?: string,
  ): Promise<AuditLogItem> {
    const log: AuditLogItem = {
      id: `aud_${Date.now()}`,
      actorId,
      actorName,
      action,
      entity,
      entityId,
      timestamp: new Date().toISOString(),
      details,
    };
    this.logs.unshift(log);
    return log;
  }

  async getLogs(filter?: { search?: string; entity?: string }): Promise<AuditLogItem[]> {
    let result = [...this.logs];
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.actorName.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.entity.toLowerCase().includes(q) ||
          l.details?.toLowerCase().includes(q),
      );
    }
    return result;
  }
}
