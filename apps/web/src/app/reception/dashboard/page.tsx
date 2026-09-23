'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ReceptionLayout } from '../../../components/reception/reception-layout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';
import {
  Zap,
  Ticket,
  UserPlus,
  CreditCard,
  BarChart3,
  Search,
  Printer,
  ArrowRight,
} from 'lucide-react';

export default function ReceptionDashboardPage() {
  const [reports, setReports] = useState<any>(null);
  const [searchMobile, setSearchMobile] = useState('');

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
        {/* Instant Shopping-Style Search & Token Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-teal-600 to-slate-900 text-white rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-200 bg-white/10 px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 w-fit">
                <Zap className="w-3.5 h-3.5" />
                <span>FAST WALK-IN DESK</span>
              </span>
              <h2 className="text-2xl font-black text-white mt-2 font-display">
                Issue OPD Token in 3 Seconds
              </h2>
            </div>

            <Link href="/reception/token">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-slate-950 font-black text-sm py-3.5 px-6 rounded-2xl shadow-xl flex items-center gap-2">
                <Ticket className="w-4 h-4 text-slate-950" />
                <span>BOOK WALK-IN TOKEN (#28)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Button>
            </Link>
          </div>

          {/* Shopping-Style Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
            <input
              type="text"
              placeholder="Search patient by mobile number (+91 98290...) or ABHA ID..."
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 font-medium text-xs shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <Link href={`/reception/patients?search=${encodeURIComponent(searchMobile)}`}>
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs">
                Search
              </button>
            </Link>
          </div>
        </div>

        {/* 4 App-Like Action Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/reception/token">
            <Card className="p-4 bg-white hover:bg-amber-50 border-slate-200/90 hover:border-amber-300 transition-all rounded-2xl cursor-pointer shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Ticket className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-xs">Issue Token</div>
                <div className="text-[10px] text-slate-500">Walk-in OPD Receipt</div>
              </div>
            </Card>
          </Link>

          <Link href="/reception/patients?new=true">
            <Card className="p-4 bg-white hover:bg-teal-50 border-slate-200/90 hover:border-teal-300 transition-all rounded-2xl cursor-pointer shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5 text-teal-800" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-xs">Register Walk-In</div>
                <div className="text-[10px] text-slate-500">New patient profile</div>
              </div>
            </Card>
          </Link>

          <Link href="/reception/payments">
            <Card className="p-4 bg-white hover:bg-emerald-50 border-slate-200/90 hover:border-emerald-300 transition-all rounded-2xl cursor-pointer shadow-xs space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-xs">Collect ₹500 Fee</div>
                <div className="text-[10px] text-slate-500">Cash / UPI Register</div>
              </div>
            </Card>
          </Link>

          <Link href="/reception/reports">
            <Card className="p-4 bg-slate-900 text-white rounded-2xl cursor-pointer shadow-md space-y-2 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="font-extrabold text-white text-xs">Desk Report</div>
                <div className="text-[10px] text-slate-400">Total: ₹{reports?.totalRevenue || 13500}</div>
              </div>
            </Card>
          </Link>
        </div>

        {/* OPD Live Desk Stream (Order-Tracking Cards - NO Boring Tables!) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider font-display">
              Live Desk Queue Stream (Dr. Ananya Sharma)
            </h3>
            <span className="text-xs font-bold text-amber-600">Currently Serving #18</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[
              { token: 18, name: 'Sunita Agarwal', mobile: '+919876543214', status: 'IN CONSULTATION', fee: '₹500 Paid (UPI)' },
              { token: 19, name: 'Mukesh Sharma', mobile: '+919829011111', status: 'WAITING (5m)', fee: '₹500 Paid (Cash)' },
              { token: 20, name: 'Pooja Bishnoi', mobile: '+919829022222', status: 'WAITING (12m)', fee: '₹500 Paid (UPI)' },
              { token: 21, name: 'Vikram Gehlot', mobile: '+919829033333', status: 'WAITING (18m)', fee: '₹500 Pending' },
            ].map((tok) => (
              <div
                key={tok.token}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-sm">
                    #{tok.token}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{tok.name}</h4>
                      {tok.status.includes('IN CONSULTATION') ? (
                        <Badge variant="success">IN ROOM</Badge>
                      ) : (
                        <Badge variant="warning">{tok.status}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{tok.mobile} • {tok.fee}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/reception/token?id=${tok.token}`}>
                    <Button size="sm" variant="outline" className="text-xs font-bold rounded-xl flex items-center gap-1.5">
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReceptionLayout>
  );
}
