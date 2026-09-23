'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../providers/auth-provider';
import { UserRole } from '@swasthya/config';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Building2,
  Ticket,
  Users,
  CreditCard,
  BarChart3,
  Search,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface ReceptionLayoutProps {
  children: React.ReactNode;
}

export const ReceptionLayout: React.FC<ReceptionLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, loginAsDemoUser } = useAuth();

  const isReceptionist =
    user?.roles.includes(UserRole.RECEPTIONIST) ||
    user?.roles.includes(UserRole.SUPER_ADMIN) ||
    user?.roles.includes(UserRole.ADMIN);

  const appTabs = [
    { label: 'Live OPD Queue', href: '/reception/dashboard', activePath: '/reception/dashboard', icon: Zap },
    { label: 'Issue Token', href: '/reception/token', activePath: '/reception/token', icon: Ticket },
    { label: 'Search & Register', href: '/reception/patients', activePath: '/reception/patients', icon: Search },
    { label: 'Fee Register', href: '/reception/payments', activePath: '/reception/payments', icon: CreditCard },
    { label: 'Desk Report', href: '/reception/reports', activePath: '/reception/reports', icon: BarChart3 },
  ];

  return (
    <div className="space-y-4 pb-20 sm:pb-8">
      {/* Reception Desk Header Card - Mobile App Style */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Building2 className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-white font-display">City Care Hospital Desk</h2>
              <Badge variant="warning" className="py-0.5 px-2 text-[10px]">Desk 2 Active</Badge>
            </div>
            <p className="text-xs text-slate-300">
              Staff: <strong>Vikram Singh</strong> • Shastri Nagar, Jodhpur
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/reception/token">
            <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs py-2.5 px-5 rounded-2xl shadow-lg shadow-amber-400/20 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-slate-950" />
              <span>ISSUE OPD TOKEN</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Button>
          </Link>
        </div>
      </div>

      {!isReceptionist && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-900">
          <span>Reception Desk Preview • Logged in: <strong>{user?.fullName || 'Guest'}</strong></span>
          <Button size="sm" variant="outline" onClick={() => loginAsDemoUser(UserRole.RECEPTIONIST)}>
            Switch to Receptionist Demo
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

      {/* Main App Workspace Canvas */}
      <main className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-sm">
        {children}
      </main>

      {/* Mobile Fixed Bottom App Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-slate-900 text-white border-t border-slate-800 p-2 z-50 flex justify-around items-center">
        <Link href="/reception/dashboard" className="flex flex-col items-center gap-1 text-[10px] font-bold text-amber-400">
          <Zap className="w-5 h-5" />
          <span>Queue</span>
        </Link>
        <Link href="/reception/token" className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <Ticket className="w-5 h-5" />
          <span>Token</span>
        </Link>
        <Link href="/reception/patients" className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <Search className="w-5 h-5" />
          <span>Search</span>
        </Link>
        <Link href="/reception/payments" className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
          <CreditCard className="w-5 h-5" />
          <span>Fees</span>
        </Link>
      </div>
    </div>
  );
};
