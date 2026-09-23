'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DoctorLayout } from '../../../components/doctor/doctor-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function DoctorQueuePage() {
  const [queueState, setQueueState] = useState<any>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emName, setEmName] = useState('');
  const [emMobile, setEmMobile] = useState('');

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const data = await apiRequest('/queue/doctor/usr_doctor_01');
      setQueueState(data);
    } catch (e) {
      // Keep static preview
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

  const handleSkip = async (tokenId: string) => {
    try {
      await apiRequest(`/queue/doctor/usr_doctor_01/skip/${tokenId}`, { method: 'POST' });
      fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleAddEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/queue/doctor/usr_doctor_01/emergency', {
        method: 'POST',
        body: JSON.stringify({ patientName: emName, patientMobile: emMobile }),
      });
      setShowEmergencyModal(false);
      setEmName('');
      setEmMobile('');
      fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Emergency token insertion failed');
    }
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              OPD Live Queue Workspace
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Backend-controlled token ordering. Call next, skip absent patients, or insert emergency cases.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={() => setShowEmergencyModal(true)}>
              🚨 Emergency Walk-in
            </Button>
            <Button size="sm" onClick={handleCallNext}>
              📣 Call Next (#19)
            </Button>
          </div>
        </div>

        {/* Currently Serving Highlight Box */}
        <Card className="bg-slate-900 text-white p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span className="font-bold text-brand-400">CURRENTLY IN CONSULTATION</span>
            <span className="text-emerald-400 font-semibold">• LIVE OPD SESSION</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Active Token</div>
              <div className="text-4xl font-black text-brand-400 mt-1">
                #{queueState?.currentlyServingToken || 18}
              </div>
              <div className="text-lg font-bold text-white mt-1">Sunita Agarwal</div>
              <div className="text-xs text-slate-300">+91 98765 43214 • Female, 38 Yrs</div>
            </div>

            <div className="flex gap-2">
              <Link href="/doctor/consultation/tok_18">
                <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold">
                  Write Digital Rx →
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Full Queue List */}
        <Card className="p-0 border-slate-200 overflow-hidden">
          <CardHeader title="Waiting & Called Tokens" subtitle="Real-time list of tokens" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Token #</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Queue Action Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queueState?.waitingTokens?.map((tok: any) => (
                  <tr key={tok.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-brand-600 text-base">
                      #{tok.tokenNumber}
                    </td>
                    <td className="p-4 font-bold text-slate-900">{tok.patientName}</td>
                    <td className="p-4 font-mono text-slate-600">{tok.patientMobile}</td>
                    <td className="p-4">
                      {tok.status === 'IN_CONSULTATION' && <Badge variant="success">IN CONSULTATION</Badge>}
                      {tok.status === 'WAITING' && <Badge variant="warning">WAITING (~{tok.estimatedWaitMinutes}m)</Badge>}
                      {tok.status === 'COMPLETED' && <Badge variant="neutral">COMPLETED</Badge>}
                      {tok.status === 'SKIPPED' && <Badge variant="danger">SKIPPED</Badge>}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleSkip(tok.id)}>
                        Skip / Hold
                      </Button>
                      <Link href={`/doctor/consultation/${tok.id}`}>
                        <Button size="sm">Start Consultation</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Emergency Modal */}
        {showEmergencyModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">Insert Emergency Walk-in Token</h3>
              <p className="text-xs text-slate-500">
                Emergency tokens are inserted immediately at the top of the waiting queue by the backend engine.
              </p>
              <form onSubmit={handleAddEmergency} className="space-y-3">
                <Input
                  label="Patient Name"
                  placeholder="e.g. Ramesh Chandra (Emergency)"
                  value={emName}
                  onChange={(e) => setEmName(e.target.value)}
                  required
                />
                <Input
                  label="Patient Mobile"
                  placeholder="+91 98290 99999"
                  value={emMobile}
                  onChange={(e) => setEmMobile(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowEmergencyModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="danger">Insert at Front of Queue</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
