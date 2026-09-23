import React from 'react';
import './globals.css';
import { AuthProvider } from '../providers/auth-provider';
import { Navbar } from '../components/shared/navbar';

export const metadata = {
  title: 'Swasthya+ — Production Healthcare Platform',
  description: 'OPD Token Booking, Live Queue Management, Doctor Workflow, & Healthcare Platform in Jodhpur, Rajasthan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 font-medium">
              © 2026 Swasthya+ Healthcare Operating Platform • Architected for Jodhpur & India
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
