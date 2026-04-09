import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, FileText, Eye, Edit, Calendar, Clock } from 'lucide-react';
import { blogPosts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Blog Posts | Admin Dashboard',
  robots: 'noindex, nofollow',
};

const categoryColors: Record<string, string> = {
  'Travel Tips': 'bg-emerald-400/10 text-emerald-400',
  'Ghana Culture': 'bg-amber-400/10 text-amber-400',
  'Host Spotlight': 'bg-rose-400/10 text-rose-400',
  'Destination': 'bg-blue-400/10 text-blue-400',
  'Lifestyle': 'bg-purple-400/10 text-purple-400',
  'Ghana': 'bg-emerald-400/10 text-emerald-400',
  'General': 'bg-gray-400/10 text-gray-400',
};

export default function AdminBlogPage() {
  const publishedPosts = blogPosts.filter(p => p.featured);
  const allPosts = blogPosts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Blog Posts</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Manage your news and articles — {allPosts.length} posts
          </p>
        </div>
        <button className="btn-gold text-xs">
          <Plus size={14} />
          Write New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">Total Posts</p>
          <p className="font-serif text-2xl text-white">{allPosts.length}</p>
        </div>
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">Featured</p>
          <p className="font-serif text-2xl text-[var(--gold)]">{publishedPosts.length}</p>
        </div>
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">Categories</p>
          <p className="font-serif text-2xl text-white">
            {Array.from(new Set(allPosts.map(p => p.category))).length}
          </p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Post</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Category</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Date</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Read Time</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Featured</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allPosts.map((post) => (
                <tr key={post.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded overflow-hidden bg-[var(--surface-3)] shrink-0">
                        {post.image && (
                          <Image
                            src={post.image}
                            alt={post.title}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-medium text-sm truncate max-w-[200px]">{post.title}</p>
                        <p className="text-[var(--text-subtle)] text-xs truncate max-w-[200px]">{post.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      categoryColors[post.category] || categoryColors['General']
                    }`}>
                      {post.category || 'General'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
                      <Calendar size={12} />
                      {post.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm">
                      <Clock size={12} />
                      {post.readTime}
                    </div>
                  </td>
                  <td className="p-4">
                    {post.featured ? (
                      <span className="text-[var(--gold)] text-xs">Featured</span>
                    ) : (
                      <span className="text-[var(--text-subtle)] text-xs">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/news/${post.slug}`}
                        className="p-2 border border-[var(--border)] hover:border-[var(--gold)] text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                        title="View on site"
                      >
                        <Eye size={14} />
                      </Link>
                      <button
                        className="p-2 border border-[var(--border)] hover:border-[var(--gold)] text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                        title="Edit post"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
        <p className="text-[var(--text-muted)] text-sm">
          <strong className="text-[var(--gold)]">Note:</strong> Blog posts are managed in <code className="bg-[var(--surface-3)] px-1">src/lib/data.ts</code>. 
          Edit the file directly or connect Airtable for CMS management.
        </p>
      </div>
    </div>
  );
}
