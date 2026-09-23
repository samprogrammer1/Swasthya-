'use client';

import React, { useState } from 'react';
import { ReceptionLayout } from '../../../components/reception/reception-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';
import {
  Ticket,
  User,
  Search,
  CheckCircle2,
  Stethoscope,
  CreditCard,
  Printer,
  ChevronRight,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';

const DEMO_DOCTORS = [
  {
    id: 'usr_doctor_01',
    name: 'Dr. Ananya Sharma',
    specialty: 'Dermatology & Cosmetology',
    fee: 500,
    room: 'OPD Room 101',
    currentlyServing: 18,
    totalWaiting: 8,
    status: 'OPD OPEN',
  },
  {
    id: 'usr_doctor_02',
    name: 'Dr. Ramesh Purohit',
    specialty: 'Orthopedics & Joint Replacement',
    fee: 600,
    room: 'OPD Room 104',
    currentlyServing: 11,
    totalWaiting: 4,
    status: 'OPD OPEN',
  },
  {
    id: 'usr_doctor_03',
    name: 'Dr. Kirti Bhandari',
    specialty: 'Pediatrics & Child Health',
    fee: 400,
    room: 'OPD Room 202',
    currentlyServing: 5,
    totalWaiting: 2,
    status: 'OPD OPEN',
  },
  {
    id: 'usr_doctor_04',
    name: 'Dr. Suresh Vyas',
    specialty: 'Cardiology & Heart Care',
    fee: 700,
    room: 'OPD Room 301',
    currentlyServing: 2,
    totalWaiting: 1,
    status: 'OPD OPEN',
  },
];

export default function ReceptionTokenPage() {
  const [patientQuery, setPatientQuery] = useState('+919876543214');
  const [selectedPatient, setSelectedPatient] = useState<any>({
    id: 'usr_patient_01',
    fullName: 'Sunita Agarwal',
    mobile: '+919876543214',
    city: 'Jodhpur',
  });

  const [selectedDoctor, setSelectedDoctor] = useState(DEMO_DOCTORS[0]);
  const [visitType, setVisitType] = useState<'NEW' | 'FREE_FOLLOWUP' | 'FOLLOWUP'>('FREE_FOLLOWUP');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD'>('CASH');
  const [amount, setAmount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  const handleSearchPatient = async () => {
    try {
      const results = await apiRequest(`/reception/patients/search?q=${patientQuery}`);
      if (results && results.length > 0) {
        setSelectedPatient(results[0]);
      } else {
        alert('Patient profile not found. Register new patient.');
      }
    } catch (e) {
      // Keep default
    }
  };

  const handleDoctorSelect = (doc: typeof DEMO_DOCTORS[0]) => {
    setSelectedDoctor(doc);
    if (visitType === 'NEW') setAmount(doc.fee);
    else if (visitType === 'FREE_FOLLOWUP') setAmount(0);
    else setAmount(200);
  };

  const handleVisitTypeChange = (type: 'NEW' | 'FREE_FOLLOWUP' | 'FOLLOWUP') => {
    setVisitType(type);
    if (type === 'NEW') {
      setAmount(selectedDoctor.fee);
    } else if (type === 'FREE_FOLLOWUP') {
      setAmount(0);
    } else {
      setAmount(200);
    }
  };

  const handleGenerateToken = async () => {
    setIsGenerating(true);
    try {
      const result = await apiRequest('/reception/tokens/generate', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          patientId: selectedPatient.id,
          patientName: selectedPatient.fullName,
          patientMobile: selectedPatient.mobile,
          visitType,
          amount,
          paymentMethod,
        }),
      });

      setGeneratedResult({
        ...result,
        doctor: selectedDoctor,
      });
    } catch (err: any) {
      alert(err.message || 'Token generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ReceptionLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Multi-Doctor OPD Desk Booking Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
            OPD Token Booking & Receipt Generation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Select patient, choose doctor on duty, collect fee, and issue live OPD token.
          </p>
        </div>

        {/* Step 1: Patient Selection */}
        <Card className="space-y-4 border-slate-200/90 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-display border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-brand-600" />
            <span>Step 1: Patient Search & Selection</span>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter patient mobile or ID (+91 98765 43214)"
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500"
              />
            </div>
            <Button variant="outline" className="text-xs font-bold rounded-xl" onClick={handleSearchPatient}>
              Search Profile
            </Button>
          </div>

          {selectedPatient && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-bold text-slate-900 text-sm">{selectedPatient.fullName}</div>
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Patient Verified</span>
                  </Badge>
                </div>
                <div className="text-slate-600 mt-1">
                  Mobile: <span className="font-mono">{selectedPatient.mobile}</span> • City: {selectedPatient.city || 'Jodhpur'}
                </div>
              </div>

              <div className="bg-emerald-100 text-emerald-900 border border-emerald-300 p-2.5 rounded-xl text-[11px] font-bold space-y-0.5">
                <div className="flex items-center gap-1 text-emerald-950 font-black">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5-DAY FREE FOLLOW-UP ACTIVE</span>
                </div>
                <div className="text-[10px] text-emerald-800">
                  Last Paid Visit: <strong>Sept 20 (2 Days Ago)</strong> • ₹0 OPD Fee
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Step 2: Choose Doctor from Hospital Roster (Option 1 & 3 Support) */}
        <Card className="space-y-4 border-slate-200/90 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-display">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Step 2: Select Doctor on Duty ({DEMO_DOCTORS.length} Available)</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400">Choose doctor requested by patient</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_DOCTORS.map((doc) => {
              const isSelected = selectedDoctor.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => handleDoctorSelect(doc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                      : 'bg-white border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-brand-500 text-slate-950 text-[10px] font-black px-3 py-0.5 rounded-bl-xl">
                      SELECTED DOCTOR
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm">{doc.name}</h4>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-teal-300' : 'text-brand-700'}`}>
                        {doc.specialty}
                      </p>
                    </div>
                  </div>

                  <div className={`text-[11px] flex justify-between pt-2 border-t ${isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-600'}`}>
                    <span>Fee: <strong>₹{doc.fee}</strong> ({doc.room})</span>
                    <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold'}>
                      Serving #{doc.currentlyServing} • {doc.totalWaiting} Waiting
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visit Type Choice */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleVisitTypeChange('NEW')}
              className={`p-3.5 rounded-2xl text-left border font-bold text-xs transition-all ${
                visitType === 'NEW'
                  ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-sm ring-2 ring-brand-300'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-extrabold flex items-center justify-between">
                <span>New Consultation</span>
                <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-md">PAID</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">First Visit • ₹{selectedDoctor.fee}</div>
            </button>

            <button
              type="button"
              onClick={() => handleVisitTypeChange('FREE_FOLLOWUP')}
              className={`p-3.5 rounded-2xl text-left border font-bold text-xs transition-all ${
                visitType === 'FREE_FOLLOWUP'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg ring-2 ring-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
              }`}
            >
              <div className="font-extrabold flex items-center justify-between">
                <span>5-Day Free Follow-Up</span>
                <span className="text-[10px] bg-slate-950 text-white font-black px-2 py-0.5 rounded-md">₹0 FREE</span>
              </div>
              <div className="text-[11px] font-extrabold opacity-90 mt-1">Re-evaluation • Record Saved</div>
            </button>

            <button
              type="button"
              onClick={() => handleVisitTypeChange('FOLLOWUP')}
              className={`p-3.5 rounded-2xl text-left border font-bold text-xs transition-all ${
                visitType === 'FOLLOWUP'
                  ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm ring-2 ring-amber-300'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-extrabold flex items-center justify-between">
                <span>Paid Follow-up</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">After 5 Days</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Post Validity • ₹200</div>
            </button>
          </div>
        </Card>

        {/* Step 3: Payment Method */}
        <Card className="space-y-4 border-slate-200/90 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-display">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Step 3: Collect Fee & Payment Method</span>
            </div>
            <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
              Payable: ₹{amount}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(['CASH', 'UPI', 'CARD'] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition-all ${
                  paymentMethod === method
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {method === 'CASH' && 'Cash Desk'}
                {method === 'UPI' && 'UPI QR Code'}
                {method === 'CARD' && 'Card Swipe'}
              </button>
            ))}
          </div>

          <Button
            size="lg"
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-4 text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2"
            isLoading={isGenerating}
            onClick={handleGenerateToken}
          >
            <Ticket className="w-5 h-5 text-slate-950" />
            <span>GENERATE OPD TOKEN & PRINT RECEIPT</span>
            <ChevronRight className="w-5 h-5 text-slate-950" />
          </Button>
        </Card>

        {/* Token Receipt Modal */}
        {generatedResult && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-6 shadow-2xl border border-slate-200">
              <div className="border-b border-slate-100 pb-3">
                <Badge variant="brand" className="mb-1">City Care Hospital Jodhpur</Badge>
                <h3 className="font-extrabold text-slate-900 text-lg">OPD TOKEN RECEIPT</h3>
              </div>

              {/* Large Token Display */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-2 border border-slate-800">
                <div className="text-xs text-slate-400 font-semibold uppercase">OPD Token Number</div>
                <div className="text-5xl font-black text-brand-400 tracking-tight">
                  #{generatedResult.token?.tokenNumber || 27}
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  Code: {generatedResult.token?.tokenCode || 'SW-027'}
                </div>
              </div>

              <div className="text-left text-xs space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-700">
                <div>Patient: <strong>{generatedResult.token?.patientName}</strong></div>
                <div>Doctor: <strong>{selectedDoctor.name} ({selectedDoctor.specialty})</strong></div>
                <div>Room: <strong>{selectedDoctor.room}</strong></div>
                <div>Currently Serving: <strong className="text-brand-700">#{selectedDoctor.currentlyServing}</strong></div>
                <div>Est. Wait Time: <strong>~{selectedDoctor.totalWaiting * 6} Minutes</strong></div>
                <div>Fee Paid: <strong>₹{amount} ({paymentMethod})</strong></div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="w-1/2 text-xs font-bold rounded-xl" onClick={() => setGeneratedResult(null)}>
                  Close
                </Button>
                <Button className="w-1/2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ReceptionLayout>
  );
}
