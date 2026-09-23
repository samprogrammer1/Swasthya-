'use client';

import React, { useEffect, useState } from 'react';
import { PatientLayout } from '../../../components/patient/patient-layout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function PatientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'PRESCRIPTIONS' | 'REPORTS' | 'BILLS'>('PRESCRIPTIONS');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const data = await apiRequest('/prescriptions/patient/usr_patient_01');
      setPrescriptions(data);
    } catch (e) {
      setPrescriptions([
        {
          id: 'rx_01',
          prescriptionCode: 'RX-2026-10492',
          doctorName: 'Dr. Ananya Sharma',
          doctorSpecialty: 'Dermatology & Cosmetology',
          hospitalName: 'City Care Hospital Jodhpur',
          diagnosis: 'Acute Contact Dermatitis & Allergic Reaction',
          medicines: [
            { medicineName: 'Tab Allegra 120mg', dosage: '1 Tab', frequency: '0-0-1', duration: '7 days' },
            { medicineName: 'Cream Desowen 0.05%', dosage: 'Topical', frequency: '1-0-1', duration: '5 days' },
          ],
          advice: 'Avoid harsh soaps and synthetic clothes.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    }
  };

  return (
    <PatientLayout>
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Digital Health Records & Prescriptions
          </h1>
          <p className="text-xs text-slate-500">
            Secure digital copies of doctor prescriptions, diagnostic reports, and medical bills.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
          {(['PRESCRIPTIONS', 'REPORTS', 'BILLS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'PRESCRIPTIONS' && '📄 Prescriptions'}
              {tab === 'REPORTS' && '🔬 Lab Reports'}
              {tab === 'BILLS' && '🧾 Bills'}
            </button>
          ))}
        </div>

        {activeTab === 'PRESCRIPTIONS' ? (
          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <Card key={rx.id} className="p-4 space-y-3 border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="brand" className="mb-1">{rx.prescriptionCode}</Badge>
                    <h3 className="font-extrabold text-slate-900 text-base">{rx.doctorName}</h3>
                    <p className="text-xs text-brand-700 font-semibold">{rx.doctorSpecialty}</p>
                    <p className="text-[11px] text-slate-500">{rx.hospitalName}</p>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {new Date(rx.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                  <div><strong>Diagnosis:</strong> {rx.diagnosis}</div>
                  {rx.advice && <div><strong>Advice:</strong> {rx.advice}</div>}
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-bold">{rx.medicines?.length || 2} Medicines Prescribed</span>
                  <Button size="sm" onClick={() => window.print()}>
                    🖨️ View / Download PDF
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8 text-xs text-slate-500 space-y-2">
            <div>🔬 No diagnostic lab reports uploaded yet.</div>
            <p className="text-[11px] text-slate-400">Reports uploaded by diagnostic labs will appear here automatically.</p>
          </Card>
        )}
      </div>
    </PatientLayout>
  );
}
