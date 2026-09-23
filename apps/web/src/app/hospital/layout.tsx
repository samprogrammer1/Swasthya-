'use client';

import React from 'react';
import { AuthGuard } from '../../components/shared/auth-guard';
import { UserRole } from '@swasthya/config';

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard
      allowedRoles={[
        UserRole.HOSPITAL_ADMIN,
        UserRole.CLINIC_ADMIN,
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
      ]}
      requiredRoleName="Hospital Admin & Department Portal"
    >
      {children}
    </AuthGuard>
  );
}
