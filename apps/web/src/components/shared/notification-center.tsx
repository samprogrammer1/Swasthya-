'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api-client';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiRequest('/notifications');
      setNotifications(data);
    } catch (e) {
      setNotifications([
        {
          id: 'notif_101',
          title: 'Token #20 is being served',
          message: 'Your token #27 is near. Please reach City Care Hospital OPD Desk 2.',
          event: 'TOKEN_NEAR',
          channel: 'SMS',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiRequest('/notifications/mark-all-read', { method: 'POST' });
      fetchNotifications();
    } catch (e) {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-extrabold text-slate-900 text-sm">Notifications & Alerts</h3>
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-bold text-brand-600 hover:underline"
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                  !n.isRead ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{n.title}</span>
                  <Badge variant={n.event === 'TOKEN_NEAR' ? 'warning' : 'brand'}>{n.channel || 'IN_APP'}</Badge>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
                <div className="text-[10px] text-slate-400">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
