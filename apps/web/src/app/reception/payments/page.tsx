'use client';

import React, { useEffect, useState } from 'react';
import { ReceptionLayout } from '../../../components/reception/reception-layout';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function ReceptionPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const data = await apiRequest('/reception/payments');
      setPayments(data);
    } catch (e) {
      setPayments([
        {
          id: 'pay_01',
          tokenNumber: 18,
          patientName: 'Sunita Agarwal',
          patientMobile: '+919876543214',
          doctorName: 'Dr. Ananya Sharma',
          amount: 500,
          paymentMethod: 'UPI',
          status: 'SUCCESS',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'pay_02',
          tokenNumber: 19,
          patientName: 'Mukesh Sharma',
          patientMobile: '+919829011111',
          doctorName: 'Dr. Ananya Sharma',
          amount: 500,
          paymentMethod: 'CASH',
          status: 'SUCCESS',
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ]);
    }
  };

  return (
    <ReceptionLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Reception OPD Fee Collection Register
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time tracking of Cash, UPI, and Card collections at the reception desk.
          </p>
        </div>

        <Card className="overflow-hidden p-0 border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Receipt #</th>
                  <th className="p-4">Token #</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-800">{p.id}</td>
                    <td className="p-4 font-black text-brand-600">#{p.tokenNumber}</td>
                    <td className="p-4 font-bold text-slate-900">{p.patientName}</td>
                    <td className="p-4 font-semibold text-slate-700">{p.doctorName}</td>
                    <td className="p-4 font-extrabold text-slate-900 text-sm">₹{p.amount}</td>
                    <td className="p-4">
                      <Badge variant={p.paymentMethod === 'CASH' ? 'warning' : 'brand'}>{p.paymentMethod}</Badge>
                    </td>
                    <td className="p-4 text-slate-500">{new Date(p.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </ReceptionLayout>
  );
}
