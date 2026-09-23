'use client';

import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../../components/admin/admin-layout';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { apiRequest } from '../../../lib/api-client';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await apiRequest('/admin/reviews');
      setReviews(data);
    } catch (e) {
      setReviews([
        {
          id: 'rev_01',
          doctorName: 'Dr. Ananya Sharma',
          patientName: 'Sunita Agarwal',
          rating: 5,
          comment: 'Extremely good doctor! She listened to my skin allergy problem patiently and explained treatment clearly.',
          categories: ['Good Doctor', 'Listened Carefully', 'Explained Clearly'],
          status: 'PUBLISHED',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'rev_02',
          doctorName: 'Dr. Ramesh Purohit',
          patientName: 'Rajesh Verma',
          rating: 4,
          comment: 'Short waiting time at reception desk, doctor consultation was quick and effective.',
          categories: ['Short Waiting Time', 'Friendly Staff'],
          status: 'PUBLISHED',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    }
  };

  const handleModerate = async (reviewId: string, status: 'PUBLISHED' | 'HIDDEN' | 'FLAGGED') => {
    try {
      await apiRequest(`/admin/reviews/${reviewId}/moderate`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchReviews();
    } catch (err: any) {
      alert(err.message || 'Moderation action failed');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Review & Rating Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Moderate inappropriate feedback while preventing arbitrary manipulation of legitimate ratings.
          </p>
        </div>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <Card key={rev.id} className="p-5 flex flex-col md:flex-row justify-between gap-4 border-slate-200">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-amber-500 text-sm font-bold">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">Doctor: {rev.doctorName}</span>
                  <Badge variant={rev.status === 'PUBLISHED' ? 'success' : 'warning'}>{rev.status}</Badge>
                </div>
                <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                <div className="text-[11px] text-slate-400">
                  By <strong className="text-slate-600">{rev.patientName}</strong> • {new Date(rev.createdAt).toLocaleDateString()}
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {rev.categories?.map((cat: string) => (
                    <Badge key={cat} variant="neutral" className="text-[10px]">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-2 min-w-[140px]">
                {rev.status !== 'PUBLISHED' && (
                  <Button size="sm" variant="success" onClick={() => handleModerate(rev.id, 'PUBLISHED')}>
                    Restore Review
                  </Button>
                )}
                {rev.status !== 'HIDDEN' && (
                  <Button size="sm" variant="outline" className="text-rose-600 border-rose-200" onClick={() => handleModerate(rev.id, 'HIDDEN')}>
                    Hide Review
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
