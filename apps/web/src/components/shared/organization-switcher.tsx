'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api-client';

export const OrganizationSwitcher: React.FC<{ doctorId?: string }> = ({ doctorId = 'usr_doctor_01' }) => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string>('org_city_care_jodhpur');

  useEffect(() => {
    fetchAffiliations();
  }, [doctorId]);

  const fetchAffiliations = async () => {
    try {
      const data = await apiRequest(`/organizations/doctor/${doctorId}/affiliations`);
      setOrganizations(data);
    } catch (e) {
      setOrganizations([
        { id: 'org_city_care_jodhpur', name: 'City Care Hospital Jodhpur', type: 'HOSPITAL' },
        { id: 'org_sharma_clinic', name: 'Sharma Skin & Laser Clinic', type: 'CLINIC' },
      ]);
    }
  };

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  return (
    <div className="flex items-center gap-2 bg-slate-800/90 p-2 rounded-xl border border-slate-700 text-xs">
      <span className="text-slate-400 font-semibold hidden sm:inline">Active Context:</span>
      <select
        value={activeOrgId}
        onChange={(e) => setActiveOrgId(e.target.value)}
        className="bg-slate-900 text-white border border-slate-700 rounded-lg px-2.5 py-1 font-bold text-xs focus:outline-none focus:border-brand-500"
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.type === 'HOSPITAL' ? '🏥' : '⚕️'} {org.name}
          </option>
        ))}
      </select>
    </div>
  );
};
