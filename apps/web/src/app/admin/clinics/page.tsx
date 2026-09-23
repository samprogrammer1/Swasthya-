'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/admin/admin-layout';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<any[]>([]);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      const data = await apiRequest('/admin/clinics');
      setClinics(data);
    } catch (e) {
      setClinics([
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
      ]);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Clinic Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Private doctor OPD clinics and diagnostic consultation centers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clinics.map((cli) => (
            <Card key={cli.id} className="space-y-4 border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{cli.name}</h3>
                  <p className="text-xs text-slate-500">{cli.address}</p>
                </div>
                <Badge variant="brand">{cli.status}</Badge>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>📞 <strong>Contact:</strong> {cli.contactNumber}</div>
                <div>🩺 <strong>Doctors Attached:</strong> {cli.doctorsCount}</div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                {cli.departments.map((dept: string) => (
                  <Badge key={dept} variant="info" className="text-[10px]">
                    {dept}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
