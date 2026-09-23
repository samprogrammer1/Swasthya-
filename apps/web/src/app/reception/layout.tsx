'use client';

import React from 'react';
import { AuthGuard } from '../../components/shared/auth-guard';
import { UserRole } from '@swasthya/config';

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard
      allowedRoles={[
        UserRole.RECEPTIONIST,
        UserRole.DOCTOR,
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
      ]}
      requiredRoleName="Reception Desk & OPD Queue"
    >
      {children}
    </AuthGuard>
  );
}
