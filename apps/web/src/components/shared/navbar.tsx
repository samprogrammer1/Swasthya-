'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../providers/auth-provider';
import { UserRole } from '@swasthya/config';
import {
  Zap,
  User,
  LogOut,
  Stethoscope,
  Building2,
  Ticket,
  ChevronDown,
  Shield,
  Activity,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, loginAsDemoUser } = useAuth();
  const pathname = usePathname();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Admin Panel', href: '/admin/dashboard', role: UserRole.ADMIN },
    { name: 'Doctor OPD', href: '/doctor/dashboard', role: UserRole.DOCTOR },
    { name: 'Reception Desk', href: '/reception/dashboard', role: UserRole.RECEPTIONIST },
    { name: 'Patient Portal', href: '/patient', role: UserRole.PATIENT },
    { name: 'Hospital Admin', href: '/hospital/dashboard', role: UserRole.HOSPITAL_ADMIN },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-teal-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-brand-500/20 group-hover:scale-105 transition-all">
              S+
            </div>
            <div>
              <span className="font-display font-black text-xl text-slate-900 tracking-tight flex items-center gap-1">
                Swasthya<span className="text-brand-600">+</span>
                <span className="text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-mono font-bold uppercase border border-brand-200 ml-1">
                  Jodhpur
                </span>
              </span>
              <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest -mt-1">
                Healthcare Operating Platform
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-brand-50 text-brand-700 shadow-xs border border-brand-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Quick Switch Role Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-brand-400" />
                <span>Role Switch</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showRoleMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowRoleMenu(false)}
                >
                  <div className="text-[10px] font-bold uppercase text-brand-400 px-2.5 py-1 tracking-wider">
                    Instant Demo Switch
                  </div>
                  <button
                    onClick={() => {
                      loginAsDemoUser(UserRole.SUPER_ADMIN);
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-slate-800 font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-brand-400" />
                      <span>Super Admin</span>
                    </div>
                    <span className="text-[10px] text-brand-400 font-mono">Full</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemoUser(UserRole.DOCTOR);
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-slate-800 font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                      <span>Doctor OPD</span>
                    </div>
                    <span className="text-[10px] text-teal-400 font-mono">Dr. Ananya</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemoUser(UserRole.RECEPTIONIST);
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-slate-800 font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Ticket className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reception Desk</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono">Tokens</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemoUser(UserRole.PATIENT);
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-slate-800 font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Patient Profile</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Live Queue</span>
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemoUser(UserRole.HOSPITAL_ADMIN);
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-slate-800 font-semibold flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Hospital Admin</span>
                    </div>
                    <span className="text-[10px] text-purple-400 font-mono">Dept Roster</span>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{user.fullName}</div>
                  <div className="text-[10px] font-bold text-brand-600 uppercase tracking-wide">
                    {user.roles[0]?.replace('_', ' ')}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login / OTP</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
