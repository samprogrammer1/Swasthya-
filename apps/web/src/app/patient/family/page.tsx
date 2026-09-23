'use client';

import React, { useEffect, useState } from 'react';
import { PatientLayout } from '../../../components/patient/patient-layout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function PatientFamilyPage() {
  const [family, setFamily] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [relation, setRelation] = useState<'FATHER' | 'MOTHER' | 'SPOUSE' | 'CHILD'>('FATHER');
  const [age, setAge] = useState(65);

  useEffect(() => {
    fetchFamily();
  }, []);

  const fetchFamily = async () => {
    try {
      const data = await apiRequest('/patients/family');
      setFamily(data);
    } catch (e) {
      setFamily([
        {
          id: 'fam_01',
          fullName: 'Rameshwar Agarwal',
          relation: 'FATHER',
          age: 65,
          gender: 'MALE',
        },
        {
          id: 'fam_02',
          fullName: 'Aarav Agarwal',
          relation: 'CHILD',
          age: 8,
          gender: 'MALE',
        },
      ]);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/patients/family', {
        method: 'POST',
        body: JSON.stringify({ fullName, relation, age }),
      });
      setShowAddModal(false);
      setFullName('');
      fetchFamily();
    } catch (err: any) {
      alert(err.message || 'Failed to add family member');
    }
  };

  return (
    <PatientLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Family Member Management
            </h1>
            <p className="text-xs text-slate-500">
              Manage OPD token bookings & health records for family members.
            </p>
          </div>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            + Add Member
          </Button>
        </div>

        <div className="space-y-3">
          {family.map((mem) => (
            <Card key={mem.id} className="p-4 flex justify-between items-center border-slate-200">
              <div>
                <div className="font-bold text-slate-900 text-sm">{mem.fullName}</div>
                <div className="text-xs text-slate-500">
                  Relation: <strong className="text-brand-700">{mem.relation}</strong> • {mem.age} Yrs
                </div>
              </div>
              <Badge variant="brand">Family Account</Badge>
            </Card>
          ))}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">Add Family Member</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <Input
                  label="Full Name"
                  placeholder="e.g. Rameshwar Agarwal"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Relation</label>
                  <select
                    value={relation}
                    onChange={(e: any) => setRelation(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs font-bold"
                  >
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="SPOUSE">Spouse</option>
                    <option value="CHILD">Child</option>
                  </select>
                </div>
                <Input
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Family Member</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
