'use client';

import { useState } from 'react';
import { X, Star, User, Mail, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
}

const RATING_LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export default function ReviewModal({ isOpen, onClose, propertyId, propertyName }: ReviewModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    author: '', email: '', country: '', rating: 0, stayDuration: '',
    comment: '', aspects: { cleanliness: 0, location: 0, value: 0, communication: 0 },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) { toast.error('Please select a rating'); return; }
    if (!form.author.trim() || !form.email.trim() || !form.comment.trim()) {
      toast.error('Please fill in all required fields'); return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId, propertyName, ...form,
          date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      setSubmitted(true);
      toast.success('Thank you for your review!');
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.2s ease' }}>
      <div className="absolute inset-0 bg-[#080808]/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--surface)] border border-[var(--border)] shadow-2xl"
        style={{ animation: 'slideUp 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--surface)] z-10">
          <div>
            <p className="section-label text-[0.55rem] mb-1">Share Your Experience</p>
            <h2 className="font-serif text-xl text-white">Write a Review</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border border-[var(--border)] hover:border-[var(--gold)] transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h3 className="font-serif text-2xl text-white mb-2">Review Submitted!</h3>
              <p className="text-[var(--text-muted)] text-sm mb-6">Thank you for sharing your experience. Your review helps future guests make informed decisions.</p>
              <button onClick={onClose} className="btn-gold">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="section-label text-[0.55rem] block mb-2">Overall Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setForm(f => ({ ...f, rating: star }))}
                      className="p-1 hover:scale-110 transition-transform">
                      <Star size={28} className={cn(
                        'transition-colors', form.rating >= star ? 'fill-[var(--gold)] text-[var(--gold)]' : 'text-[var(--border)]'
                      )} />
                    </button>
                  ))}
                </div>
                {form.rating > 0 && (
                  <p className="text-[var(--gold)] text-xs mt-2">{RATING_LABELS[form.rating - 1]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="section-label text-[0.55rem] block mb-2">Your Name *</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input type="text" className="input-luxury pl-9" placeholder="John Mensah" required
                      value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="section-label text-[0.55rem] block mb-2">Email *</label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
                    <input type="email" className="input-luxury pl-9" placeholder="john@example.com" required
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="section-label text-[0.55rem] block mb-2">Country</label>
                  <input type="text" className="input-luxury" placeholder="Ghana, USA, UK..."
                    value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
                </div>
                <div>
                  <label className="section-label text-[0.55rem] block mb-2">Length of Stay</label>
                  <select className="input-luxury" value={form.stayDuration}
                    onChange={e => setForm(f => ({ ...f, stayDuration: e.target.value }))}>
                    <option value="">Select...</option>
                    <option value="1 night">1 night</option>
                    <option value="2-3 nights">2-3 nights</option>
                    <option value="4-7 nights">4-7 nights</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2+ weeks">2+ weeks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="section-label text-[0.55rem] block mb-3">Rate Key Aspects</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'cleanness', label: 'Cleanliness' },
                    { key: 'location', label: 'Location' },
                    { key: 'value', label: 'Value' },
                    { key: 'communication', label: 'Communication' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between border border-[var(--border)] p-3">
                      <span className="text-[var(--text-muted)] text-xs">{label}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button key={s} type="button" onClick={() => setForm(f => ({
                            ...f, aspects: { ...f.aspects, [key]: s }
                          }))}>
                            <Star size={12} className={cn(
                              form.aspects[key as keyof typeof form.aspects] >= s
                                ? 'fill-[var(--gold)] text-[var(--gold)]'
                                : 'text-[var(--border)]'
                            )} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="section-label text-[0.55rem] block mb-2">Your Review *</label>
                <textarea className="input-luxury resize-none" rows={5}
                  placeholder="Share your experience at Milehigh5280..."
                  required value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} />
              </div>

              <button type="submit" disabled={loading} className={cn('btn-gold w-full', loading && 'opacity-70')}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
