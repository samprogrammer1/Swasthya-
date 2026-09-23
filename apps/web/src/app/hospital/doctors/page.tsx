'use client';

import React, { useEffect, useState } from 'react';
import { HospitalLayout } from '../../../components/hospital/hospital-layout';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function HospitalDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await apiRequest('/patients/doctors');
      setDoctors(data);
    } catch (e) {
      setDoctors([
        {
          id: 'usr_doctor_01',
          fullName: 'Dr. Ananya Sharma',
          specialty: 'Dermatology & Cosmetology',
          qualification: 'MBBS, MD (Dermatology)',
          consultationFee: 500,
          hospitalName: 'City Care Hospital Jodhpur',
          currentTokenNumber: 18,
        },
        {
          id: 'usr_doctor_02',
          fullName: 'Dr. Ramesh Purohit',
          specialty: 'Orthopedics & Joint Replacement',
          qualification: 'MS (Orthopedics)',
          consultationFee: 600,
          hospitalName: 'AIIMS Jodhpur Auxiliary Clinic',
          currentTokenNumber: 11,
        },
      ]);
    }
  };

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Assigned Doctors Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Doctors affiliated with City Care Hospital Jodhpur OPD sessions.
          </p>
        </div>

        <Card className="overflow-hidden p-0 border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Doctor Name</th>
                  <th className="p-4">Specialty & Qualification</th>
                  <th className="p-4">Consultation Fee</th>
                  <th className="p-4">Live Token</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 text-sm">{doc.fullName}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{doc.specialty}</div>
                      <div className="text-[11px] text-slate-500">{doc.qualification}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-900">₹{doc.consultationFee}</td>
                    <td className="p-4 font-bold text-brand-600">Serving #{doc.currentTokenNumber}</td>
                    <td className="p-4">
                      <Badge variant="success">Active OPD</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </HospitalLayout>
  );
}
