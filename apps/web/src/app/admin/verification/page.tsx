'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/admin/admin-layout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { DoctorVerificationStatus } from '@swasthya/config';
import { apiRequest } from '../../../lib/api-client';

export default function AdminVerificationPage() {
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest('/admin/doctors?status=PENDING');
      setPendingDoctors(data);
    } catch (e) {
      setPendingDoctors([
        {
          id: 'usr_doctor_02',
          fullName: 'Dr. Ramesh Purohit',
          mobile: '+919876543215',
          email: 'dr.ramesh@swasthya.in',
          doctorProfile: {
            qualification: 'MS (Orthopedics)',
            specialty: 'Orthopedics & Joint Replacement',
            experienceYears: 8,
            registrationNumber: 'RJ-MED-2018-4421',
            consultationFee: 600,
            status: DoctorVerificationStatus.PENDING,
            hospitalNames: ['AIIMS Jodhpur Auxiliary Clinic', 'Purohit Bone Care'],
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (doctorId: string, status: DoctorVerificationStatus) => {
    try {
      await apiRequest(`/admin/doctors/${doctorId}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason: 'Verified via admin verification queue' }),
      });
      fetchPending();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Doctor Verification Queue
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Verify Rajasthan Medical Council registration credentials before granting OPD publishing privileges.
            </p>
          </div>
          <Badge variant="warning" className="px-3 py-1">
            {pendingDoctors.length} Action Required
          </Badge>
        </div>

        {pendingDoctors.length === 0 ? (
          <Card className="text-center py-12 space-y-3 bg-slate-50">
            <div className="text-4xl">🎉</div>
            <h3 className="font-bold text-slate-900 text-lg">Verification Queue Clear</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All registered doctors have been reviewed and verified. New registrations will appear here automatically.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingDoctors.map((doc) => (
              <Card key={doc.id} className="border-amber-200 bg-amber-50/20 p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900">{doc.fullName}</h3>
                    <Badge variant="warning">PENDING VERIFICATION</Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">Registration No:</span>
                      <span className="font-mono font-bold text-slate-800">{doc.doctorProfile?.registrationNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Specialty:</span>
                      <span className="font-semibold text-slate-800">{doc.doctorProfile?.specialty}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Qualifications:</span>
                      <span className="font-medium text-slate-800">{doc.doctorProfile?.qualification}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Experience:</span>
                      <span className="font-medium text-slate-800">{doc.doctorProfile?.experienceYears} Years</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="font-bold text-slate-800">Associated Clinics: </span>
                    {doc.doctorProfile?.hospitalNames?.join(', ')}
                  </div>
                </div>

                <div className="flex md:flex-col justify-end gap-2 min-w-[180px]">
                  <Button
                    variant="success"
                    size="sm"
                    className="w-full"
                    onClick={() => handleVerify(doc.id, DoctorVerificationStatus.VERIFIED)}
                  >
                    ✓ Approve License
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full"
                    onClick={() => handleVerify(doc.id, DoctorVerificationStatus.REJECTED)}
                  >
                    ✕ Reject Registration
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
