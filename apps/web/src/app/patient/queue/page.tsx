'use client';

import React, { useEffect, useState } from 'react';
import { PatientLayout } from '../../../components/patient/patient-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function PatientLiveQueuePage() {
  const [queueState, setQueueState] = useState<any>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const data = await apiRequest('/queue/doctor/usr_doctor_01');
      setQueueState(data);
    } catch (e) {
      // Fallback preview
    }
  };

  const currentlyServing = queueState?.currentlyServingToken || 18;
  const myToken = 27;
  const patientsAhead = Math.max(0, myToken - currentlyServing - 1);
  const estWaitMins = patientsAhead * 6;
  const progressPercent = Math.min(100, Math.round(((currentlyServing - 1) / (myToken - 1)) * 100));

  return (
    <PatientLayout>
      <div className="space-y-5">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              OPD Live Queue Tracker
            </h1>
            <p className="text-xs text-slate-500">
              Live updates directly from doctor & reception desk backend.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={fetchQueue}>
            🔄 Refresh Queue
          </Button>
        </div>

        {/* Live Notification Alert Box */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
          <div className="text-2xl">🔔</div>
          <div>
            <div className="font-bold">Token #{currentlyServing} is currently being served</div>
            <div className="text-[11px] text-amber-800">
              Your turn is near. Please start moving towards <strong>City Care Hospital OPD Desk 2</strong>.
            </div>
          </div>
        </div>

        {/* Big Live Queue Display Board */}
        <Card className="bg-slate-900 text-white p-6 border-slate-800 space-y-5 shadow-2xl text-center">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span>Dr. Ananya Sharma (Dermatologist)</span>
            <span className="text-emerald-400 font-bold">• LIVE QUEUE ACTIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Currently Serving</div>
              <div className="text-4xl font-black text-brand-400 mt-1">#{currentlyServing}</div>
              <div className="text-[10px] text-slate-400 mt-1">Inside Consultation Room</div>
            </div>

            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Your OPD Token</div>
              <div className="text-4xl font-black text-white mt-1">#{myToken}</div>
              <div className="text-[10px] text-brand-300 font-semibold mt-1">Code: SW-027</div>
            </div>
          </div>

          {/* Queue Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Queue Velocity Progress</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-brand-600 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 text-xs">
            <div>
              <span className="text-slate-400 block">Patients Ahead:</span>
              <span className="font-extrabold text-white text-base">{patientsAhead} Patients</span>
            </div>
            <div>
              <span className="text-slate-400 block">Estimated Wait:</span>
              <span className="font-extrabold text-brand-400 text-base">~{estWaitMins} Mins</span>
            </div>
          </div>
        </Card>

        {/* Hospital Address Card */}
        <Card className="p-4 space-y-2 border-slate-200 text-xs">
          <div className="font-bold text-slate-900 text-sm">City Care Hospital Jodhpur</div>
          <div className="text-slate-600">Near Chopasni Road, Jodhpur, Rajasthan 342003</div>
          <div className="text-slate-500">OPD Consultation Room 104 • Ground Floor</div>
        </Card>
      </div>
    </PatientLayout>
  );
}
