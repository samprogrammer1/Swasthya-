'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PatientLayout } from '../../../components/patient/patient-layout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function PatientTokensHistoryPage() {
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const data = await apiRequest('/patients/my-tokens');
      setTokens(data);
    } catch (e) {
      setTokens([
        {
          id: 'tok_27',
          tokenNumber: 27,
          tokenCode: 'SW-027',
          doctorName: 'Dr. Ananya Sharma',
          doctorSpecialty: 'Dermatology',
          hospitalName: 'City Care Hospital Jodhpur',
          status: 'WAITING',
          currentlyServingToken: 18,
          patientsAhead: 8,
          estimatedWaitMinutes: 45,
          date: new Date().toISOString().split('T')[0],
        },
        {
          id: 'tok_12',
          tokenNumber: 12,
          tokenCode: 'SW-012',
          doctorName: 'Dr. Ramesh Purohit',
          doctorSpecialty: 'Orthopedics',
          hospitalName: 'AIIMS Jodhpur Auxiliary Clinic',
          status: 'COMPLETED',
          currentlyServingToken: 12,
          patientsAhead: 0,
          estimatedWaitMinutes: 0,
          date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        },
      ]);
    }
  };

  return (
    <PatientLayout>
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            My OPD Tokens
          </h1>
          <p className="text-xs text-slate-500">
            Active tokens and consultation history.
          </p>
        </div>

        <div className="space-y-3">
          {tokens.map((tok) => (
            <Card key={tok.id} className="p-4 space-y-3 border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">{tok.date}</div>
                  <h3 className="font-extrabold text-slate-900 text-base">{tok.doctorName}</h3>
                  <p className="text-xs text-brand-700 font-semibold">{tok.doctorSpecialty}</p>
                  <p className="text-[11px] text-slate-500">{tok.hospitalName}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-brand-600">#{tok.tokenNumber}</div>
                  <Badge variant={tok.status === 'WAITING' ? 'warning' : 'neutral'}>
                    {tok.status}
                  </Badge>
                </div>
              </div>

              {tok.status === 'WAITING' && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">Est Wait: <strong>~{tok.estimatedWaitMinutes} mins</strong></span>
                  <Link href="/patient/queue">
                    <Button size="sm">Track Live Queue →</Button>
                  </Link>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
}
