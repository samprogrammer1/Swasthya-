'use client';

import React, { useEffect, useState } from 'react';
import { HospitalLayout } from '../../../components/hospital/hospital-layout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function HospitalDepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [headDoctorName, setHeadDoctorName] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await apiRequest('/organizations/org_city_care_jodhpur');
      setDepartments(data.departments);
    } catch (e) {
      setDepartments([
        { id: 'dept_derm', name: 'Dermatology & Cosmetology', code: 'DERM', headDoctorName: 'Dr. Ananya Sharma', doctorsCount: 2, opdDeskCount: 2, status: 'ACTIVE' },
        { id: 'dept_ortho', name: 'Orthopedics & Joint Care', code: 'ORTHO', headDoctorName: 'Dr. Ramesh Purohit', doctorsCount: 3, opdDeskCount: 2, status: 'ACTIVE' },
        { id: 'dept_peds', name: 'Pediatrics & Child Health', code: 'PEDS', headDoctorName: 'Dr. Kirti Bhandari', doctorsCount: 2, opdDeskCount: 1, status: 'ACTIVE' },
      ]);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/organizations/org_city_care_jodhpur/departments', {
        method: 'POST',
        body: JSON.stringify({ name: deptName, code: deptCode, headDoctorName }),
      });
      setShowAddModal(false);
      setDeptName('');
      setDeptCode('');
      setHeadDoctorName('');
      fetchDepartments();
    } catch (err: any) {
      alert(err.message || 'Failed to add department');
    }
  };

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              OPD Departments & Specialty Desks
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure OPD departments, head consultants, and assigned desk tokens.
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            + Add New Department
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-5 space-y-3 border-slate-200">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="brand" className="mb-1">{dept.code}</Badge>
                  <h3 className="font-extrabold text-slate-900 text-base">{dept.name}</h3>
                </div>
                <Badge variant="success">{dept.status}</Badge>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>👨‍⚕️ <strong>Head Consultant:</strong> {dept.headDoctorName}</div>
                <div>🩺 <strong>Doctors Attached:</strong> {dept.doctorsCount}</div>
                <div>🛎️ <strong>OPD Desks:</strong> {dept.opdDeskCount} Desks</div>
              </div>
            </Card>
          ))}
        </div>

        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900">Add OPD Department</h3>
              <form onSubmit={handleAdd} className="space-y-3">
                <Input
                  label="Department Name"
                  placeholder="e.g. Cardiology & Heart Care"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  required
                />
                <Input
                  label="Department Code"
                  placeholder="CARD"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  required
                />
                <Input
                  label="Head Consultant Doctor"
                  placeholder="e.g. Dr. S. K. Mehta"
                  value={headDoctorName}
                  onChange={(e) => setHeadDoctorName(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Department</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </HospitalLayout>
  );
}
