'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DoctorLayout } from '../../../../components/doctor/doctor-layout';
import { Card, CardHeader } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { apiRequest } from '../../../../lib/api-client';

const DYNAMIC_PATIENT_MAP: Record<string, any> = {
  tok_18: {
    tokenNumber: 18,
    patientName: 'Sunita Agarwal',
    patientMobile: '+919876543214',
    patientAgeGender: '38F',
    visitStatus: '5-DAY FREE FOLLOW-UP (₹0 FEE)',
    lastVisit: 'Sept 20 (2 Days ago - ₹500 Paid)',
    previousRx: 'Dermatitis Allergy',
    chiefComplaint: 'Itching and skin redness on forearms for 3 days after monsoon exposure.',
    observations: 'Mild erythematous plaques with superficial scaling. No infection.',
    diagnosis: 'Acute Contact Dermatitis',
  },
  tok_19: {
    tokenNumber: 19,
    patientName: 'Mukesh Sharma',
    patientMobile: '+919829011111',
    patientAgeGender: '45M',
    visitStatus: 'NEW CONSULTATION (₹500 PAID)',
    lastVisit: 'First Visit Today',
    previousRx: 'None (New Record)',
    chiefComplaint: 'Persistent knee joint pain and mild stiffness in morning.',
    observations: 'Bilateral knee crepitus present. No effusion or acute erythema.',
    diagnosis: 'Mild Osteoarthritis Knee',
  },
  tok_20: {
    tokenNumber: 20,
    patientName: 'Pooja Bishnoi',
    patientMobile: '+919829022222',
    patientAgeGender: '29F',
    visitStatus: 'NEW CONSULTATION (₹500 PAID)',
    lastVisit: 'First Visit Today',
    previousRx: 'None (New Record)',
    chiefComplaint: 'Facial acne breakout and skin hyperpigmentation.',
    observations: 'Inflammatory papules on cheeks. Post-inflammatory hyperpigmentation.',
    diagnosis: 'Acne Vulgaris Grade II',
  },
  tok_21: {
    tokenNumber: 21,
    patientName: 'Vikram Gehlot',
    patientMobile: '+919829033333',
    patientAgeGender: '52M',
    visitStatus: '5-DAY FREE FOLLOW-UP (₹0 FEE)',
    lastVisit: 'Sept 19 (3 Days ago - ₹500 Paid)',
    previousRx: 'Hypertension Follow-Up',
    chiefComplaint: 'Routine blood pressure checkup and lab report review.',
    observations: 'BP: 128/82 mmHg. Normal heart sounds S1 S2.',
    diagnosis: 'Essential Hypertension - Controlled',
  },
};

export default function DoctorConsultationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const activeTokenId = params?.id || 'tok_18';
  const activePatient = DYNAMIC_PATIENT_MAP[activeTokenId] || DYNAMIC_PATIENT_MAP['tok_18'];

  const [chiefComplaint, setChiefComplaint] = useState(activePatient.chiefComplaint);
  const [observations, setObservations] = useState(activePatient.observations);
  const [diagnosis, setDiagnosis] = useState(activePatient.diagnosis);
  const [advice, setAdvice] = useState('Avoid harsh soaps, synthetic clothes, and direct sunlight. Keep skin hydrated.');
  const [followUpDate, setFollowUpDate] = useState('2026-09-28');

  const [medicines, setMedicines] = useState([
    {
      medicineName: 'Tab Allegra 120mg (Fexofenadine)',
      dosage: '1 Tab',
      frequency: '0-0-1 (Night)',
      duration: '7 days',
      instructions: 'Take after dinner with water',
    },
    {
      medicineName: 'Cream Desowen 0.05% (Desonide)',
      dosage: 'Topical Application',
      frequency: '1-0-1 (Twice daily)',
      duration: '5 days',
      instructions: 'Apply thin layer on affected area only',
    },
  ]);

  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('1 Tab');
  const [newFreq, setNewFreq] = useState('1-0-1');
  const [newDuration, setNewDuration] = useState('5 days');
  const [newInstruction, setNewInstruction] = useState('After food');

  const [rxMode, setRxMode] = useState<'DIGITAL' | 'PAPER_QUICK'>('DIGITAL');
  const [paperRxNote, setPaperRxNote] = useState('Paper prescription written on clinic pad. Prescribed anti-allergy tablets and cream for 5 days. Next follow-up in 7 days if rash persists.');

  const [isSaving, setIsSaving] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [savedRx, setSavedRx] = useState<any | null>(null);

  const handleAddMedicine = () => {
    if (!newMedName) return;
    setMedicines([
      ...medicines,
      {
        medicineName: newMedName,
        dosage: newDosage,
        frequency: newFreq,
        duration: newDuration,
        instructions: newInstruction,
      },
    ]);
    setNewMedName('');
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleFinishAndRedirect = async () => {
    try {
      const tokenId = params?.id || 'tok_18';
      await apiRequest(`/queue/doctor/usr_doctor_01/complete/${tokenId}`, {
        method: 'POST',
      });
    } catch (e) {
      // Continue navigation
    }
    router.push('/doctor/dashboard');
  };

  const handleSavePrescription = async () => {
    setIsSaving(true);
    try {
      const rxPayload = {
        doctorName: 'Dr. Ananya Sharma',
        doctorSpecialty: 'Dermatology & Cosmetology',
        hospitalName: 'City Care Hospital Jodhpur',
        patientId: activePatient.tokenNumber ? `usr_pat_${activePatient.tokenNumber}` : 'usr_patient_01',
        patientName: activePatient.patientName,
        patientMobile: activePatient.patientMobile,
        patientAgeGender: activePatient.patientAgeGender,
        rxMode,
        paperRxNote: rxMode === 'PAPER_QUICK' ? paperRxNote : null,
        chiefComplaint,
        observations,
        diagnosis,
        medicines: rxMode === 'DIGITAL' ? medicines : [{ medicineName: 'Paper Letterhead Rx Record Saved', dosage: 'As written on paper pad', frequency: 'See paper note', duration: '5 days', instructions: paperRxNote }],
        advice,
        followUpDate,
      };

      const result = await apiRequest('/prescriptions', {
        method: 'POST',
        body: JSON.stringify(rxPayload),
      });

      // Complete token in queue state as well
      const tokenId = activeTokenId;
      await apiRequest(`/queue/doctor/usr_doctor_01/complete/${tokenId}`, {
        method: 'POST',
      }).catch(() => {});

      setSavedRx(result);
      setShowPreviewModal(true);
    } catch (err: any) {
      alert(err.message || 'Failed to save prescription');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Patient Consultation Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">Token #{activePatient.tokenNumber}</Badge>
              <span className="text-xs text-slate-400">Consultation Workspace</span>
              <span className="text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                ✓ {activePatient.visitStatus}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">{activePatient.patientName}</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Age/Gender: <strong>{activePatient.patientAgeGender}</strong> • Mobile: <strong className="text-white">{activePatient.patientMobile}</strong> • ABHA: <span className="font-mono text-brand-300">12-3456-7890-1234</span>
            </p>
            <p className="text-[11px] text-teal-300 font-medium mt-1">
              Last Visit: <strong>{activePatient.lastVisit}</strong> • Previous Rx: <i>{activePatient.previousRx}</i>
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="text-white border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl" onClick={() => router.push('/doctor/dashboard')}>
              Back to Dashboard
            </Button>
            <button
              disabled={isSaving}
              onClick={handleSavePrescription}
              className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 border border-emerald-300"
            >
              <span>📄 Save Record & Complete</span>
            </button>
          </div>
        </div>

        {/* Clinical Form Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Complaints & Examination */}
          <div className="space-y-6">
            <Card className="space-y-4 border-slate-200">
              <CardHeader title="Clinical Notes & Diagnosis" />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chief Complaint</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Observations & Findings</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                />
              </div>

              <Input
                label="Primary Clinical Diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </Card>

            <Card className="space-y-4 border-slate-200">
              <CardHeader title="Doctor Advice & Follow-up Plan" />
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Precautions & Advice</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                />
              </div>

              <Input
                label="Recommended Follow-up Date"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
              />
            </Card>
          </div>

          {/* Right Column: Rx Medicine Builder / Paper Rx Quick Capture */}
          <div className="space-y-6">
            <Card className="space-y-4 border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <CardHeader title="Rx Prescription Builder" subtitle="Maintain digital health record & history" />
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setRxMode('DIGITAL')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      rxMode === 'DIGITAL' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Digital Rx
                  </button>
                  <button
                    type="button"
                    onClick={() => setRxMode('PAPER_QUICK')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      rxMode === 'PAPER_QUICK' ? 'bg-amber-400 text-slate-950 font-black shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📝 Paper Rx Record
                  </button>
                </div>
              </div>

              {rxMode === 'PAPER_QUICK' ? (
                <div className="space-y-4 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                  <div className="text-xs font-bold text-amber-950 flex items-center justify-between">
                    <span>Quick Paper Rx Note (Doctor writes on physical pad)</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md font-mono">1-Tap Record Save</span>
                  </div>
                  <p className="text-[11px] text-amber-800 font-medium">
                    Doctor writes on their official paper letterhead. Type quick summary or medicine notes here so patient digital history is saved for future visits & free follow-ups!
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Prescription Summary Note</label>
                    <textarea
                      rows={4}
                      className="w-full rounded-xl border border-amber-300 p-3 text-xs text-slate-900 focus:border-amber-500 bg-white"
                      value={paperRxNote}
                      onChange={(e) => setPaperRxNote(e.target.value)}
                      placeholder="e.g. Tab Allegra 120mg 1 tab daily at night x 7 days, Cream Desowen BD x 5 days..."
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Added Medicines List */}
                  <div className="space-y-2">
                    {medicines.map((med, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-start text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{med.medicineName}</div>
                          <div className="text-slate-600 mt-0.5">
                            Dosage: <strong>{med.dosage}</strong> • Frequency: <strong className="text-brand-700">{med.frequency}</strong> • Duration: <strong>{med.duration}</strong>
                          </div>
                          {med.instructions && <div className="text-[11px] text-slate-500 italic mt-0.5">Note: {med.instructions}</div>}
                        </div>
                        <button onClick={() => handleRemoveMedicine(idx)} className="text-rose-600 hover:text-rose-800 font-bold px-2 py-1">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Medicine Form */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <Input
                      label="Medicine Name & Strength"
                      placeholder="e.g. Tab Cetirizine 10mg"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Dosage"
                        placeholder="1 Tab / 5ml"
                        value={newDosage}
                        onChange={(e) => setNewDosage(e.target.value)}
                      />
                      <Input
                        label="Frequency"
                        placeholder="1-0-1 / 0-0-1"
                        value={newFreq}
                        onChange={(e) => setNewFreq(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Duration"
                        placeholder="5 days / 14 days"
                        value={newDuration}
                        onChange={(e) => setNewDuration(e.target.value)}
                      />
                  <Input
                    label="Instructions"
                    placeholder="After meals"
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                  />
                </div>

                <Button type="button" variant="outline" className="w-full" onClick={handleAddMedicine}>
                  + Add Medicine Item to Rx
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
        </div>

        {/* Digital Prescription Print & Preview Modal */}
        {showPreviewModal && savedRx && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-slate-200">
              {/* Prescription Header */}
              <div className="flex justify-between items-start border-b-2 border-brand-600 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{savedRx.doctorName}</h2>
                  <p className="text-xs font-semibold text-brand-700">{savedRx.doctorSpecialty}</p>
                  <p className="text-[11px] text-slate-500">{savedRx.hospitalName}</p>
                </div>
                <div className="text-right">
                  <Badge variant="brand" className="mb-1">{savedRx.prescriptionCode}</Badge>
                  <div className="text-[11px] text-slate-500">Date: {new Date(savedRx.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Patient Info Bar */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between text-xs font-medium text-slate-700">
                <span>Patient: <strong>{savedRx.patientName}</strong> ({savedRx.patientAgeGender})</span>
                <span>Mobile: <strong>{savedRx.patientMobile}</strong></span>
              </div>

              {/* Clinical Details */}
              <div className="space-y-2 text-xs text-slate-800">
                <div><strong>Chief Complaint:</strong> {savedRx.chiefComplaint}</div>
                <div><strong>Diagnosis:</strong> <span className="font-bold text-slate-900">{savedRx.diagnosis}</span></div>
              </div>

              {/* Rx Medicines Table */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-slate-900 border-b border-slate-200 pb-1">
                  Rx (PRESCRIBED MEDICINES)
                </div>
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2">Medicine</th>
                      <th className="p-2">Dosage</th>
                      <th className="p-2">Frequency</th>
                      <th className="p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {savedRx.medicines?.map((m: any, i: number) => (
                      <tr key={i}>
                        <td className="p-2 font-bold text-slate-900">{m.medicineName}</td>
                        <td className="p-2">{m.dosage}</td>
                        <td className="p-2 font-semibold text-brand-700">{m.frequency}</td>
                        <td className="p-2">{m.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Advice */}
              {savedRx.advice && (
                <div className="text-xs text-slate-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <strong>Doctor Advice:</strong> {savedRx.advice}
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                  Close
                </Button>
                <Button onClick={() => window.print()}>
                  🖨️ Print / Download PDF
                </Button>
                <Button variant="success" onClick={handleFinishAndRedirect}>
                  ✓ Finish Consultation
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
