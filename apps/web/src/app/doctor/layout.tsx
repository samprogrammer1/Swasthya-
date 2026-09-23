'use client';

import React from 'react';
import { AuthGuard } from '../../components/shared/auth-guard';
import { UserRole } from '@swasthya/config';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard
      allowedRoles={[UserRole.DOCTOR, UserRole.SUPER_ADMIN]}
      requiredRoleName="Doctor OPD Workspace"
    >
      {children}
    </AuthGuard>
  );
}
