'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/admin/admin-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    platformName: 'Swasthya+',
    cityPilot: 'Jodhpur, Rajasthan',
    maxTokensPerPatientDaily: 3,
    platformFeePercent: 5,
    autoApproveVerifiedDoctors: false,
    enableAbdmIntegration: false,
    enableNotificationsSMS: true,
    supportContactPhone: '+91-291-2600100',
    supportContactEmail: 'support@swasthya.in',
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiRequest('/admin/settings');
      setSettings(data);
    } catch (e) {
      // Keep default
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings),
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Platform Settings & Feature Flags
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure OPD token limits, platform fees, ABDM sandbox integration, and notifications.
            </p>
          </div>
          {isSaved && <Badge variant="success" className="py-1 px-3">✓ Settings Saved</Badge>}
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <Card className="space-y-4 border-slate-200">
            <CardHeader title="OPD Token & Operations Config" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Max Daily Tokens Per Patient"
                type="number"
                value={settings.maxTokensPerPatientDaily}
                onChange={(e) => setSettings({ ...settings, maxTokensPerPatientDaily: Number(e.target.value) })}
              />
              <Input
                label="Platform Convenience Fee (%)"
                type="number"
                value={settings.platformFeePercent}
                onChange={(e) => setSettings({ ...settings, platformFeePercent: Number(e.target.value) })}
              />
            </div>
          </Card>

          <Card className="space-y-4 border-slate-200">
            <CardHeader title="Feature Flags & ABDM Integrations" />
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">ABDM / ABHA Integration Engine</div>
                  <div className="text-[11px] text-slate-500">Enable government health stack connectivity in production.</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableAbdmIntegration}
                  onChange={(e) => setSettings({ ...settings, enableAbdmIntegration: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Auto-Approve Medical Council Licenses</div>
                  <div className="text-[11px] text-slate-500">Automatically mark registered doctors as verified (Bypasses verification queue).</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoApproveVerifiedDoctors}
                  onChange={(e) => setSettings({ ...settings, autoApproveVerifiedDoctors: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded"
                />
              </label>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="submit" size="lg">
              Save Platform Configuration
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
