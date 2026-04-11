'use client';

import type { Metadata } from 'next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, FileText, Eye, Edit, Calendar, Clock, Trash2 } from 'lucide-react';
import type { BlogPost } from '@/lib/airtable/types';

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

const defaultPost = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: 'Admin',
  category: 'General',
  image: '',
  isPublished: false,
  featured: false,
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<typeof defaultPost>(defaultPost);

  const publishedPosts = posts.filter(p => p.isPublished);
  const allPosts = posts;

  useEffect(() => {
    fetch('/api/admin/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({ ...defaultPost, slug: `blog-${Date.now()}` });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: (post as any).content || '',
      author: post.author || 'Admin',
      category: post.category || 'General',
      image: post.image || '',
      isPublished: post.isPublished ?? false,
      featured: post.featured ?? false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const url = editingPost ? `/api/admin/blog/${editingPost.id}` : '/api/admin/blog';
      const method = editingPost ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to save blog post');

      const saved = await res.json();
      
      if (editingPost) {
        setPosts(prev => prev.map(p => p.id === saved.id ? saved : p));
      } else {
        setPosts(prev => [saved, ...prev]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save blog post error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete blog post error:', err);
    }
  };

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
        <button onClick={handleOpenCreate} className="btn-gold text-xs">
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
          <p className="text-[var(--text-subtle)] text-xs uppercase tracking-wider mb-1">Published</p>
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
      <div className="bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden rounded-lg">
        {allPosts.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {allPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-[var(--surface)] transition-colors">
                <div className="w-16 h-12 bg-[var(--surface)] rounded overflow-hidden flex-shrink-0">
                  {post.image && <img src={post.image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-medium truncate">{post.title}</h3>
                    {post.isPublished && <span className="text-[var(--gold)] text-xs">✓ Published</span>}
                    {post.featured && <span className="bg-[var(--gold)]/20 text-[var(--gold)] text-xs px-1.5 py-0.5 rounded">Featured</span>}
                  </div>
                  <p className="text-[var(--text-subtle)] text-xs truncate">{post.excerpt}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${categoryColors[post.category] || 'bg-gray-400/10 text-gray-400'}`}>
                  {post.category}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(post)} className="p-2 hover:text-[var(--gold)]">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText size={48} className="text-[var(--text-subtle)] mx-auto mb-4" />
            <h3 className="text-white text-lg mb-2">No blog posts yet</h3>
            <p className="text-[var(--text-muted)] text-sm mb-4">
              Create your first blog post to share news and updates
            </p>
            <button onClick={handleOpenCreate} className="btn-gold text-xs">
              Create First Post
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-[var(--surface-2)] border border-[var(--border)] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-white mb-4">{editingPost ? 'Edit Blog Post' : 'Write New Post'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value, slug: editingPost ? formData.slug : e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                  placeholder="Blog post title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                  >
                    <option value="General">General</option>
                    <option value="Travel Tips">Travel Tips</option>
                    <option value="Ghana Culture">Ghana Culture</option>
                    <option value="Host Spotlight">Host Spotlight</option>
                    <option value="Destination">Destination</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                  rows={2}
                  placeholder="Brief summary..."
                />
              </div>

              <div>
                <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                  rows={8}
                  placeholder="Full content..."
                />
              </div>

              <div>
                <label className="block text-[var(--text-subtle)] text-xs uppercase mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-3 py-2 text-white"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={e => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm">Publish now</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white text-sm">Featured</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-[var(--border)] text-white rounded hover:bg-[var(--surface)]">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 btn-gold">
                {editingPost ? 'Save Changes' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}