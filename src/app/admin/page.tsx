import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, Star, FileText, MessageSquare, 
  Eye, Edit, TrendingUp, Users, Calendar
} from 'lucide-react';
import { getAllPropertiesNeon, getAllReviewsNeon, getAllBlogPostsNeon, getAllAmenitiesNeon } from '@/lib/neon/service';
import { getContactInfo, getSocialLinks } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Milehigh5280 CMS',
  robots: 'noindex, nofollow',
};

export const revalidate = 60;

async function getStats() {
  try {
    const [properties, reviews, blogPosts, amenities] = await Promise.all([
      getAllPropertiesNeon().catch(() => []),
      getAllReviewsNeon().catch(() => []),
      getAllBlogPostsNeon().catch(() => []),
      getAllAmenitiesNeon().catch(() => []),
    ]);

    return {
      totalProperties: properties.length,
      liveProperties: properties.filter((p: { isLive: boolean }) => p.isLive !== false).length,
      totalReviews: reviews.length,
      pendingReviews: reviews.filter((r: { isVerified: boolean }) => !r.isVerified).length,
      totalBlogPosts: blogPosts.length,
      publishedPosts: blogPosts.filter((p: { isPublished: boolean }) => p.isPublished !== false).length,
      totalAmenities: amenities.length,
    };
  } catch {
    return {
      totalProperties: 0,
      liveProperties: 0,
      totalReviews: 0,
      pendingReviews: 0,
      totalBlogPosts: 0,
      publishedPosts: 0,
      totalAmenities: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const contactInfo = getContactInfo();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Dashboard</h1>
          <p className="text-[var(--text-muted)] text-sm">Manage your Milehigh5280 content</p>
        </div>
        <Link href="/" className="btn-ghost text-xs py-2">
          <Eye size={14} />
          View Website
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Properties"
          value={stats.liveProperties}
          subtitle={`${stats.totalProperties} total`}
          icon={Building2}
          href="/admin/properties"
          color="gold"
        />
        <StatCard
          title="Reviews"
          value={stats.totalReviews}
          subtitle={`${stats.pendingReviews} pending`}
          icon={MessageSquare}
          href="/admin/reviews"
          color="blue"
        />
        <StatCard
          title="Blog Posts"
          value={stats.publishedPosts}
          subtitle={`${stats.totalBlogPosts} total`}
          icon={FileText}
          href="/admin/blog"
          color="green"
        />
        <StatCard
          title="Amenities"
          value={stats.totalAmenities}
          subtitle="All features"
          icon={Star}
          href="/admin/amenities"
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
        <h2 className="font-serif text-xl text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction href="/admin/properties" icon={Building2} label="Add Property" />
          <QuickAction href="/admin/blog" icon={FileText} label="Write Post" />
          <QuickAction href="/admin/reviews" icon={Star} label="Manage Reviews" />
          <QuickAction href="/admin/site-content" icon={Edit} label="Edit Content" />
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-white">Properties</h2>
            <Link href="/admin/properties" className="text-[var(--gold)] text-xs hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-white">The Palm at Ayi Mensah</span>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">Live</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
              <span className="text-sm text-white">Pearl Mansion</span>
              <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Coming Soon</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white">Lakeside Estate</span>
              <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-white">Contact Info</h2>
            <Link href="/admin/settings" className="text-[var(--gold)] text-xs hover:underline">
              Edit →
            </Link>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-muted)]">Phone</span>
              <span className="text-white">{contactInfo.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border)]">
              <span className="text-[var(--text-muted)]">WhatsApp</span>
              <span className="text-white">{contactInfo.whatsapp}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[var(--text-muted)]">Email</span>
              <span className="text-white">{contactInfo.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 p-6">
        <h3 className="text-[var(--gold)] font-medium mb-2">Getting Started</h3>
        <p className="text-[var(--text-muted)] text-sm mb-4">
          This dashboard connects to Neon Postgres CMS. Make sure <code className="bg-[var(--surface-3)] px-1">NEON_DATABASE_URL</code> is configured in <code className="bg-[var(--surface-3)] px-1">.env.local</code>.
        </p>
        <div className="flex gap-4">
          <Link href="/admin/settings" className="btn-gold text-xs py-2">
            Configure Neon
          </Link>
          <a 
            href="/NEON-MIGRATION.md" 
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-xs py-2"
          >
            View Neon Setup Guide
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  href, 
  color 
}: { 
  title: string; 
  value: number; 
  subtitle: string; 
  icon: React.ElementType; 
  href: string; 
  color: 'gold' | 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    gold: 'text-[var(--gold)] bg-[var(--gold)]/10',
    blue: 'text-blue-400 bg-blue-400/10',
    green: 'text-green-400 bg-green-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
  };

  return (
    <Link href={href} className="block group">
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-5 hover:border-[var(--gold)] transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded ${colorClasses[color]}`}>
            <Icon size={18} />
          </div>
          <TrendingUp size={14} className="text-[var(--text-subtle)] group-hover:text-[var(--gold)] transition-colors" />
        </div>
        <p className="text-3xl font-serif text-white mb-1">{value}</p>
        <p className="text-[var(--text-muted)] text-xs">{subtitle}</p>
        <p className="text-[var(--gold)] text-xs mt-2 group-hover:underline">{title} →</p>
      </div>
    </Link>
  );
}

function QuickAction({ 
  href, 
  icon: Icon, 
  label 
}: { 
  href: string; 
  icon: React.ElementType; 
  label: string; 
}) {
  return (
    <Link 
      href={href} 
      className="flex flex-col items-center gap-2 p-4 border border-[var(--border)] hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all group"
    >
      <Icon size={20} className="text-[var(--text-muted)] group-hover:text-[var(--gold)]" />
      <span className="text-xs text-[var(--text-muted)] group-hover:text-white text-center">{label}</span>
    </Link>
  );
}
