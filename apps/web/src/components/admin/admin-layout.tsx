'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../providers/auth-provider';
import { UserRole } from '@swasthya/config';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { user, loginAsDemoUser } = useAuth();

  const isAuthorizedAdmin =
    user?.roles.includes(UserRole.SUPER_ADMIN) ||
    user?.roles.includes(UserRole.ADMIN);

  const navItems = [
    { label: 'Overview Dashboard', href: '/admin/dashboard', icon: '📊' },
    { label: 'Doctor Management', href: '/admin/doctors', icon: '🩺' },
    { label: 'Doctor Verification', href: '/admin/verification', icon: '🛡️' },
    { label: 'Hospitals', href: '/admin/hospitals', icon: '🏥' },
    { label: 'Clinics', href: '/admin/clinics', icon: '⚕️' },
    { label: 'Patients', href: '/admin/patients', icon: '👥' },
    { label: 'Review Moderation', href: '/admin/reviews', icon: '⭐' },
    { label: 'Audit Trail', href: '/admin/audit-logs', icon: '📜' },
    { label: 'Platform Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-[85vh] flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-white rounded-2xl p-5 shadow-xl border border-slate-800 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-500 animate-pulse" />
              <h2 className="font-display font-extrabold text-lg text-white tracking-wide">
                Admin Control
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Swasthya+ Healthcare Operations</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Session Widget */}
        <div className="mt-8 pt-4 border-t border-slate-800 space-y-3">
          {isAuthorizedAdmin ? (
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <div className="text-[10px] text-brand-400 uppercase font-bold tracking-wider">
                Active Session
              </div>
              <div className="text-xs font-bold text-white truncate">{user?.fullName}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{user?.roles.join(', ')}</div>
            </div>
          ) : (
            <div className="bg-amber-950/40 border border-amber-800/50 p-3 rounded-xl text-xs space-y-2">
              <p className="text-amber-300 font-medium">Elevated Role Required</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs py-1"
                onClick={() => loginAsDemoUser(UserRole.SUPER_ADMIN)}
              >
                Switch to Admin Demo
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        {children}
      </main>
    </div>
  );
}
