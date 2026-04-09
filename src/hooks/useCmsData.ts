// Custom hooks for fetching CMS data from Airtable

import { useState, useEffect, useCallback } from 'react';
import type { Property, Amenity, Review, BlogPost } from '@/lib/airtable/types';

// Generic fetch hook
function useFetch<T>(url: string | null, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data || result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// ─── Properties Hook ───────────────────────────────────────────────────────────

export function useProperties(liveOnly = false) {
  const url = `/api/cms/properties${liveOnly ? '?live=true' : ''}`;
  return useFetch<Property[]>(url);
}

export function useProperty(slugOrId: string | null) {
  const url = slugOrId ? `/api/cms/properties?slug=${slugOrId}` : null;
  return useFetch<Property | null>(url);
}

// ─── Amenities Hook ────────────────────────────────────────────────────────────

export function useAmenities() {
  return useFetch<Amenity[]>('/api/cms/amenities');
}

// ─── Reviews Hook ─────────────────────────────────────────────────────────────

export function useReviews(propertyId?: string) {
  const url = propertyId
    ? `/api/cms/reviews?propertyId=${propertyId}`
    : '/api/cms/reviews';
  return useFetch<Review[]>(url);
}

// ─── Blog Hook ────────────────────────────────────────────────────────────────

export function useBlogPosts() {
  return useFetch<BlogPost[]>('/api/cms/blog');
}

export function useBlogPost(slug: string | null) {
  const url = slug ? `/api/cms/blog?slug=${slug}` : null;
  return useFetch<BlogPost | null>(url);
}

// ─── Combined Property with Details ────────────────────────────────────────────

export function usePropertyWithDetails(slug: string | null) {
  const { data: property, loading: propertyLoading, error: propertyError } = useProperty(slug);
  const { data: amenities } = useAmenities();
  const { data: reviews } = useReviews(slug || undefined);

  const loading = propertyLoading;
  const error = propertyError;

  // Combine data
  const data = property && amenities && reviews
    ? {
        ...property,
        amenitiesData: amenities.filter(a => property.amenities?.includes(a.id)),
        reviewsData: reviews.filter(r => r.propertyId === property.id),
      }
    : null;

  return { data, loading, error };
}

// ─── CMS Health Check ─────────────────────────────────────────────────────────

export function useCmsHealth() {
  const [health, setHealth] = useState<{
    status: string;
    message: string;
    timestamp: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cms/health')
      .then(res => res.json())
      .then(setHealth)
      .finally(() => setLoading(false));
  }, []);

  return { health, loading };
}
