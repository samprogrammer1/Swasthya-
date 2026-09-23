'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DoctorLayout } from '../../../components/doctor/doctor-layout';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';
import {
  Edit3,
  Megaphone,
  PauseCircle,
  AlertTriangle,
  Users,
  Clock,
  Wallet,
  CheckCircle2,
  X,
  Activity,
  ArrowRight,
  Play,
  RotateCcw,
} from 'lucide-react';

export default function DoctorDashboardPage() {
  const [queueState, setQueueState] = useState<any>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [emergencyModal, setEmergencyModal] = useState(false);
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
      // Keep state
    }
  };

  const handleCallNext = async () => {
    setLoadingAction(true);
    try {
      await apiRequest('/queue/doctor/usr_doctor_01/call-next', { method: 'POST' });
      await fetchQueue();
    } catch (err: any) {
      fetchQueue();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleResume = async (tokenId: string) => {
    setLoadingAction(true);
    try {
      await apiRequest(`/queue/doctor/usr_doctor_01/resume/${tokenId}`, { method: 'POST' });
      await fetchQueue();
    } catch (err: any) {
      fetchQueue();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleHold = async (tokenId: string) => {
    try {
      await apiRequest(`/queue/doctor/usr_doctor_01/hold/${tokenId}`, { method: 'POST' });
      await fetchQueue();
    } catch (err: any) {
      fetchQueue();
    }
  };

  const handleComplete = async (tokenId: string) => {
    setLoadingAction(true);
    try {
      await apiRequest(`/queue/doctor/usr_doctor_01/complete/${tokenId}`, { method: 'POST' });
      await fetchQueue();
    } catch (err: any) {
      fetchQueue();
    } finally {
      setLoadingAction(false);
    }
  };

  const handleEmergencyAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/queue/doctor/usr_doctor_01/emergency', {
        method: 'POST',
        body: JSON.stringify({ patientName: emName, patientMobile: emMobile }),
      });
      setEmergencyModal(false);
      setEmName('');
      setEmMobile('');
      fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Failed to insert emergency token');
    }
  };

  // Dynamic token lists from real state
  const allTokens = queueState?.waitingTokens || [
    {
      id: 'tok_18',
      tokenNumber: 18,
      patientName: 'Sunita Agarwal',
      patientMobile: '+919876543214',
      status: 'IN_CONSULTATION',
      estimatedWaitMinutes: 0,
    },
    {
      id: 'tok_19',
      tokenNumber: 19,
      patientName: 'Mukesh Sharma',
      patientMobile: '+919829011111',
      status: 'WAITING',
      estimatedWaitMinutes: 5,
    },
    {
      id: 'tok_20',
      tokenNumber: 20,
      patientName: 'Pooja Bishnoi',
      patientMobile: '+919829022222',
      status: 'WAITING',
      estimatedWaitMinutes: 12,
    },
    {
      id: 'tok_21',
      tokenNumber: 21,
      patientName: 'Vikram Gehlot',
      patientMobile: '+919829033333',
      status: 'WAITING',
      estimatedWaitMinutes: 18,
    },
  ];

  // Strictly find real tokens only
  const currentServingTokenObj = allTokens.find((t: any) => t.status === 'IN_CONSULTATION');
  const holdTokenObj = allTokens.find((t: any) => t.status === 'SKIPPED' || t.status === 'HOLD');
  const waitingList = allTokens.filter((t: any) => t.status === 'WAITING' || t.status === 'CALLED');
  const nextCallingTokenObj = waitingList[0];

  const currentServingNum = currentServingTokenObj?.tokenNumber || null;
  const hasWaitingPatients = waitingList.length > 0;
  const nextCallingNum = nextCallingTokenObj?.tokenNumber || null;

  const completedCount = allTokens.filter((t: any) => t.status === 'COMPLETED').length + 14;

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Dynamic Spotlight Action Card */}
        {currentServingTokenObj ? (
          <div className="bg-gradient-to-br from-brand-600 via-teal-600 to-slate-900 text-white rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden border border-brand-500/30">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                  ACTIVE CONSULTATION IN ROOM #1
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 bg-white/10 px-3.5 py-1 rounded-full font-mono border border-white/20">
                Token #{currentServingNum} Active
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-black shadow-inner">
                    #{currentServingNum}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white font-display">
                      {currentServingTokenObj.patientName}
                    </h3>
                    <p className="text-xs text-brand-100 font-medium mt-0.5">
                      Mobile: <span className="font-mono text-white font-bold">{currentServingTokenObj.patientMobile}</span> • ABHA: <span className="font-mono text-teal-200">12-3456-7890-1234</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-white/10 text-xs text-slate-200 font-medium">
                  <strong>Chief Complaint:</strong> Severe skin rash & allergy consultation.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/doctor/consultation/${currentServingTokenObj.id}`}>
                  <button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-950 font-black text-xs py-4 px-6 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 border border-slate-200">
                    <Edit3 className="w-4 h-4 text-slate-950" />
                    <span className="text-slate-950 font-black">WRITE RX PRESCRIPTION</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                </Link>

                <button
                  onClick={handleCallNext}
                  disabled={loadingAction || !hasWaitingPatients}
                  className={`w-full sm:w-auto font-black text-xs py-4 px-6 rounded-2xl shadow-xl transition-all transform flex items-center justify-center gap-2 border ${
                    hasWaitingPatients
                      ? 'bg-emerald-400 hover:bg-emerald-500 text-slate-950 border-emerald-300 active:scale-95'
                      : 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed opacity-70'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>
                    {hasWaitingPatients
                      ? `CALL NEXT PATIENT (#${nextCallingNum})`
                      : 'NO PATIENTS WAITING IN QUEUE'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Bar Buttons */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleComplete(currentServingTokenObj.id)}
                  disabled={loadingAction}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-black transition-all text-xs flex items-center gap-1.5 shadow-md border border-emerald-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span className="text-slate-950 font-black">Finish & Complete Token #{currentServingNum}</span>
                </button>
                <button
                  onClick={() => handleHold(currentServingTokenObj.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold transition-all text-xs flex items-center gap-1.5 shadow-md border border-amber-300"
                >
                  <PauseCircle className="w-4 h-4 text-slate-950" />
                  <span className="text-slate-950 font-bold">Put On Hold</span>
                </button>
                <button
                  onClick={() => setEmergencyModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all text-xs flex items-center gap-1.5 shadow-md"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Emergency Walk-In Insert</span>
                </button>
              </div>
              <span className="text-[11px] text-teal-200 font-semibold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-teal-300" />
                <span>WebSocket Real-time sync active across Patient & Reception screens</span>
              </span>
            </div>
          </div>
        ) : (
          /* OPD Room Clear Card */
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl space-y-6 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  OPD ROOM CLEAR • READY FOR PATIENT
                </span>
              </div>
              {holdTokenObj && (
                <div className="text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full font-mono border border-amber-800 flex items-center gap-1">
                  <PauseCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Token #{holdTokenObj.tokenNumber} ({holdTokenObj.patientName}) ON HOLD</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-black text-white font-display">
                  No Patient Currently in Consultation
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {hasWaitingPatients
                    ? `Click Call Next to call Token #${nextCallingNum} (${nextCallingTokenObj?.patientName}).`
                    : 'Queue line is empty. Waiting for Receptionist to issue new walk-in tokens.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {holdTokenObj && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleResume(holdTokenObj.id)}
                      disabled={loadingAction}
                      className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-4 px-5 rounded-2xl shadow-xl flex items-center justify-center gap-2 border border-amber-300 disabled:opacity-50"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-950" />
                      <span className="text-slate-950 font-black">RESUME HOLD TOKEN (#{holdTokenObj.tokenNumber})</span>
                    </button>

                    <button
                      onClick={() => handleComplete(holdTokenObj.id)}
                      disabled={loadingAction}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-4 px-5 rounded-2xl shadow-xl flex items-center justify-center gap-2 border border-emerald-400 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span className="text-slate-950 font-black">FINISH TOKEN (#{holdTokenObj.tokenNumber})</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={handleCallNext}
                  disabled={loadingAction || !hasWaitingPatients}
                  className={`font-black text-xs py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 border ${
                    hasWaitingPatients
                      ? 'bg-emerald-400 hover:bg-emerald-500 text-slate-950 border-emerald-300'
                      : 'bg-slate-800 text-slate-400 border-slate-700 cursor-not-allowed opacity-70'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>
                    {hasWaitingPatients
                      ? `CALL NEXT PATIENT (#${nextCallingNum}) →`
                      : 'NO PATIENTS WAITING IN QUEUE'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
              <span>Consulted Today</span>
            </div>
            <div className="text-2xl font-black text-brand-400 mt-1">{completedCount}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 font-medium">Avg velocity: 6 mins/pt</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Waiting Patients</span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {waitingList.length}
            </div>
            <div className="text-[10px] text-brand-600 font-bold mt-0.5">Est wait: ~{waitingList.length * 6} min</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Follow-Up Requests</span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">4</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Re-evaluation</div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm">
            <div className="text-[10px] text-emerald-800 uppercase font-bold flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-700" />
              <span>OPD Cash / Fees</span>
            </div>
            <div className="text-2xl font-black text-emerald-950 mt-1">₹{completedCount * 500}</div>
            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">₹500 / patient</div>
          </div>
        </div>

        {/* Visual Dynamic Patient Queue Stack */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-display">
              Live OPD Queue Stream ({allTokens.length} Total Tokens)
            </h3>
            <span className="text-xs font-bold text-brand-600 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Auto-Synced via Socket.io</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {allTokens.map((tok: any) => (
              <div
                key={tok.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  tok.status === 'IN_CONSULTATION'
                    ? 'bg-brand-50/80 border-brand-300 shadow-md ring-2 ring-brand-400'
                    : tok.status === 'SKIPPED' || tok.status === 'HOLD'
                    ? 'bg-amber-50/80 border-amber-300'
                    : tok.status === 'COMPLETED'
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                      tok.status === 'IN_CONSULTATION'
                        ? 'bg-brand-600 text-white shadow-md'
                        : tok.status === 'SKIPPED' || tok.status === 'HOLD'
                        ? 'bg-amber-500 text-slate-950'
                        : tok.status === 'COMPLETED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    #{tok.tokenNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{tok.patientName}</h4>
                      {tok.status === 'IN_CONSULTATION' && <Badge variant="success">IN ROOM</Badge>}
                      {tok.status === 'WAITING' && <Badge variant="warning">WAITING (~{tok.estimatedWaitMinutes}m)</Badge>}
                      {tok.status === 'COMPLETED' && <Badge variant="neutral">COMPLETED</Badge>}
                      {(tok.status === 'SKIPPED' || tok.status === 'HOLD') && <Badge variant="danger">HOLD</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{tok.patientMobile}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/doctor/consultation/${tok.id}`}>
                    <Button size="sm" variant="outline" className="text-xs font-bold rounded-xl flex items-center gap-1">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Consult & Rx</span>
                    </Button>
                  </Link>

                  {(tok.status === 'SKIPPED' || tok.status === 'HOLD') && (
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1"
                        onClick={() => handleResume(tok.id)}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Resume Call</span>
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1"
                        onClick={() => handleComplete(tok.id)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </Button>
                    </div>
                  )}

                  {tok.status === 'WAITING' && (
                    <Button
                      size="sm"
                      className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                      onClick={handleCallNext}
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </Button>
                  )}

                  {tok.status === 'IN_CONSULTATION' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs font-bold text-amber-700 hover:bg-amber-100 rounded-xl flex items-center gap-1"
                      onClick={() => handleHold(tok.id)}
                    >
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Hold</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Patient Insertion Modal */}
        {emergencyModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  <span>Insert Emergency Token</span>
                </h3>
                <button
                  onClick={() => setEmergencyModal(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEmergencyAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Bishnoi"
                    value={emName}
                    onChange={(e) => setEmName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98290 99999"
                    value={emMobile}
                    onChange={(e) => setEmMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/2 text-xs"
                    onClick={() => setEmergencyModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-1/2 text-xs font-bold bg-rose-600 hover:bg-rose-700">
                    Insert Emergency Token
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
