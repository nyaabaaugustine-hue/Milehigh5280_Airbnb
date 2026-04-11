// PATCH /api/admin/blog/[id] - Update blog post
// DELETE /api/admin/blog/[id] - Delete blog post

import { NextRequest, NextResponse } from 'next/server';
import { deleteBlogPostNeon, updateBlogPostNeon, logFormSubmissionNeon } from '@/lib/neon/service';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();

    const updated = await updateBlogPostNeon(id, {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      image: body.image,
      isPublished: body.isPublished,
      featured: body.featured,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Blog post not found or update failed' }, { status: 404 });
    }

    await logFormSubmissionNeon('/admin/blog', 'Blog Post Edit', 'update', { id, ...body });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[Admin] Patch blog post error:', err);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const deleted = await deleteBlogPostNeon(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Blog post not found or delete failed' }, { status: 404 });
    }

    await logFormSubmissionNeon('/admin/blog', 'Blog Post Delete', 'delete', { id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin] Delete blog post error:', err);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}