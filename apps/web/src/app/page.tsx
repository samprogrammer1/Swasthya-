'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../providers/auth-provider';
import { UserRole } from '@swasthya/config';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Sparkles,
  Stethoscope,
  Ticket,
  Activity,
  Shield,
  UserCheck,
  ChevronRight,
  BookOpen,
  Building2,
  Users,
  Clock,
} from 'lucide-react';

export default function HomePage() {
  const { user, loginAsDemoUser } = useAuth();

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-8 md:p-12 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Healthcare Platform Active</span>
            <span>•</span>
            <span>Jodhpur, Rajasthan Pilot</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Healthcare Operating Platform for India
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal">
            Powered by backend-owned <strong className="text-white">OPD Token + Live Queue Management</strong>, central identity RBAC, and doctor/receptionist workflow integration.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold flex items-center gap-2">
                <span>Access Platform Login</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <a
              href="http://localhost:4000/docs"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-medium text-sm transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Open Swagger API Docs</span>
            </a>
          </div>
        </div>
      </div>

      {/* Role Switcher Matrix for Reviewers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Interactive Role Simulator</h2>
            <p className="text-xs text-slate-500">Switch user roles instantly to test authenticated authorization guards.</p>
          </div>
          {user && (
            <Badge variant="success" className="py-1 px-3">
              Currently logged in as: {user.fullName} ({user.roles.join(', ')})
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Super Admin */}
          <Card className="hover:border-brand-500/50 transition-all flex flex-col justify-between">
            <div>
              <Badge variant="brand" className="mb-2">Phase 2 Ready</Badge>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-600" />
                <span>Super Admin</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Full platform control, doctor verification & audit logs.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold"
                onClick={() => loginAsDemoUser(UserRole.SUPER_ADMIN)}
              >
                Login as Super Admin
              </Button>
              <Link href="/admin/dashboard" className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-xs">View Admin Panel</Button>
              </Link>
            </div>
          </Card>

          {/* Admin */}
          <Card className="hover:border-brand-500/50 transition-all flex flex-col justify-between">
            <div>
              <Badge variant="brand" className="mb-2">Phase 2 Ready</Badge>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600" />
                <span>Platform Admin</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Manage hospital listings, doctor status & reviews.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold"
                onClick={() => loginAsDemoUser(UserRole.ADMIN)}
              >
                Login as Admin
              </Button>
              <Link href="/admin/dashboard" className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-xs">View Admin Panel</Button>
              </Link>
            </div>
          </Card>

          {/* Doctor */}
          <Card className="hover:border-brand-500/50 transition-all flex flex-col justify-between">
            <div>
              <Badge variant="info" className="mb-2">Doctor Portal</Badge>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <span>Doctor</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Dr. Ananya Sharma (Dermatologist, Jodhpur).</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold"
                onClick={() => loginAsDemoUser(UserRole.DOCTOR)}
              >
                Login as Doctor
              </Button>
              <Link href="/doctor/dashboard" className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-xs">Doctor Portal</Button>
              </Link>
            </div>
          </Card>

          {/* Receptionist */}
          <Card className="hover:border-brand-500/50 transition-all flex flex-col justify-between">
            <div>
              <Badge variant="warning" className="mb-2">Reception Desk</Badge>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Ticket className="w-4 h-4 text-amber-600" />
                <span>Receptionist</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Vikram Singh (City Care Hospital Jodhpur).</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold"
                onClick={() => loginAsDemoUser(UserRole.RECEPTIONIST)}
              >
                Login as Receptionist
              </Button>
              <Link href="/reception/dashboard" className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-xs">Reception Portal</Button>
              </Link>
            </div>
          </Card>

          {/* Patient */}
          <Card className="hover:border-brand-500/50 transition-all flex flex-col justify-between">
            <div>
              <Badge variant="success" className="mb-2">Patient App</Badge>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Patient</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">Sunita Agarwal (Token booking & queue track).</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold"
                onClick={() => loginAsDemoUser(UserRole.PATIENT)}
              >
                Login as Patient
              </Button>
              <Link href="/patient" className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-xs">Patient Portal</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* OPD Token & Live Queue Architecture Demonstration Card */}
      <Card className="border-brand-500/30 bg-gradient-to-r from-teal-50/50 via-white to-sky-50/50 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <Badge variant="brand" className="px-3 py-1">OPD Token Engine Model</Badge>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Backend-Driven Live Queue Architecture
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike legacy fixed slot appointment systems, Swasthya+ uses a dynamic OPD token system designed for Indian hospital realities.
            </p>
            <ul className="text-xs font-medium text-slate-700 space-y-1.5 list-disc list-inside">
              <li>Backend handles queue locks & sequence generation.</li>
              <li>Calculates live estimates based on doctor average consultation velocity.</li>
              <li>Broadcasts real-time updates via WebSockets to patients.</li>
            </ul>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl min-w-[280px] space-y-4 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span>Dr. Ananya Sharma OPD</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                <span>LIVE QUEUE</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Currently Serving</div>
                <div className="text-3xl font-black text-brand-400 mt-1">#18</div>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Your Token</div>
                <div className="text-3xl font-black text-white mt-1">#27</div>
              </div>
            </div>
            <div className="text-xs text-slate-300 flex justify-between bg-slate-800/50 p-2.5 rounded-lg">
              <span>Patients Ahead: <strong className="text-white">8</strong></span>
              <span>Est. Wait: <strong className="text-white">40–50 min</strong></span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
