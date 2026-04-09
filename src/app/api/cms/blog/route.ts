// API Route: GET /api/cms/blog
// Fetches all blog posts from Airtable

import { NextResponse } from 'next/server';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/airtable/service';

export const revalidate = 600; // Revalidate every 10 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const post = await getBlogPostBySlug(slug);
      if (!post) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      return NextResponse.json({ data: post });
    }

    const posts = await getAllBlogPosts();

    return NextResponse.json({
      data: posts,
      meta: {
        count: posts.length,
        cached: true,
        revalidate: 600,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
