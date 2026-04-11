// GET /api/admin/blog - List all blog posts
// POST /api/admin/blog - Create blog post

import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPostsNeon, createBlogPostNeon, logFormSubmissionNeon } from '@/lib/neon/service';

export async function GET() {
  try {
    const posts = await getAllBlogPostsNeon();
    return NextResponse.json(posts);
  } catch (err) {
    console.error('[Admin] Get blog posts error:', err);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const created = await createBlogPostNeon({
      title: body.title || 'New Blog Post',
      slug: body.slug || `blog-${Date.now()}`,
      excerpt: body.excerpt || '',
      content: body.content || '',
      author: body.author || 'Admin',
      category: body.category || 'General',
      image: body.image || '',
      isPublished: body.isPublished ?? false,
      featured: body.featured ?? false,
    });

    if (!created) {
      return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }

    await logFormSubmissionNeon('/admin/blog', 'Blog Post Create', 'create', body);

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('[Admin] Create blog post error:', err);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}