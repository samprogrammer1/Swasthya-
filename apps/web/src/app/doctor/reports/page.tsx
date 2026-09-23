'use client';

import React from 'react';
import { DoctorLayout } from '../../../components/doctor/doctor-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

export default function DoctorReportsPage() {
  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            OPD Telemetry & Revenue Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analytics on consultation volume, walk-in vs online token distribution, and daily/weekly earnings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-slate-900 text-white">
            <div className="text-[11px] uppercase font-bold text-slate-400">Monthly Consultations</div>
            <div className="text-3xl font-extrabold mt-1">342</div>
            <div className="text-[10px] text-emerald-400 mt-1">↑ +18% from last month</div>
          </Card>

          <Card className="p-4 border-slate-200">
            <div className="text-[11px] uppercase font-bold text-slate-500">Walk-in vs Online Token Ratio</div>
            <div className="text-3xl font-extrabold text-brand-600 mt-1">65% / 35%</div>
            <div className="text-[10px] text-slate-500 mt-1">High walk-in ratio at hospital desk</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-teal-900 to-emerald-950 text-white">
            <div className="text-[11px] uppercase font-bold text-teal-300">Monthly Revenue Collection</div>
            <div className="text-3xl font-extrabold mt-1">₹1,71,000</div>
            <div className="text-[10px] text-teal-200 mt-1">Average 14 patients/day</div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Consultation Breakdown by Category" subtitle="Top skin complaints & dermatological diagnoses in Jodhpur" />
          <div className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Allergic Dermatitis & Monsoon Rashes</span>
                <span>142 Cases (41%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-600 h-full w-[41%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Acne Vulgaris & Cosmetology Procedures</span>
                <span>98 Cases (28%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-[28%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Fungal Infections & Tinea</span>
                <span>65 Cases (19%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full w-[19%]" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DoctorLayout>
  );
}
