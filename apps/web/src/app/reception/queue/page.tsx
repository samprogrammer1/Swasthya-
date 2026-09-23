'use client';

import React, { useEffect, useState } from 'react';
import { ReceptionLayout } from '../../../components/reception/reception-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function ReceptionQueuePage() {
  const [queueState, setQueueState] = useState<any>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const data = await apiRequest('/queue/doctor/usr_doctor_01');
      setQueueState(data);
    } catch (e) {
      // Static fallback
    }
  };

  const handleCallNext = async () => {
    try {
      await apiRequest('/queue/doctor/usr_doctor_01/call-next', { method: 'POST' });
      fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <ReceptionLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Desk Queue Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live token monitoring for Dr. Ananya Sharma OPD Desk.
            </p>
          </div>
          <Button size="lg" onClick={handleCallNext}>
            📣 Call Next Patient (#19)
          </Button>
        </div>

        {/* Serving Banner */}
        <Card className="bg-slate-900 text-white p-6 border-slate-800 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400 uppercase font-semibold">Currently Serving</div>
            <div className="text-4xl font-black text-brand-400 mt-1">#{queueState?.currentlyServingToken || 18}</div>
            <div className="text-sm font-bold text-white mt-1">Sunita Agarwal</div>
          </div>
          <Badge variant="success" className="py-1 px-3">IN CONSULTATION</Badge>
        </Card>

        {/* Queue Table */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <CardHeader title="Live Waiting Tokens" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Token #</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Est Wait Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queueState?.waitingTokens?.map((tok: any) => (
                  <tr key={tok.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-brand-600 text-base">#{tok.tokenNumber}</td>
                    <td className="p-4 font-bold text-slate-900">{tok.patientName}</td>
                    <td className="p-4 font-mono text-slate-600">{tok.patientMobile}</td>
                    <td className="p-4">
                      {tok.status === 'IN_CONSULTATION' && <Badge variant="success">IN CONSULTATION</Badge>}
                      {tok.status === 'WAITING' && <Badge variant="warning">WAITING</Badge>}
                      {tok.status === 'COMPLETED' && <Badge variant="neutral">COMPLETED</Badge>}
                    </td>
                    <td className="p-4 text-right font-bold text-slate-700">
                      ~{tok.estimatedWaitMinutes} Mins
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </ReceptionLayout>
  );
}
