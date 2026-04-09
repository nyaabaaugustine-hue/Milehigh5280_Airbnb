import type { Metadata } from 'next';
import Image from 'next/image';
import { Plus, Star, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import { properties } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Reviews | Admin Dashboard',
  robots: 'noindex, nofollow',
};

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

export default function AdminReviewsPage() {
  // Collect all reviews from all properties
  const allReviews = properties.flatMap(property => 
    (property.reviews || []).map(review => ({
      ...review,
      propertyName: property.name,
      propertySlug: property.slug,
    }))
  );

  const avgRating = allReviews.length > 0 
    ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Reviews</h1>
          <p className="text-[var(--text-muted)] text-sm">
            {allReviews.length} total reviews across {properties.length} properties
          </p>
        </div>
        <button className="btn-gold text-xs">
          <Plus size={14} />
          Add Review
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">Total Reviews</p>
          <p className="font-serif text-2xl text-white">{allReviews.length}</p>
        </div>
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">Avg Rating</p>
          <div className="flex items-center gap-2">
            <p className="font-serif text-2xl text-[var(--gold)]">{avgRating}</p>
            <Star size={16} className="text-[var(--gold)] fill-[var(--gold)]" />
          </div>
        </div>
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">5-Star Reviews</p>
          <p className="font-serif text-2xl text-green-400">
            {allReviews.filter(r => r.rating === 5).length}
          </p>
        </div>
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">Properties</p>
          <p className="font-serif text-2xl text-white">{properties.length}</p>
        </div>
      </div>

      {/* Reviews by Property */}
      <div className="space-y-6">
        {properties.map(property => {
          const propertyReviews = property.reviews || [];
          if (propertyReviews.length === 0) return null;
          
          return (
            <div key={property.id} className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[var(--surface-3)] overflow-hidden">
                    {property.images[0]?.url && (
                      <Image
                        src={property.images[0].url}
                        alt={property.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{property.name}</p>
                    <p className="text-[var(--text-subtle)] text-xs">{propertyReviews.length} reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-[var(--gold)] fill-[var(--gold)]" />
                  <span className="text-white font-medium">{property.rating}</span>
                </div>
              </div>

              <div className="space-y-4">
                {propertyReviews.map(review => (
                  <div key={review.id} className="border border-[var(--border)] p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--surface-3)] overflow-hidden">
                          {review.avatar ? (
                            <Image
                              src={review.avatar}
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
                          <p className="text-white font-medium text-sm">{review.author}</p>
                          <p className="text-[var(--text-subtle)] text-xs">{review.country} • {review.stayDuration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StarRating rating={review.rating} />
                        <p className="text-[var(--text-subtle)] text-xs mt-1">{review.date}</p>
                      </div>
                    </div>
                    
                    <p className="text-[var(--text-muted)] text-sm line-clamp-3">{review.comment}</p>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[var(--text-subtle)] text-xs flex items-center gap-1">
                        <CheckCircle size={12} className="text-green-400" />
                        Verified Stay
                      </span>
                      <button className="text-[var(--gold)] text-xs hover:underline">
                        Edit Review →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
        <p className="text-[var(--text-muted)] text-sm">
          <strong className="text-[var(--gold)]">Note:</strong> Reviews are managed in <code className="bg-[var(--surface-3)] px-1">src/lib/data.ts</code> 
          within each property's reviews array.
        </p>
      </div>
    </div>
  );
}
