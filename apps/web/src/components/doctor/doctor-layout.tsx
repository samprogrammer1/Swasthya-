'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../providers/auth-provider';
import { UserRole, OPDSessionStatus } from '@swasthya/config';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { apiRequest } from '../../lib/api-client';
import {
  Stethoscope,
  Activity,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Play,
  Pause,
  Square,
  Zap,
  Edit3,
  Pill,
} from 'lucide-react';

interface DoctorLayoutProps {
  children: React.ReactNode;
}

export const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, loginAsDemoUser } = useAuth();
  const [sessionStatus, setSessionStatus] = useState<OPDSessionStatus>(OPDSessionStatus.OPEN);
  const [queueState, setQueueState] = useState<any>(null);

  const isDoctor = user?.roles.includes(UserRole.DOCTOR) || user?.roles.includes(UserRole.SUPER_ADMIN);
  const doctorId = user?.id || 'usr_doctor_01';

  useEffect(() => {
    fetchQueueState();
  }, [doctorId]);

  const fetchQueueState = async () => {
    try {
      const data = await apiRequest(`/queue/doctor/${doctorId}`);
      setQueueState(data);
      setSessionStatus(data.sessionStatus);
    } catch (e) {
      setSessionStatus(OPDSessionStatus.OPEN);
    }
  };

  const handleToggleStatus = async (newStatus: OPDSessionStatus) => {
    try {
      await apiRequest(`/queue/doctor/${doctorId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setSessionStatus(newStatus);
    } catch (e) {
      setSessionStatus(newStatus);
    }
  };

  const appTabs = [
    { label: 'Live Queue', href: '/doctor/dashboard', activePath: '/doctor/dashboard', icon: Zap },
    { label: 'Consultation', href: '/doctor/consultation/tok_18', activePath: '/doctor/consultation', icon: Edit3 },
    { label: 'Prescriptions', href: '/doctor/prescriptions', activePath: '/doctor/prescriptions', icon: Pill },
    { label: 'Patients', href: '/doctor/patients', activePath: '/doctor/patients', icon: Users },
    { label: 'Schedule', href: '/doctor/schedule', activePath: '/doctor/schedule', icon: Calendar },
    { label: 'Telemetry', href: '/doctor/reports', activePath: '/doctor/reports', icon: BarChart3 },
  ];

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      {/* App Header Card - Phone Friendly */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-brand-500/30">
              <Stethoscope className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white font-display">Dr. Ananya Sharma</h2>
                <Badge variant="success" className="py-0.5 px-2 text-[10px]">Verified OPD</Badge>
              </div>
              <p className="text-xs text-slate-300">Dermatologist • City Care Hospital Jodhpur</p>
            </div>
          </div>

          {/* OPD Session Toggle */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80">
            <button
              onClick={() => handleToggleStatus(OPDSessionStatus.OPEN)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                sessionStatus === OPDSessionStatus.OPEN
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>OPD OPEN</span>
            </button>
            <button
              onClick={() => handleToggleStatus(OPDSessionStatus.PAUSED)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                sessionStatus === OPDSessionStatus.PAUSED
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>PAUSE</span>
            </button>
            <button
              onClick={() => handleToggleStatus(OPDSessionStatus.CLOSED)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                sessionStatus === OPDSessionStatus.CLOSED
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>END</span>
            </button>
          </div>
        </div>

        {/* Live Serving Banner Badge */}
        <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Serving Now</span>
            <span className="text-2xl font-black text-brand-400">#{queueState?.currentlyServingToken || 18}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Waiting in Line</span>
            <div className="text-sm font-extrabold text-emerald-400">{queueState?.totalWaiting || 8} Patients</div>
          </div>
        </div>
      </div>

      {!isDoctor && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-3 flex items-center justify-between text-xs text-brand-900">
          <span>Doctor Preview Mode • Logged in: <strong>{user?.fullName || 'Guest'}</strong></span>
          <Button size="sm" variant="outline" onClick={() => loginAsDemoUser(UserRole.DOCTOR)}>
            Switch to Doctor Account
          </Button>
        </div>
      )}

      {/* Horizontal App Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80">
        {appTabs.map((tab) => {
          const isActive = pathname.startsWith(tab.activePath);
          const Icon = tab.icon;
          return (
            <Link key={tab.href} href={tab.href}>
              <button
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            </Link>
          );
        })}
      </div>

      {/* Main App Canvas */}
      <main className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
        {children}
      </main>

      {/* Mobile Bottom Fixed App Bar (Phone Experience) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-slate-900 text-white border-t border-slate-800 p-2 z-50 flex justify-around items-center">
        <Link href="/doctor/dashboard" className="flex flex-col items-center gap-1 text-[10px] font-bold text-brand-400">
          <Zap className="w-5 h-5" />
          <span>Queue</span>
        </Link>
        <Link href="/doctor/consultation/tok_18" className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <Edit3 className="w-5 h-5" />
          <span>Consult</span>
        </Link>
        <Link href="/doctor/prescriptions" className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <Pill className="w-5 h-5" />
          <span>Rx List</span>
        </Link>
        <Link href="/doctor/patients" className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <Users className="w-5 h-5" />
          <span>Patients</span>
        </Link>
      </div>
    </div>
  );
};
