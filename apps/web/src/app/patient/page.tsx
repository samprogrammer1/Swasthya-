'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PatientLayout } from '../../components/patient/patient-layout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { apiRequest } from '../../lib/api-client';

export default function PatientHomePage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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
          ratingAverage: 4.9,
          ratingCount: 142,
          hospitalName: 'City Care Hospital Jodhpur',
          location: 'Shastri Nagar, Jodhpur',
          currentTokenNumber: 18,
        },
        {
          id: 'usr_doctor_02',
          fullName: 'Dr. Ramesh Purohit',
          specialty: 'Orthopedics & Joint Replacement',
          qualification: 'MS (Orthopedics)',
          consultationFee: 600,
          ratingAverage: 4.5,
          ratingCount: 38,
          hospitalName: 'AIIMS Jodhpur Auxiliary Clinic',
          location: 'Paota B Road, Jodhpur',
          currentTokenNumber: 11,
        },
      ]);
    }
  };

  return (
    <PatientLayout>
      {/* Search Input Banner */}
      <div className="relative">
        <Input
          placeholder="Search doctor, hospital, or specialty in Jodhpur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="py-3.5 shadow-md border-brand-200"
        />
      </div>

      {/* Active OPD Live Token Alert Card */}
      <Card className="bg-slate-900 text-white p-5 border-none shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
          <span>City Care Hospital Jodhpur</span>
          <span className="text-emerald-400 font-bold">• LIVE OPD</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-brand-400 uppercase font-bold">Your OPD Token</div>
            <div className="text-4xl font-black text-white mt-0.5">#27</div>
            <div className="text-xs text-slate-300">Dr. Ananya Sharma (Dermatologist)</div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Currently Serving</div>
            <div className="text-3xl font-extrabold text-brand-400 mt-0.5">#18</div>
            <div className="text-[11px] text-slate-300 font-semibold mt-0.5">8 Patients Ahead</div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-300 font-medium">Est. Wait Time: <strong className="text-white">~45 mins</strong></span>
          <Link href="/patient/queue">
            <Button size="sm" className="bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs py-1.5">
              Track Live Queue →
            </Button>
          </Link>
        </div>
      </Card>

      {/* Specialty Quick Filter Pills */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Top Specialties</div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['Dermatology', 'Orthopedics', 'Pediatrics', 'Cardiology', 'General Medicine'].map((sp) => (
            <Link key={sp} href={`/patient/doctors?specialty=${sp}`}>
              <button className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200/90 text-slate-700 hover:border-brand-500 hover:text-brand-600 shadow-sm whitespace-nowrap">
                {sp}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommended Doctors List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Verified Doctors in Jodhpur</div>
          <Link href="/patient/doctors" className="text-xs font-bold text-brand-600 hover:underline">
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {doctors.map((doc) => (
            <Card key={doc.id} className="p-4 space-y-3 border-slate-200/90 hover:border-brand-500/50 transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-slate-900 text-base">{doc.fullName}</h4>
                    <Badge variant="success" className="text-[10px] py-0">Verified</Badge>
                  </div>
                  <p className="text-xs font-semibold text-brand-700">{doc.specialty}</p>
                  <p className="text-[11px] text-slate-500">{doc.qualification} • {doc.experienceYears || 12} Yrs Exp</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-slate-900">₹{doc.consultationFee}</div>
                  <div className="text-[11px] text-amber-500 font-bold mt-0.5">★ {doc.ratingAverage} ({doc.ratingCount})</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between">
                <span>🏥 {doc.hospitalName}</span>
                <span className="text-brand-700 font-bold">• Serving #{doc.currentTokenNumber}</span>
              </div>

              <div className="flex justify-end pt-1">
                <Link href={`/patient/doctors/${doc.id}`}>
                  <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white font-bold w-full sm:w-auto">
                    GET OPD TOKEN
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
}
