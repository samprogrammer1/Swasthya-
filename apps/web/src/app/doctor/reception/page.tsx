'use client';

import React, { useEffect, useState } from 'react';
import { DoctorLayout } from '../../../components/doctor/doctor-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function DoctorReceptionPage() {
  const [receptionists, setReceptionists] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');

  useEffect(() => {
    fetchReceptionists();
  }, []);

  const fetchReceptionists = async () => {
    try {
      const data = await apiRequest('/doctors/me/receptionists');
      setReceptionists(data);
    } catch (e) {
      setReceptionists([
        {
          id: 'usr_reception_01',
          fullName: 'Vikram Singh',
          mobile: '+919876543213',
          email: 'reception.citycare@swasthya.in',
          assignedClinic: 'City Care Hospital OPD Desk 2',
          isAssigned: true,
        },
      ]);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/doctors/me/receptionists', {
        method: 'POST',
        body: JSON.stringify({ fullName, mobile }),
      });
      setShowAddModal(false);
      setFullName('');
      setMobile('');
      fetchReceptionists();
    } catch (err: any) {
      alert(err.message || 'Failed to add receptionist');
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await apiRequest(`/doctors/me/receptionists/${id}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ isAssigned: !currentStatus }),
      });
      fetchReceptionists();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Reception Staff Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add and manage receptionist accounts authorized to issue OPD tokens for your clinic desk.
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            + Add Receptionist Staff
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {receptionists.map((rec) => (
            <Card key={rec.id} className="p-5 flex justify-between items-center border-slate-200">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm">{rec.fullName}</div>
                <div className="text-xs text-slate-600">{rec.mobile} • {rec.email}</div>
                <div className="text-[11px] text-slate-400">Desk: {rec.assignedClinic}</div>
              </div>
              <div>
                <Button
                  size="sm"
                  variant={rec.isAssigned ? 'outline' : 'success'}
                  onClick={() => handleToggle(rec.id, rec.isAssigned)}
                >
                  {rec.isAssigned ? 'Disable Desk Access' : 'Enable Access'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">Add Receptionist Staff</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <Input
                  label="Receptionist Full Name"
                  placeholder="e.g. Vikram Singh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Mobile Number"
                  placeholder="+91 98765 43213"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Issue Receptionist Account</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
