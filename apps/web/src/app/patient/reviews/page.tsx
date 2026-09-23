'use client';

import React, { useState } from 'react';
import { PatientLayout } from '../../../components/patient/patient-layout';
import { Card, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

export default function PatientReviewsPage() {
  const [rating, setRating] = useState(5);
  const [categories, setCategories] = useState<string[]>(['Good Doctor', 'Listened Carefully']);
  const [comment, setComment] = useState('Extremely patient doctor! She listened to my skin allergy problem patiently and explained treatment clearly.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const availableCategories = [
    'Good Doctor',
    'Listened Carefully',
    'Explained Clearly',
    'Friendly Staff',
    'Clean Hospital',
    'Short Waiting Time',
  ];

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <PatientLayout>
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Consultation Feedback & Review
          </h1>
          <p className="text-xs text-slate-500">
            Rate your recent OPD consultation experience with Dr. Ananya Sharma.
          </p>
        </div>

        {isSubmitted ? (
          <Card className="text-center py-8 space-y-3 bg-emerald-50 border-emerald-200">
            <div className="text-4xl">🌟</div>
            <h3 className="font-bold text-emerald-950 text-lg">Thank You for Your Feedback!</h3>
            <p className="text-xs text-emerald-800 max-w-sm mx-auto">
              Your rating helps improve OPD patient experience across healthcare clinics in Jodhpur.
            </p>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="space-y-4 border-slate-200">
              <CardHeader title="Dr. Ananya Sharma (Dermatology)" subtitle="City Care Hospital Jodhpur • Token #27" />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Overall Rating</label>
                <div className="flex gap-2 text-2xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      className={star <= rating ? 'text-amber-400' : 'text-slate-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">What went well?</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableCategories.map((cat) => {
                    const isSelected = categories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Feedback (Optional)</label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand-500"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Patient Review
              </Button>
            </Card>
          </form>
        )}
      </div>
    </PatientLayout>
  );
}
