'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../providers/auth-provider';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { UserRole } from '@swasthya/config';

interface PatientLayoutProps {
  children: React.ReactNode;
}

export const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, loginAsDemoUser } = useAuth();

  const isPatient = user?.roles.includes(UserRole.PATIENT);

  const navTabs = [
    { label: 'Home', href: '/patient', icon: '🏠' },
    { label: 'Doctors', href: '/patient/doctors', icon: '🩺' },
    { label: 'Live Queue', href: '/patient/queue', icon: '🔢', badge: '#27' },
    { label: 'My Tokens', href: '/patient/tokens', icon: '🎟️' },
    { label: 'Records', href: '/patient/prescriptions', icon: '📁' },
  ];

  return (
    <div className="max-w-md mx-auto space-y-5 pb-20">
      {/* Mobile Patient Header */}
      <div className="glass-panel rounded-2xl p-4 flex justify-between items-center border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-brand-500/20">
            SA
          </div>
          <div>
            <div className="text-xs text-slate-500">Good Morning 👋</div>
            <div className="font-extrabold text-slate-900 text-sm">
              {user?.fullName || 'Sunita Agarwal'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/patient/notifications" className="relative p-2 bg-slate-100 rounded-xl text-slate-700 hover:bg-slate-200">
            🔔
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </Link>
          <Link href="/patient/family" className="p-2 bg-slate-100 rounded-xl text-slate-700 hover:bg-slate-200 text-xs font-bold">
            👨‍👩‍👧
          </Link>
        </div>
      </div>

      {!isPatient && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-brand-900">
          <span>Viewing in Patient Preview Mode</span>
          <Button size="sm" variant="outline" className="text-[11px] py-1" onClick={() => loginAsDemoUser(UserRole.PATIENT)}>
            Switch Patient Demo
          </Button>
        </div>
      )}

      {/* Main Body */}
      <main className="space-y-5">{children}</main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 max-w-md mx-auto flex items-center justify-around py-2 px-1 shadow-lg">
        {navTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[10px] font-bold transition-all relative ${
                isActive ? 'text-brand-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
