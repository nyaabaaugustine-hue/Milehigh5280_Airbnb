import type { Metadata } from 'next';
import Image from 'next/image';
import { Plus, Star, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { getAllReviews, getAllProperties } from '@/lib/airtable/service';
import type { Review } from '@/lib/airtable/types';

export const metadata: Metadata = {
  title: 'Reviews | Admin Dashboard',
  robots: 'noindex, nofollow',
};

export const revalidate = 60;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={star <= rating ? 'text-[var(--gold)] fill-[var(--gold)]' : 'text-[var(--text-subtle)]'}
        />
      ))}
    </div>
  );
}

export default async function AdminReviewsPage() {
  let reviews: Review[] = [];
  let properties: Array<{ id: string; name: string }> = [];
  
  try {
    [reviews, properties] = await Promise.all([
      getAllReviews().catch(() => []),
      getAllProperties().catch(() => []),
    ]);
  } catch {
    reviews = [];
    properties = [];
  }

  const propertyMap = new Map(properties.map(p => [p.id, p.name]));

  const verifiedReviews = reviews.filter(r => r.isVerified);
  const pendingReviews = reviews.filter(r => !r.isVerified);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Reviews</h1>
          <p className="text-[var(--text-muted)] text-sm">
            {verifiedReviews.length} verified, {pendingReviews.length} pending approval
          </p>
        </div>
        <a 
          href="https://airtable.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold text-xs"
        >
          <Plus size={14} />
          Add in Airtable
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox
          label="Total Reviews"
          value={reviews.length}
          icon={MessageSquare}
        />
        <StatBox
          label="Verified"
          value={verifiedReviews.length}
          icon={CheckCircle}
          color="green"
        />
        <StatBox
          label="Pending"
          value={pendingReviews.length}
          icon={Clock}
          color="yellow"
        />
        <StatBox
          label="Avg Rating"
          value={reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0'}
          icon={Star}
          color="gold"
        />
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="bg-yellow-400/5 border border-yellow-400/20 p-6">
          <h2 className="font-serif text-xl text-yellow-400 mb-4 flex items-center gap-2">
            <Clock size={18} />
            Pending Approval ({pendingReviews.length})
          </h2>
          <div className="space-y-4">
            {pendingReviews.map(review => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                propertyName={propertyMap.get(review.propertyId)} 
              />
            ))}
          </div>
        </div>
      )}

      {/* All Reviews */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
        <h2 className="font-serif text-xl text-white mb-4">All Reviews</h2>
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={48} className="text-[var(--text-subtle)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                propertyName={propertyMap.get(review.propertyId)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ 
  label, 
  value, 
  icon: Icon, 
  color = 'white' 
}: { 
  label: string; 
  value: number | string; 
  icon: React.ElementType; 
  color?: string; 
}) {
  const colorMap: Record<string, string> = {
    white: 'text-white',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    gold: 'text-[var(--gold)]',
  };

  return (
    <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={colorMap[color]} />
        <span className="text-[var(--text-subtle)] text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className={`font-serif text-2xl ${colorMap[color]}`}>{value}</p>
    </div>
  );
}

function ReviewCard({ 
  review, 
  propertyName 
}: { 
  review: Review; 
  propertyName?: string 
}) {
  return (
    <div className="border border-[var(--border)] p-4 hover:border-[var(--gold)]/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] overflow-hidden">
            {review.authorAvatar ? (
              <Image
                src={review.authorAvatar}
                alt={review.author}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[var(--gold)]/20 flex items-center justify-center text-[var(--gold)] font-medium">
                {review.author.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="text-white font-medium">{review.author}</p>
            <p className="text-[var(--text-subtle)] text-xs">{review.country} • {review.stayDuration}</p>
          </div>
        </div>
        <div className="text-right">
          <StarRating rating={review.rating} />
          <p className="text-[var(--text-subtle)] text-xs mt-1">{review.date}</p>
        </div>
      </div>
      
      <p className="text-[var(--text-muted)] text-sm mb-3 line-clamp-3">{review.comment}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-[var(--text-subtle)] text-xs">
          Property: <span className="text-white">{propertyName || 'Unknown'}</span>
        </span>
        <div className="flex items-center gap-2">
          {review.isVerified ? (
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <CheckCircle size={12} />
              Verified
            </span>
          ) : (
            <span className="flex items-center gap-1 text-yellow-400 text-xs">
              <Clock size={12} />
              Pending
            </span>
          )}
          <a 
            href="https://airtable.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold)] text-xs hover:underline"
          >
            Edit →
          </a>
        </div>
      </div>
    </div>
  );
}
