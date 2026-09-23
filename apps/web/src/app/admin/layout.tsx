'use client';

import React from 'react';
import { AuthGuard } from '../../components/shared/auth-guard';
import { UserRole } from '@swasthya/config';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard
      allowedRoles={[
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.HOSPITAL_ADMIN,
        UserRole.CLINIC_ADMIN,
      ]}
      requiredRoleName="Platform Admin Panel"
    >
      {children}
    </AuthGuard>
  );
}
