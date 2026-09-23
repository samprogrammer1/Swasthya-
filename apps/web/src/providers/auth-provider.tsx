'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser, AuthResponse } from '@swasthya/types';
import { UserRole, Permission } from '@swasthya/config';
import { apiRequest } from '../lib/api-client';

interface AuthContextType {
  user: IUser | null;
  accessToken: string | null;
  isLoading: boolean;
  loginWithOtp: (mobile: string, otp: string) => Promise<AuthResponse>;
  loginAsDemoUser: (role: UserRole) => Promise<AuthResponse>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset demo accounts for reviewer quick-role switching
const DEMO_ACCOUNTS: Record<UserRole, { mobile: string; name: string }> = {
  [UserRole.SUPER_ADMIN]: { mobile: '+919876543210', name: 'Sameer Khan (Super Admin)' },
  [UserRole.ADMIN]: { mobile: '+919876543211', name: 'Rajesh Verma (Platform Admin)' },
  [UserRole.DOCTOR]: { mobile: '+919876543212', name: 'Dr. Ananya Sharma (Dermatologist)' },
  [UserRole.RECEPTIONIST]: { mobile: '+919876543213', name: 'Vikram Singh (Receptionist)' },
  [UserRole.PATIENT]: { mobile: '+919876543214', name: 'Sunita Agarwal (Patient)' },
  [UserRole.HOSPITAL_ADMIN]: { mobile: '+919876543211', name: 'Hospital Admin' },
  [UserRole.CLINIC_ADMIN]: { mobile: '+919876543212', name: 'Clinic Admin' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('swasthya_access_token');
    const savedUser = localStorage.getItem('swasthya_user');

    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('swasthya_user');
      }
    }
    setIsLoading(false);
  }, []);

  const loginWithOtp = async (mobile: string, otp: string): Promise<AuthResponse> => {
    const response: AuthResponse = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, otp }),
    });

    setAccessToken(response.accessToken);
    setUser(response.user);
    localStorage.setItem('swasthya_access_token', response.accessToken);
    localStorage.setItem('swasthya_refresh_token', response.refreshToken);
    localStorage.setItem('swasthya_user', JSON.stringify(response.user));

    return response;
  };

  const loginAsDemoUser = async (role: UserRole): Promise<AuthResponse> => {
    const demoInfo = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS[UserRole.PATIENT];
    return loginWithOtp(demoInfo.mobile, '123456');
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('swasthya_access_token');
    localStorage.removeItem('swasthya_refresh_token');
    localStorage.removeItem('swasthya_user');
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.roles.includes(role) || false;
  };

  const hasPermission = (permission: Permission): boolean => {
    if (user?.roles.includes(UserRole.SUPER_ADMIN)) return true;
    // Basic frontend check placeholder
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        loginWithOtp,
        loginAsDemoUser,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
