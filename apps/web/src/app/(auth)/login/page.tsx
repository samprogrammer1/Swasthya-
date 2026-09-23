'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../providers/auth-provider';
import { Card, CardHeader } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { UserRole } from '@swasthya/config';
import {
  Lock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
  Zap,
  ChevronRight,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const { loginWithOtp, loginAsDemoUser } = useAuth();

  const [mobile, setMobile] = useState('+919876543212');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const navigateAfterAuth = (roles: UserRole[]) => {
    if (redirectTarget) {
      router.push(redirectTarget);
      return;
    }

    if (roles.includes(UserRole.SUPER_ADMIN) || roles.includes(UserRole.ADMIN)) {
      router.push('/admin/dashboard');
    } else if (roles.includes(UserRole.DOCTOR)) {
      router.push('/doctor/dashboard');
    } else if (roles.includes(UserRole.RECEPTIONIST)) {
      router.push('/reception/dashboard');
    } else if (roles.includes(UserRole.HOSPITAL_ADMIN) || roles.includes(UserRole.CLINIC_ADMIN)) {
      router.push('/hospital/dashboard');
    } else {
      router.push('/patient');
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/v1/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      setInfoMessage(data.message || `OTP sent to ${mobile}`);
      setStep('OTP');
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const authRes = await loginWithOtp(mobile, otp);
      navigateAfterAuth(authRes.user.roles);
    } catch (err: any) {
      setError(err.message || 'OTP Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const authRes = await loginAsDemoUser(role);
      navigateAfterAuth(authRes.user.roles);
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6">
      <Card className="shadow-2xl border-slate-200/90 rounded-3xl overflow-hidden relative">
        <div className="h-1.5 bg-gradient-to-r from-brand-600 via-teal-400 to-indigo-600"></div>

        <div className="p-6">
          <CardHeader
            title="Swasthya+ Portal Login"
            subtitle="Mobile OTP Verification & Role Access Engine"
          />

          {redirectTarget && (
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block">Sign in required to proceed</strong>
                <span className="text-[11px] text-amber-700">
                  After authentication, you will be automatically redirected to <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">{redirectTarget}</code>.
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {infoMessage && (
            <div className="p-3.5 mb-4 rounded-2xl bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{infoMessage} (Demo OTP: <strong className="font-bold">123456</strong>)</span>
            </div>
          )}

          {step === 'MOBILE' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <Input
                label="Mobile Number"
                placeholder="+91 98765 43210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
              <Button type="submit" className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2" isLoading={isLoading}>
                <span>Request OTP</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-xs text-slate-600 mb-2">
                OTP sent to <span className="font-bold text-slate-900">{mobile}</span>
              </div>
              <Input
                label="Enter 6-Digit OTP"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/3 text-xs"
                  onClick={() => setStep('MOBILE')}
                >
                  Change
                </Button>
                <Button type="submit" className="w-2/3 text-xs font-bold flex items-center justify-center gap-1.5" isLoading={isLoading}>
                  <span>Verify & Access</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>

      {/* Quick Demo Switcher */}
      <Card className="bg-slate-900 text-white border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-brand-400" />
            <span>Quick Reviewer Demo Switch</span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">Instant JWT</span>
        </div>
        <div className="space-y-2.5">
          <button
            onClick={() => handleQuickDemo(UserRole.SUPER_ADMIN)}
            className="w-full text-left p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium flex justify-between items-center transition-all group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-brand-300">Super Admin</div>
              <div className="text-[10px] text-slate-400">Sameer Khan • Full Platform Control</div>
            </div>
            <Badge variant="brand">Platform Admin</Badge>
          </button>
          
          <button
            onClick={() => handleQuickDemo(UserRole.DOCTOR)}
            className="w-full text-left p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium flex justify-between items-center transition-all group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-brand-300">OPD Doctor</div>
              <div className="text-[10px] text-slate-400">Dr. Ananya Sharma • Dermatology Jodhpur</div>
            </div>
            <Badge variant="info">Doctor Portal</Badge>
          </button>

          <button
            onClick={() => handleQuickDemo(UserRole.RECEPTIONIST)}
            className="w-full text-left p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium flex justify-between items-center transition-all group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-brand-300">Receptionist Desk</div>
              <div className="text-[10px] text-slate-400">Vikram Singh • OPD Walk-In & Tokens</div>
            </div>
            <Badge variant="warning">Desk Portal</Badge>
          </button>

          <button
            onClick={() => handleQuickDemo(UserRole.PATIENT)}
            className="w-full text-left p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium flex justify-between items-center transition-all group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-brand-300">Patient Profile</div>
              <div className="text-[10px] text-slate-400">Sunita Agarwal • Live Queue Tracker</div>
            </div>
            <Badge variant="success">Patient App</Badge>
          </button>

          <button
            onClick={() => handleQuickDemo(UserRole.HOSPITAL_ADMIN)}
            className="w-full text-left p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium flex justify-between items-center transition-all group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-brand-300">Hospital Admin</div>
              <div className="text-[10px] text-slate-400">City Care Hospital • Dept Roster</div>
            </div>
            <Badge variant="brand">Hospital Admin</Badge>
          </button>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-xs text-slate-500 font-bold">
          Loading Swasthya+ Auth Interface...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
