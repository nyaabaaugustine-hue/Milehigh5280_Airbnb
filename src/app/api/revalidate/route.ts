/**
 * On-Demand Revalidation Handler
 * Uses Next.js revalidatePath for instant cache invalidation
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

const ALLOWED_PATHS = [
  '/',
  '/properties',
  '/properties/the-palm-ayi-mensah',
  '/blog',
  '/about',
  '/contact',
  '/ghana-guide',
];

interface ResponseBody {
  success: boolean;
  message: string;
  revalidated?: string;
  timestamp?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ResponseBody>> {
  const startTime = Date.now();
  
  try {
    // ─────────────────────────────────────────────
    // 1. Security Check
    // ─────────────────────────────────────────────
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '').trim();
    
    if (!token || token !== REVALIDATE_SECRET) {
      console.warn('[Revalidate] Unauthorized attempt from:', request.headers.get('x-forwarded-for'));
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    // ─────────────────────────────────────────────
    // 2. Parse Request Body
    // ─────────────────────────────────────────────
    let body: { path?: string; slug?: string; tag?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { path, slug, tag } = body;

    // ─────────────────────────────────────────────
    // 3. Determine Path to Revalidate
    // ─────────────────────────────────────────────
    let targetPath = path;

    if (slug) {
      // Map slugs to actual paths
      const slugMap: Record<string, string> = {
        'the-palm-ayi-mensah': '/properties/the-palm-ayi-mensah',
        'home': '/',
        'properties': '/properties',
        'blog': '/blog',
        'about': '/about',
        'contact': '/contact',
        'ghana-guide': '/ghana-guide',
      };
      targetPath = slugMap[slug] || `/${slug}`;
    }

    if (!targetPath) {
      return NextResponse.json(
        { success: false, message: 'Missing path or slug parameter' },
        { status: 400 }
      );
    }

    // Validate path is allowed
    if (!ALLOWED_PATHS.includes(targetPath) && !targetPath.startsWith('/properties/')) {
      console.warn('[Revalidate] Attempted to revalidate disallowed path:', targetPath);
      return NextResponse.json(
        { success: false, message: 'Path not allowed for revalidation' },
        { status: 403 }
      );
    }

    // ─────────────────────────────────────────────
    // 4. Execute Revalidation
    // ─────────────────────────────────────────────
    try {
      if (tag) {
        // Use tag-based revalidation (more specific)
        revalidateTag(tag);
        console.log(`[Revalidate] Tag revalidated: ${tag}`);
      } else {
        // Use path-based revalidation
        revalidatePath(targetPath);
        console.log(`[Revalidate] Path revalidated: ${targetPath}`);
      }
    } catch (revalidateError) {
      console.error('[Revalidate] Revalidation error:', revalidateError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Revalidation failed', 
          error: String(revalidateError) 
        },
        { status: 500 }
      );
    }

    // ─────────────────────────────────────────────
    // 5. Success Response
    // ─────────────────────────────────────────────
    const duration = Date.now() - startTime;
    console.log(`[Revalidate] Success: ${targetPath} (${duration}ms)`);

    return NextResponse.json({
      success: true,
      message: `Successfully revalidated ${targetPath}`,
      revalidated: targetPath,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('[Revalidate] Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: String(error)
      },
      { status: 500 }
    );
  }
}

// GET handler - useful for health checks
export async function GET(): Promise<NextResponse<ResponseBody>> {
  return NextResponse.json({
    success: true,
    message: 'On-Demand Revalidation API is running. POST with { "path": "/properties" } or { "slug": "home" }',
    timestamp: new Date().toISOString(),
  });
}