'use client';

import React from 'react';
import { AuthGuard } from '../../components/shared/auth-guard';
import { UserRole } from '@swasthya/config';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard
      allowedRoles={[
        UserRole.PATIENT,
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.RECEPTIONIST,
      ]}
      requiredRoleName="Patient OPD Portal"
    >
      {children}
    </AuthGuard>
  );
}
