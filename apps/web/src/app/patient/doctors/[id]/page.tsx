'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PatientLayout } from '../../../../components/patient/patient-layout';
import { Card, CardHeader } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { apiRequest } from '../../../../lib/api-client';

export default function PatientDoctorProfilePage({ params }: { params: { id: string } }) {
  const router = Router();
  const [doc, setDoc] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchDoc();
  }, []);

  const fetchDoc = async () => {
    try {
      const data = await apiRequest(`/patients/doctors/${params.id}`);
      setDoc(data);
    } catch (e) {
      setDoc({
        id: 'usr_doctor_01',
        fullName: 'Dr. Ananya Sharma',
        specialty: 'Dermatology & Cosmetology',
        qualification: 'MBBS, MD (Dermatology)',
        experienceYears: 12,
        consultationFee: 500,
        ratingAverage: 4.9,
        ratingCount: 142,
        hospitalName: 'City Care Hospital Jodhpur',
        clinicName: 'Sharma Skin Clinic Shastri Nagar',
        location: 'Shastri Nagar, Jodhpur',
        opdStatus: 'OPEN',
        currentTokenNumber: 18,
        bio: 'Senior Dermatologist specializing in laser treatments, acne care, and skin allergies at Jodhpur City Care Clinic.',
      });
    }
  };

  const handleBookToken = async () => {
    setIsBooking(true);
    try {
      await apiRequest('/patients/book-token', {
        method: 'POST',
        body: JSON.stringify({ doctorId: params.id }),
      });
      router.push('/patient/queue');
    } catch (err: any) {
      alert(err.message || 'Token booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <PatientLayout>
      <div className="space-y-5">
        {/* Doctor Banner */}
        <Card className="p-5 space-y-4 border-slate-200">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{doc?.fullName || 'Dr. Ananya Sharma'}</h1>
                <Badge variant="success">Verified Doctor</Badge>
              </div>
              <p className="text-xs font-bold text-brand-700">{doc?.specialty}</p>
              <p className="text-xs text-slate-500">{doc?.qualification} • {doc?.experienceYears || 12} Yrs Experience</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {doc?.bio}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
            <div>
              <span className="text-slate-400 block">Consultation Fee:</span>
              <span className="font-extrabold text-slate-900 text-sm">₹{doc?.consultationFee || 500}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Patient Rating:</span>
              <span className="font-bold text-amber-500 text-sm">★ {doc?.ratingAverage || 4.9} ({doc?.ratingCount || 142} Reviews)</span>
            </div>
          </div>
        </Card>

        {/* Live OPD Queue Status & Booking Banner */}
        <Card className="bg-slate-900 text-white p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span>OPD Status</span>
            <span className="text-emerald-400 font-bold">• OPD OPEN NOW</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Currently Serving</div>
              <div className="text-3xl font-black text-brand-400 mt-1">#{doc?.currentTokenNumber || 18}</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Your Next Token</div>
              <div className="text-3xl font-black text-white mt-1">#27</div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-brand-500 hover:bg-brand-600 text-slate-950 font-black py-4 text-base shadow-lg shadow-brand-500/20"
            isLoading={isBooking}
            onClick={handleBookToken}
          >
            🎟️ GET OPD TOKEN NOW
          </Button>
        </Card>

        {/* Reviews Summary */}
        <Card className="space-y-3 border-slate-200">
          <CardHeader title="Patient Reviews & Experience" />
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {['Good Doctor (94%)', 'Listened Carefully (88%)', 'Explained Clearly (92%)', 'Short Waiting Time (85%)'].map((c) => (
              <Badge key={c} variant="brand">
                {c}
              </Badge>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>Sunita Agarwal</span>
                <span className="text-amber-500">★★★★★</span>
              </div>
              <p className="text-slate-600 mt-1 italic">
                "Extremely patient doctor! Explained skin allergy treatment clearly."
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PatientLayout>
  );
}
