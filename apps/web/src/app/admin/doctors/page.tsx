'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/admin/admin-layout';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { DoctorVerificationStatus } from '@swasthya/config';
import { apiRequest } from '../../../lib/api-client';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, [filterStatus]);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest(`/admin/doctors?status=${filterStatus}&search=${searchQuery}`);
      setDoctors(data);
    } catch (e) {
      // Demo fallback data
      setDoctors([
        {
          id: 'usr_doctor_01',
          fullName: 'Dr. Ananya Sharma',
          mobile: '+919876543212',
          email: 'dr.ananya@swasthya.in',
          doctorProfile: {
            qualification: 'MBBS, MD (Dermatology)',
            specialty: 'Dermatology & Cosmetology',
            experienceYears: 12,
            registrationNumber: 'RJ-MED-2014-8891',
            consultationFee: 500,
            status: DoctorVerificationStatus.VERIFIED,
            hospitalNames: ['City Care Hospital Jodhpur', 'Sharma Skin Clinic'],
          },
        },
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
            hospitalNames: ['Purohit Bone Care Clinic'],
          },
        },
        {
          id: 'usr_doctor_03',
          fullName: 'Dr. Kirti Bhandari',
          mobile: '+919876543299',
          email: 'dr.kirti@swasthya.in',
          doctorProfile: {
            qualification: 'MD (Pediatrics)',
            specialty: 'Pediatrics & Child Care',
            experienceYears: 15,
            registrationNumber: 'RJ-MED-2010-1102',
            consultationFee: 400,
            status: DoctorVerificationStatus.VERIFIED,
            hospitalNames: ['City Care Hospital Jodhpur'],
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (doctorId: string, status: DoctorVerificationStatus) => {
    try {
      await apiRequest(`/admin/doctors/${doctorId}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason: 'Status updated by admin interface' }),
      });
      fetchDoctors();
      if (selectedDoctor) {
        setSelectedDoctor(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status: DoctorVerificationStatus) => {
    switch (status) {
      case DoctorVerificationStatus.VERIFIED:
        return <Badge variant="success">Verified Doctor</Badge>;
      case DoctorVerificationStatus.PENDING:
        return <Badge variant="warning">Pending Approval</Badge>;
      case DoctorVerificationStatus.REJECTED:
        return <Badge variant="danger">Rejected</Badge>;
      case DoctorVerificationStatus.SUSPENDED:
        return <Badge variant="neutral">Suspended</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Doctor Management & Roster
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Search doctor profiles, medical registration numbers, and update credentials.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'VERIFIED', 'PENDING', 'SUSPENDED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search by name, specialty, reg no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
            />
          </div>
        </div>

        {/* Doctors Data Table */}
        <Card className="overflow-hidden p-0 border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Doctor Name</th>
                  <th className="p-4">Specialty & Qualification</th>
                  <th className="p-4">Reg Number</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{doc.fullName}</div>
                      <div className="text-[11px] text-slate-500">{doc.mobile} • {doc.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{doc.doctorProfile?.specialty}</div>
                      <div className="text-[11px] text-slate-500">{doc.doctorProfile?.qualification}</div>
                    </td>
                    <td className="p-4 font-mono text-slate-700 font-medium">
                      {doc.doctorProfile?.registrationNumber}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      ₹{doc.doctorProfile?.consultationFee}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(doc.doctorProfile?.status)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDoctor(doc)}
                      >
                        Manage Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Profile Modal / Action Panel */}
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedDoctor.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedDoctor.doctorProfile?.specialty}</p>
                </div>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="font-semibold text-slate-500">Medical Reg No:</span>
                  <span className="font-mono font-bold">{selectedDoctor.doctorProfile?.registrationNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="font-semibold text-slate-500">Qualifications:</span>
                  <span className="font-medium">{selectedDoctor.doctorProfile?.qualification}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="font-semibold text-slate-500">Experience:</span>
                  <span className="font-medium">{selectedDoctor.doctorProfile?.experienceYears} Years</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="font-semibold text-slate-500">Hospitals:</span>
                  <span className="font-medium">{selectedDoctor.doctorProfile?.hospitalNames?.join(', ') || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <span className="font-semibold text-slate-500">Current Status:</span>
                  <span>{getStatusBadge(selectedDoctor.doctorProfile?.status)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Update Doctor Verification Status
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedDoctor.id, DoctorVerificationStatus.VERIFIED)}
                  >
                    ✓ Approve & Verify
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedDoctor.id, DoctorVerificationStatus.REJECTED)}
                  >
                    ✕ Reject Registration
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="col-span-2 text-rose-600 border-rose-200"
                    onClick={() => handleUpdateStatus(selectedDoctor.id, DoctorVerificationStatus.SUSPENDED)}
                  >
                    🚫 Suspend Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
