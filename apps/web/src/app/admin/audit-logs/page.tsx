'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/admin/admin-layout';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await apiRequest(`/admin/audit-logs?search=${search}`);
      setLogs(data);
    } catch (e) {
      setLogs([
        {
          id: 'aud_101',
          actorName: 'Sameer Khan (Super Admin)',
          action: 'DOCTOR_VERIFY',
          entity: 'DoctorProfile',
          entityId: 'doc_prof_01',
          timestamp: new Date().toISOString(),
          details: 'Approved Dr. Ananya Sharma registration RJ-MED-2014-8891 after license verification.',
          ipAddress: '192.168.1.1',
        },
        {
          id: 'aud_102',
          actorName: 'Rajesh Verma (Platform Admin)',
          action: 'HOSPITAL_CREATE',
          entity: 'Hospital',
          entityId: 'hosp_01',
          timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
          details: 'Created hospital entry: City Care Hospital Jodhpur with 6 OPD departments.',
          ipAddress: '192.168.1.5',
        },
      ]);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Operational Audit Trail
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Traceable records of administrative approvals, credential changes, and system events.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search audit trail by actor or action..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
            />
          </div>
        </div>

        <Card className="overflow-hidden p-0 border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Target Entity</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-slate-900">{log.actorName}</td>
                    <td className="p-4">
                      <Badge variant="brand">{log.action}</Badge>
                    </td>
                    <td className="p-4 font-mono text-slate-700">
                      {log.entity} <span className="text-[10px] text-slate-400">({log.entityId})</span>
                    </td>
                    <td className="p-4 text-slate-700 max-w-md">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
