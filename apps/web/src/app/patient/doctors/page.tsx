'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PatientLayout } from '../../../components/patient/patient-layout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function PatientDoctorsSearchPage() {
  const searchParams = useSearchParams();
  const initialSpecialty = searchParams.get('specialty') || 'ALL';

  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      const data = await apiRequest(`/patients/doctors?q=${searchQuery}&specialty=${selectedSpecialty}`);
      setDoctors(data);
    } catch (e) {
      setDoctors([
        {
          id: 'usr_doctor_01',
          fullName: 'Dr. Ananya Sharma',
          specialty: 'Dermatology & Cosmetology',
          qualification: 'MBBS, MD (Dermatology)',
          experienceYears: 12,
          consultationFee: 500,
          ratingAverage: 4.9,
          ratingCount: 142,
          hospitalName: 'City Care Hospital Jodhpur',
          currentTokenNumber: 18,
        },
        {
          id: 'usr_doctor_02',
          fullName: 'Dr. Ramesh Purohit',
          specialty: 'Orthopedics & Joint Replacement',
          qualification: 'MS (Orthopedics)',
          experienceYears: 8,
          consultationFee: 600,
          ratingAverage: 4.5,
          ratingCount: 38,
          hospitalName: 'AIIMS Jodhpur Auxiliary Clinic',
          currentTokenNumber: 11,
        },
        {
          id: 'usr_doctor_03',
          fullName: 'Dr. Kirti Bhandari',
          specialty: 'Pediatrics & Child Care',
          qualification: 'MD (Pediatrics)',
          experienceYears: 15,
          consultationFee: 400,
          ratingAverage: 4.8,
          ratingCount: 96,
          hospitalName: 'City Care Hospital Jodhpur',
          currentTokenNumber: 22,
        },
      ]);
    }
  };

  return (
    <PatientLayout>
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Find Doctor & OPD Token
          </h1>
          <p className="text-xs text-slate-500">
            Verified doctors in Jodhpur, Rajasthan with OPD Live Queue status.
          </p>
        </div>

        <Input
          placeholder="Search by doctor name or hospital..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
        />

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['ALL', 'Dermatology', 'Orthopedics', 'Pediatrics'].map((sp) => (
            <button
              key={sp}
              onClick={() => setSelectedSpecialty(sp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSpecialty === sp
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {doctors.map((doc) => (
            <Card key={doc.id} className="p-4 space-y-3 border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{doc.fullName}</h3>
                  <p className="text-xs font-semibold text-brand-700">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-500">{doc.qualification}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-slate-900">₹{doc.consultationFee}</div>
                  <div className="text-[11px] text-amber-500 font-bold">★ {doc.ratingAverage}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between">
                <span>🏥 {doc.hospitalName}</span>
                <span className="text-brand-700 font-bold">• Serving #{doc.currentTokenNumber}</span>
              </div>

              <Link href={`/patient/doctors/${doc.id}`} className="block">
                <Button size="sm" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold">
                  GET OPD TOKEN
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
}
