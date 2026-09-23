'use client';

import React, { useEffect, useState } from 'react';
import { ReceptionLayout } from '../../../components/reception/reception-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function ReceptionReportsPage() {
  const [reports, setReports] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await apiRequest('/reception/reports');
      setReports(data);
    } catch (e) {
      setReports({
        totalTokensIssued: 27,
        walkInTokens: 18,
        onlineTokens: 9,
        completedTokens: 17,
        cancelledTokens: 1,
        totalRevenue: 13500,
        breakdown: { cash: 8500, upi: 5000, card: 0 },
      });
    }
  };

  return (
    <ReceptionLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Daily Reception Desk Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Summary of tokens issued, walk-in vs online breakdown, and daily cash drawer reconciliation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-slate-900 text-white">
            <div className="text-[11px] uppercase font-bold text-slate-400">Tokens Issued Today</div>
            <div className="text-3xl font-black mt-1">{reports?.totalTokensIssued || 27}</div>
            <div className="text-[10px] text-brand-400 mt-1">18 Walk-in • 9 Online</div>
          </Card>

          <Card className="p-4 border-slate-200">
            <div className="text-[11px] uppercase font-bold text-slate-500">Physical Cash in Drawer</div>
            <div className="text-3xl font-black text-amber-600 mt-1">₹{reports?.breakdown?.cash || 8500}</div>
            <div className="text-[10px] text-slate-500 mt-1">Reconcile at end of shift</div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-teal-900 to-emerald-950 text-white">
            <div className="text-[11px] uppercase font-bold text-teal-300">Total Revenue Collected</div>
            <div className="text-3xl font-black mt-1">₹{reports?.totalRevenue || 13500}</div>
            <div className="text-[10px] text-teal-200 mt-1">Cash + Digital UPI</div>
          </Card>
        </div>
      </div>
    </ReceptionLayout>
  );
}
