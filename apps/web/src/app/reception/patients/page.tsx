'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReceptionLayout } from '../../../components/reception/reception-layout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function ReceptionPatientsPage() {
  const searchParams = useSearchParams();
  const openNew = searchParams.get('new');

  const [patients, setPatients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(openNew === 'true');

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('FEMALE');
  const [city, setCity] = useState('Jodhpur');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await apiRequest(`/reception/patients/search?q=${searchQuery}`);
      setPatients(data);
    } catch (e) {
      setPatients([
        {
          id: 'usr_patient_01',
          fullName: 'Sunita Agarwal',
          mobile: '+919876543214',
          email: 'sunita.agarwal@gmail.com',
          patientProfile: {
            gender: 'FEMALE',
            dateOfBirth: '1988-06-14',
            bloodGroup: 'B+',
            city: 'Jodhpur',
            state: 'Rajasthan',
          },
        },
      ]);
    }
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/reception/patients/walk-in', {
        method: 'POST',
        body: JSON.stringify({ fullName, mobile, gender, city }),
      });
      setShowAddModal(false);
      setFullName('');
      setMobile('');
      fetchPatients();
    } catch (err: any) {
      alert(err.message || 'Failed to create walk-in patient');
    }
  };

  return (
    <ReceptionLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Patient Search & Registration
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Search existing patient profiles by mobile or create instant walk-in accounts.
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            + Create Walk-In Patient
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Search by patient mobile number or full name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPatients()}
          />
          <Button variant="outline" onClick={fetchPatients}>
            Search
          </Button>
        </div>

        <Card className="overflow-hidden p-0 border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Mobile Number</th>
                  <th className="p-4">Gender & Location</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900 text-sm">{pat.fullName}</td>
                    <td className="p-4 font-mono font-bold text-slate-700">{pat.mobile}</td>
                    <td className="p-4 text-slate-600">
                      {pat.patientProfile?.gender || 'FEMALE'} • {pat.patientProfile?.city || 'Jodhpur'}
                    </td>
                    <td className="p-4 text-right">
                      <a href="/reception/token">
                        <Button size="sm">🎟️ Book Token</Button>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Walk-In Patient Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">Create New Walk-In Patient</h3>
              <form onSubmit={handleCreateWalkIn} className="space-y-3">
                <Input
                  label="Patient Full Name"
                  placeholder="e.g. Mukesh Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Mobile Number"
                  placeholder="+91 98290 11111"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <Input
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Walk-In Account</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ReceptionLayout>
  );
}
