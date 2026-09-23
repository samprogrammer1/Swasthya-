'use client';

import React, { useEffect, useState } from 'react';
import { DoctorLayout } from '../../../components/doctor/doctor-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function DoctorSchedulePage() {
  const [schedule, setSchedule] = useState<any>({
    opdDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opdStartTime: '09:00 AM',
    opdEndTime: '01:00 PM',
    tokenCapacityPerSession: 40,
    consultationFee: 500,
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const data = await apiRequest('/doctors/usr_doctor_01/schedule');
      setSchedule(data);
    } catch (e) {
      // Default
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/doctors/me/schedule', {
        method: 'PATCH',
        body: JSON.stringify(schedule),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save schedule');
    }
  };

  return (
    <DoctorLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              OPD Timings & Schedule Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure session operating hours, daily token capacity limit, and consultation fee.
            </p>
          </div>
          {isSaved && <Badge variant="success">✓ Schedule Updated</Badge>}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="space-y-4 border-slate-200">
            <CardHeader title="Session Timings" />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="OPD Start Time"
                value={schedule.opdStartTime}
                onChange={(e) => setSchedule({ ...schedule, opdStartTime: e.target.value })}
              />
              <Input
                label="OPD End Time"
                value={schedule.opdEndTime}
                onChange={(e) => setSchedule({ ...schedule, opdEndTime: e.target.value })}
              />
            </div>
          </Card>

          <Card className="space-y-4 border-slate-200">
            <CardHeader title="Capacity & Consultation Fee" />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Max OPD Token Capacity"
                type="number"
                value={schedule.tokenCapacityPerSession}
                onChange={(e) => setSchedule({ ...schedule, tokenCapacityPerSession: Number(e.target.value) })}
              />
              <Input
                label="Consultation Fee (₹)"
                type="number"
                value={schedule.consultationFee}
                onChange={(e) => setSchedule({ ...schedule, consultationFee: Number(e.target.value) })}
              />
            </div>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            Save OPD Schedule Configuration
          </Button>
        </form>
      </div>
    </DoctorLayout>
  );
}
