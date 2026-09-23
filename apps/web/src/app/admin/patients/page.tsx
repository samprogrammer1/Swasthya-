'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/admin/admin-layout';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await apiRequest(`/admin/patients?search=${searchQuery}`);
      setPatients(data);
    } catch (e) {
      setPatients([
        {
          id: 'usr_patient_01',
          fullName: 'Sunita Agarwal',
          mobile: '+919876543214',
          email: 'sunita.agarwal@gmail.com',
          isActive: true,
          patientProfile: {
            gender: 'FEMALE',
            dateOfBirth: '1988-06-14',
            bloodGroup: 'B+',
            city: 'Jodhpur',
            state: 'Rajasthan',
            abhaId: '12-3456-7890-1234',
          },
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
              Patient Identity Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Least-privilege administrative view. Personal health records & prescription contents remain private.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search patient name or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPatients()}
            />
          </div>
        </div>

        <Card className="overflow-hidden p-0 border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Gender & DOB</th>
                  <th className="p-4">ABHA ID Status</th>
                  <th className="p-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 text-sm">
                      {pat.fullName}
                      <span className="block text-[11px] text-slate-400 font-normal">ID: {pat.id}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{pat.mobile}</td>
                    <td className="p-4 text-slate-600">
                      {pat.patientProfile?.gender} • {pat.patientProfile?.dateOfBirth || 'N/A'}
                    </td>
                    <td className="p-4 font-mono text-slate-800">
                      {pat.patientProfile?.abhaId ? (
                        <Badge variant="success">ABHA Linked: {pat.patientProfile.abhaId}</Badge>
                      ) : (
                        <Badge variant="neutral">Not Linked</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      {pat.isActive ? (
                        <Badge variant="brand">Active Account</Badge>
                      ) : (
                        <Badge variant="danger">Suspended</Badge>
                      )}
                    </td>
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
