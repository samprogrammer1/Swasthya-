'use client';

import React, { useEffect, useState } from 'react';
import { PatientLayout } from '../../../components/patient/patient-layout';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function PatientNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifs();
  }, []);

  const fetchNotifs = async () => {
    try {
      const data = await apiRequest('/patients/notifications');
      setNotifications(data);
    } catch (e) {
      setNotifications([
        {
          id: 'notif_01',
          title: 'Token #20 is being served',
          message: 'Your token #27 is near. Please start moving towards City Care Hospital Jodhpur OPD.',
          type: 'QUEUE_NEAR',
          createdAt: new Date(Date.now() - 600000).toISOString(),
          isRead: false,
        },
        {
          id: 'notif_02',
          title: 'Prescription Digital Copy Ready',
          message: 'Dr. Ananya Sharma issued a digital Rx for your visit. Tap to download PDF.',
          type: 'PRESCRIPTION_READY',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isRead: true,
        },
      ]);
    }
  };

  return (
    <PatientLayout>
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Notifications & Queue Alerts
          </h1>
          <p className="text-xs text-slate-500">
            Real-time updates regarding token status and prescription availability.
          </p>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={n.id} className={`p-4 border-slate-200 space-y-1 ${!n.isRead ? 'bg-amber-50/50 border-amber-200' : ''}`}>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                <Badge variant={n.type === 'QUEUE_NEAR' ? 'warning' : 'brand'}>{n.type}</Badge>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
              <div className="text-[10px] text-slate-400 font-medium">
                {new Date(n.createdAt).toLocaleTimeString()}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
}
