'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/admin/admin-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function AdminHospitalsPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const data = await apiRequest('/admin/hospitals');
      setHospitals(data);
    } catch (e) {
      setHospitals([
        {
          id: 'hosp_01',
          name: 'City Care Hospital Jodhpur',
          city: 'Jodhpur',
          address: 'Near Chopasni Road, Jodhpur, Rajasthan 342003',
          contactNumber: '+91-291-2645100',
          departments: ['Dermatology', 'Cardiology', 'Orthopedics', 'Pediatrics'],
          doctorsCount: 8,
          receptionistsCount: 3,
          status: 'ACTIVE',
        },
        {
          id: 'hosp_02',
          name: 'AIIMS Jodhpur Auxiliary Clinic',
          city: 'Jodhpur',
          address: 'Basni Industrial Area Phase-2, Jodhpur 342005',
          contactNumber: '+91-291-2740741',
          departments: ['Orthopedics', 'General Medicine', 'Neurology'],
          doctorsCount: 14,
          receptionistsCount: 5,
          status: 'ACTIVE',
        },
      ]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/hospitals', {
        method: 'POST',
        body: JSON.stringify({ name, city: 'Jodhpur', address, contactNumber }),
      });
      setShowAddModal(false);
      setName('');
      setAddress('');
      setContactNumber('');
      fetchHospitals();
    } catch (err: any) {
      alert(err.message || 'Failed to create hospital');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Hospital Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Registered multi-specialty hospitals and OPD facility centers in Jodhpur.
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            + Add New Hospital
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map((hosp) => (
            <Card key={hosp.id} className="space-y-4 border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{hosp.name}</h3>
                  <p className="text-xs text-slate-500">{hosp.address}</p>
                </div>
                <Badge variant="success">{hosp.status}</Badge>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>📞 <strong>Contact:</strong> {hosp.contactNumber}</div>
                <div>👨‍⚕️ <strong>Associated Doctors:</strong> {hosp.doctorsCount}</div>
                <div>🖥️ <strong>Reception Desks:</strong> {hosp.receptionistsCount}</div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                {hosp.departments.map((dept: string) => (
                  <Badge key={dept} variant="neutral" className="text-[10px]">
                    {dept}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">Add New Hospital</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <Input
                  label="Hospital Name"
                  placeholder="e.g. Goyal Hospital & Research Centre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Address in Jodhpur"
                  placeholder="e.g. 961/3, Residency Road, Jodhpur"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <Input
                  label="Contact Phone"
                  placeholder="+91-291-2432100"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Hospital</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
