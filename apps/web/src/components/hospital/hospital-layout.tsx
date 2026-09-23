'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../providers/auth-provider';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { UserRole } from '@swasthya/config';
import {
  Building2,
  Building,
  Stethoscope,
  Ticket,
  BarChart3,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface HospitalLayoutProps {
  children: React.ReactNode;
}

export const HospitalLayout: React.FC<HospitalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, loginAsDemoUser } = useAuth();

  const isHospitalAdmin =
    user?.roles.includes(UserRole.HOSPITAL_ADMIN) ||
    user?.roles.includes(UserRole.CLINIC_ADMIN) ||
    user?.roles.includes(UserRole.SUPER_ADMIN) ||
    user?.roles.includes(UserRole.ADMIN);

  const appTabs = [
    { label: 'Hospital Overview', href: '/hospital/dashboard', activePath: '/hospital/dashboard', icon: Building2 },
    { label: 'OPD Departments', href: '/hospital/departments', activePath: '/hospital/departments', icon: Building },
    { label: 'Attached Doctors', href: '/hospital/doctors', activePath: '/hospital/doctors', icon: Stethoscope },
    { label: 'Reception Desks', href: '/hospital/receptionists', activePath: '/hospital/receptionists', icon: Ticket },
    { label: 'Live Queue Monitor', href: '/hospital/queues', activePath: '/hospital/queues', icon: BarChart3 },
  ];

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-brand-500/20">
            <Building2 className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-white font-display">City Care Hospital Jodhpur</h2>
              <Badge variant="brand">Multi-Specialty</Badge>
            </div>
            <p className="text-xs text-slate-300">Hospital Admin Portal • Chopasni Road, Jodhpur</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="py-1 px-3">
            6 Departments Active
          </Badge>
        </div>
      </div>

      {!isHospitalAdmin && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-3 flex items-center justify-between text-xs text-brand-900">
          <span>Viewing in Hospital Admin Preview Mode</span>
          <Button size="sm" variant="outline" onClick={() => loginAsDemoUser(UserRole.ADMIN)}>
            Switch to Admin Context
          </Button>
        </div>
      )}

      {/* Horizontal App Category Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200/80">
        {appTabs.map((tab) => {
          const isActive = pathname.startsWith(tab.activePath);
          const Icon = tab.icon;
          return (
            <Link key={tab.href} href={tab.href}>
              <button
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
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

      {/* Main Workspace Canvas */}
      <main className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
        {children}
      </main>

      {/* Mobile Fixed Bottom App Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-slate-900 text-white border-t border-slate-800 p-2 z-50 flex justify-around items-center">
        <Link href="/hospital/dashboard" className="flex flex-col items-center gap-1 text-[10px] font-bold text-brand-400">
          <Building2 className="w-5 h-5" />
          <span>Overview</span>
        </Link>
        <Link href="/hospital/doctors" className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <Stethoscope className="w-5 h-5" />
          <span>Doctors</span>
        </Link>
        <Link href="/hospital/receptionists" className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <Ticket className="w-5 h-5" />
          <span>Desks</span>
        </Link>
        <Link href="/hospital/queues" className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <BarChart3 className="w-5 h-5" />
          <span>Queues</span>
        </Link>
      </div>
    </div>
  );
};
