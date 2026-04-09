import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, FileText, Eye, Edit, Calendar, Clock } from 'lucide-react';
import { getAllBlogPosts } from '@/lib/airtable/service';
import type { BlogPost } from '@/lib/airtable/types';

export const metadata: Metadata = {
  title: 'Blog Posts | Admin Dashboard',
  robots: 'noindex, nofollow',
};

export const revalidate = 60;

const categoryColors: Record<string, string> = {
  'Travel Tips': 'bg-emerald-400/10 text-emerald-400',
  'Ghana Culture': 'bg-amber-400/10 text-amber-400',
  'Host Spotlight': 'bg-rose-400/10 text-rose-400',
  'Destination': 'bg-blue-400/10 text-blue-400',
  'Lifestyle': 'bg-purple-400/10 text-purple-400',
  'General': 'bg-gray-400/10 text-gray-400',
};

export default async function AdminBlogPage() {
  let posts: BlogPost[] = [];
  
  try {
    posts = await getAllBlogPosts();
  } catch {
    posts = [];
  }

  const publishedPosts = posts.filter(p => p.isPublished !== false);
  const draftPosts = posts.filter(p => p.isPublished === false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Blog Posts</h1>
          <p className="text-[var(--text-muted)] text-sm">
            Manage your news and articles
          </p>
        </div>
        <a 
          href="https://airtable.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold text-xs"
        >
          <Plus size={14} />
          Write New Post
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">Total Posts</p>
          <p className="font-serif text-2xl text-white">{posts.length}</p>
        </div>
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">Published</p>
          <p className="font-serif text-2xl text-green-400">{publishedPosts.length}</p>
        </div>
        <div className="bg-[var(--surface-2)] border border-[var(--border)] p-4">
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">Drafts</p>
          <p className="font-serif text-2xl text-yellow-400">{draftPosts.length}</p>
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
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Status</th>
                <th className="text-left p-4 text-[var(--text-subtle)] text-xs uppercase tracking-wider font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <FileText size={48} className="text-[var(--text-subtle)] mx-auto mb-4" />
                    <h3 className="text-white text-lg mb-2">No blog posts yet</h3>
                    <p className="text-[var(--text-muted)] text-sm mb-4">
                      Create your first blog post in Airtable
                    </p>
                    <a 
                      href="https://airtable.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold text-xs"
                    >
                      Create First Post
                    </a>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden bg-[var(--surface-3)] shrink-0">
                          {post.image ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[var(--surface-3)] flex items-center justify-center">
                              <FileText size={20} className="text-[var(--text-subtle)]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate max-w-[200px]">{post.title}</p>
                          <p className="text-[var(--text-subtle)] text-xs truncate max-w-[200px]">{post.excerpt}</p>
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
                        {post.readTime || '5 min'}
                      </div>
                    </td>
                    <td className="p-4">
                      {post.isPublished !== false ? (
                        <span className="text-green-400 text-xs">Published</span>
                      ) : (
                        <span className="text-yellow-400 text-xs">Draft</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/news/${post.slug}`}
                          className="p-2 border border-[var(--border)] hover:border-[var(--gold)] text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </Link>
                        <a
                          href="https://airtable.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border border-[var(--border)] hover:border-[var(--gold)] text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex items-center justify-center gap-4">
        <a 
          href="https://airtable.com" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--text-muted)] text-sm hover:text-[var(--gold)]"
        >
          Manage Posts in Airtable →
        </a>
      </div>
    </div>
  );
}
