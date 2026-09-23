'use client';

import React from 'react';
import { HospitalLayout } from '../../../components/hospital/hospital-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

export default function HospitalQueuesPage() {
  const departmentQueues = [
    {
      department: 'Dermatology & Cosmetology',
      doctor: 'Dr. Ananya Sharma',
      desk: 'OPD Desk 2',
      servingToken: 18,
      nextCallingToken: 19,
      waitingCount: 8,
      status: 'OPEN',
    },
    {
      department: 'Orthopedics & Joint Care',
      doctor: 'Dr. Ramesh Purohit',
      desk: 'OPD Desk 4',
      servingToken: 11,
      nextCallingToken: 12,
      waitingCount: 5,
      status: 'OPEN',
    },
    {
      department: 'Pediatrics & Child Care',
      doctor: 'Dr. Kirti Bhandari',
      desk: 'OPD Desk 1',
      servingToken: 22,
      nextCallingToken: 23,
      waitingCount: 12,
      status: 'OPEN',
    },
  ];

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cross-Department Live OPD Queue Monitor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry monitoring token velocity across all active hospital OPD desks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {departmentQueues.map((q, idx) => (
            <Card key={idx} className="bg-slate-900 text-white border-slate-800 p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <Badge variant="brand" className="mb-1">{q.desk}</Badge>
                  <h3 className="font-extrabold text-white text-base">{q.department}</h3>
                  <p className="text-xs text-slate-300">{q.doctor}</p>
                </div>
                <Badge variant="success">OPEN</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Serving</div>
                  <div className="text-3xl font-black text-brand-400 mt-1">#{q.servingToken}</div>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Next</div>
                  <div className="text-3xl font-black text-white mt-1">#{q.nextCallingToken}</div>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 flex justify-between">
                <span>Waiting Patients: <strong className="text-white">{q.waitingCount}</strong></span>
                <span>Avg Speed: <strong className="text-brand-300">6 min/pt</strong></span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </HospitalLayout>
  );
}
