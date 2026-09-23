'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HospitalLayout } from '../../../components/hospital/hospital-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';
import {
  Building2,
  Stethoscope,
  Users,
  Ticket,
  Plus,
  CheckCircle2,
  Settings,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  Activity,
  X,
} from 'lucide-react';

export default function HospitalDashboardPage() {
  const [org, setOrg] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<'OPTION_1' | 'OPTION_2' | 'OPTION_3' | 'OPTION_4'>('OPTION_1');

  // Modals state
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [showAddReceptionModal, setShowAddReceptionModal] = useState(false);

  // Form states
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Dermatology');
  const [docFee, setDocFee] = useState('500');

  const [recName, setRecName] = useState('');
  const [recMobile, setRecMobile] = useState('');
  const [recDesk, setRecDesk] = useState('Desk 1');

  useEffect(() => {
    fetchOrg();
  }, []);

  const fetchOrg = async () => {
    try {
      const data = await apiRequest('/organizations/org_city_care_jodhpur');
      setOrg(data);
    } catch (e) {
      setOrg({
        name: 'City Care Hospital Jodhpur',
        activeDoctorsCount: 8,
        activeReceptionistsCount: 3,
        todayTokensCount: 184,
        doctors: [
          { name: 'Dr. Ananya Sharma', specialty: 'Dermatology', fee: 500, room: 'OPD 101' },
          { name: 'Dr. Ramesh Purohit', specialty: 'Orthopedics', fee: 600, room: 'OPD 104' },
          { name: 'Dr. Kirti Bhandari', specialty: 'Pediatrics', fee: 400, room: 'OPD 202' },
          { name: 'Dr. Suresh Vyas', specialty: 'Cardiology', fee: 700, room: 'OPD 301' },
        ],
        receptionists: [
          { name: 'Vikram Singh', desk: 'Desk 1 (Main Entrance)', mobile: '+919876543213' },
          { name: 'Pooja Bishnoi', desk: 'Desk 2 (Specialty OPD)', mobile: '+919829022222' },
        ],
      });
    }
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      name: docName,
      specialty: docSpecialty,
      fee: parseInt(docFee) || 500,
      room: `OPD ${Math.floor(Math.random() * 200) + 100}`,
    };
    setOrg((prev: any) => ({
      ...prev,
      activeDoctorsCount: (prev?.activeDoctorsCount || 4) + 1,
      doctors: [...(prev?.doctors || []), newDoc],
    }));
    setShowAddDoctorModal(false);
    setDocName('');
    alert(`Doctor ${docName} added successfully to Hospital Roster!`);
  };

  const handleAddReceptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRec = {
      name: recName,
      desk: recDesk,
      mobile: recMobile,
    };
    setOrg((prev: any) => ({
      ...prev,
      activeReceptionistsCount: (prev?.activeReceptionistsCount || 2) + 1,
      receptionists: [...(prev?.receptionists || []), newRec],
    }));
    setShowAddReceptionModal(false);
    setRecName('');
    setRecMobile('');
    alert(`Receptionist staff ${recName} created successfully for ${recDesk}!`);
  };

  return (
    <HospitalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-bold mb-2 border border-brand-200">
              <Building2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Multi-Tenant Hospital & Clinic Administration</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
              Hospital Operations & 4 Practice Models
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure hospital/clinic operational workflows, add doctors, and assign reception desks.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              onClick={() => setShowAddDoctorModal(true)}
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add Doctor to Hospital</span>
            </Button>
            <Button
              variant="outline"
              className="text-xs font-bold rounded-xl flex items-center gap-1.5"
              onClick={() => setShowAddReceptionModal(true)}
            >
              <Ticket className="w-4 h-4 text-amber-600" />
              <span>+ Add Reception Desk Staff</span>
            </Button>
          </div>
        </div>

        {/* 4 Practice Operational Models Configuration Matrix */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-600" />
              <span>Select Active Healthcare Operational Model</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose how receptionists and doctors manage OPD tokens in your hospital or clinic setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Model 1 */}
            <div
              onClick={() => setSelectedModel('OPTION_1')}
              className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 relative ${
                selectedModel === 'OPTION_1'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl ring-2 ring-brand-500'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant={selectedModel === 'OPTION_1' ? 'brand' : 'neutral'}>Option 1</Badge>
                {selectedModel === 'OPTION_1' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>
              <div>
                <h4 className="font-extrabold text-sm font-display">Multi-Doctor Hospital</h4>
                <p className={`text-xs mt-1 leading-relaxed ${selectedModel === 'OPTION_1' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Hospital Admin manages 4–5 Doctors. Reception desk chooses doctor during patient booking.
                </p>
              </div>
              <div className="text-[10px] font-mono pt-2 border-t border-slate-800 text-teal-400">
                ✓ Reception selects Doctor dropdown
              </div>
            </div>

            {/* Model 2 */}
            <div
              onClick={() => setSelectedModel('OPTION_2')}
              className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 relative ${
                selectedModel === 'OPTION_2'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl ring-2 ring-brand-500'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant={selectedModel === 'OPTION_2' ? 'brand' : 'neutral'}>Option 2</Badge>
                {selectedModel === 'OPTION_2' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>
              <div>
                <h4 className="font-extrabold text-sm font-display">Solo Private Clinic</h4>
                <p className={`text-xs mt-1 leading-relaxed ${selectedModel === 'OPTION_2' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Doctor owns clinic & creates 1 Receptionist staff. Desk issues tokens for that doctor only.
                </p>
              </div>
              <div className="text-[10px] font-mono pt-2 border-t border-slate-800 text-amber-400">
                ✓ Doctor delegates Receptionist
              </div>
            </div>

            {/* Model 3 */}
            <div
              onClick={() => setSelectedModel('OPTION_3')}
              className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 relative ${
                selectedModel === 'OPTION_3'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl ring-2 ring-brand-500'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant={selectedModel === 'OPTION_3' ? 'brand' : 'neutral'}>Option 3</Badge>
                {selectedModel === 'OPTION_3' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>
              <div>
                <h4 className="font-extrabold text-sm font-display">Shared Reception Hub</h4>
                <p className={`text-xs mt-1 leading-relaxed ${selectedModel === 'OPTION_3' ? 'text-slate-300' : 'text-slate-500'}`}>
                  1 Receptionist desk handles booking for 2–3 visiting doctors/clinics in medical hub.
                </p>
              </div>
              <div className="text-[10px] font-mono pt-2 border-t border-slate-800 text-purple-400">
                ✓ Multi-Clinic Desk Hub
              </div>
            </div>

            {/* Model 4 */}
            <div
              onClick={() => setSelectedModel('OPTION_4')}
              className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 relative ${
                selectedModel === 'OPTION_4'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl ring-2 ring-brand-500'
                  : 'bg-white border-slate-200/90 text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant={selectedModel === 'OPTION_4' ? 'brand' : 'neutral'}>Option 4</Badge>
                {selectedModel === 'OPTION_4' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </div>
              <div>
                <h4 className="font-extrabold text-sm font-display">Solo Direct Doctor OPD</h4>
                <p className={`text-xs mt-1 leading-relaxed ${selectedModel === 'OPTION_4' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Standalone Doctor OPD with no receptionist. Doctor issues and calls walk-in tokens directly.
                </p>
              </div>
              <div className="text-[10px] font-mono pt-2 border-t border-slate-800 text-emerald-400">
                ✓ Direct Doctor Queue
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Doctors Roster Cards */}
        <Card className="space-y-4 border-slate-200/90 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span>Hospital Assigned Doctors ({org?.doctors?.length || 4} Consultants)</span>
              </h3>
              <p className="text-xs text-slate-500">Doctors configured for OPD Token booking in this hospital</p>
            </div>
            <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl" onClick={() => setShowAddDoctorModal(true)}>
              + Add Doctor
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {org?.doctors?.map((doc: any, idx: number) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                    <div className="text-xs text-brand-700 font-semibold">{doc.specialty}</div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="text-xs text-slate-600 pt-2 border-t border-slate-200/60 flex justify-between">
                  <span>Fee: <strong>₹{doc.fee}</strong></span>
                  <span className="font-mono text-slate-500">{doc.room}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Reception Desks Roster */}
        <Card className="space-y-4 border-slate-200/90 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-600" />
                <span>Configured Reception Desks ({org?.receptionists?.length || 2} Staff)</span>
              </h3>
              <p className="text-xs text-slate-500">OPD Desk staff assigned to issue tokens and manage walk-ins</p>
            </div>
            <Button size="sm" variant="outline" className="text-xs font-bold rounded-xl" onClick={() => setShowAddReceptionModal(true)}>
              + Add Reception Staff
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {org?.receptionists?.map((rec: any, idx: number) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 text-sm">{rec.name}</div>
                <div className="text-xs text-amber-800 font-semibold">{rec.desk}</div>
                <div className="text-xs font-mono text-slate-500">Mobile: {rec.mobile}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Add Doctor Modal */}
        {showAddDoctorModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-brand-600" />
                  <span>Add New Doctor to Hospital Roster</span>
                </h3>
                <button onClick={() => setShowAddDoctorModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDoctorSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialty</label>
                  <select
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500 bg-white"
                  >
                    <option value="Dermatology & Cosmetology">Dermatology & Cosmetology</option>
                    <option value="Orthopedics & Joint Care">Orthopedics & Joint Care</option>
                    <option value="Pediatrics & Child Health">Pediatrics & Child Health</option>
                    <option value="Cardiology & Heart Care">Cardiology & Heart Care</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">OPD Consultation Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={docFee}
                    onChange={(e) => setDocFee(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" className="w-1/2 text-xs" onClick={() => setShowAddDoctorModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="w-1/2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white">
                    Add Doctor
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Receptionist Modal */}
        {showAddReceptionModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-600" />
                  <span>Add Reception Desk Staff Account</span>
                </h3>
                <button onClick={() => setShowAddReceptionModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReceptionSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Bishnoi"
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98290 12345"
                    value={recMobile}
                    onChange={(e) => setRecMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Desk / OPD Counter</label>
                  <input
                    type="text"
                    required
                    placeholder="Desk 1 (Main Entrance)"
                    value={recDesk}
                    onChange={(e) => setRecDesk(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" variant="outline" className="w-1/2 text-xs" onClick={() => setShowAddReceptionModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="w-1/2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white">
                    Assign Receptionist
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </HospitalLayout>
  );
}
