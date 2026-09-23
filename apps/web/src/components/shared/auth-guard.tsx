'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../providers/auth-provider';
import { UserRole } from '@swasthya/config';
import Link from 'next/link';
import { Lock, ShieldAlert, Sparkles, ChevronRight, UserCheck, Activity } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredRoleName?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles,
  requiredRoleName = 'Authorized Portal',
}) => {
  const { user, isLoading, loginAsDemoUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-2xl animate-pulse shadow-xl shadow-brand-500/30">
          <Activity className="w-7 h-7" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-800">Verifying Swasthya+ Security Credentials...</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">Validating JWT session token & RBAC permissions</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-500 via-teal-400 to-indigo-500"></div>
          
          <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2">
              Authentication Required
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight">
              Login Needed for {requiredRoleName}
            </h2>
            <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
              You must sign in with a verified account before accessing <code className="text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold border border-brand-200">{pathname}</code>.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/25 transition-all transform active:scale-98"
            >
              <span>Sign In with Mobile OTP</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400 bg-white px-3 tracking-widest">
                Quick Demo Login (One-Click)
              </div>
            </div>

            {allowedRoles && allowedRoles.length > 0 && (
              <div className="grid grid-cols-1 gap-2 text-left">
                {allowedRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      loginAsDemoUser(role).then(() => {
                        router.push(pathname);
                      });
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-300 text-xs font-semibold text-slate-800 flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-brand-600" />
                      <span>Access as <strong>{role.replace('_', ' ')}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-brand-600 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Instant Login</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some((role) => user.roles.includes(role));
    if (!hasAllowedRole) {
      return (
        <div className="max-w-lg mx-auto py-12 px-4">
          <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 to-rose-500"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                Insufficient Role Rights
              </span>
              <h2 className="text-2xl font-black text-slate-900 font-display">
                Access Restricted
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Logged in as <strong>{user.fullName}</strong> (<span className="uppercase text-brand-600 font-bold">{user.roles.join(', ')}</span>). This profile does not hold permissions for <strong>{requiredRoleName}</strong>.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  const targetRole = allowedRoles[0];
                  loginAsDemoUser(targetRole).then(() => {
                    router.push(pathname);
                  });
                }}
                className="w-full px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Switch Account to {allowedRoles[0].replace('_', ' ')} Role</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link
                href="/login"
                className="block text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2"
              >
                Log out and sign in with a different account
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
