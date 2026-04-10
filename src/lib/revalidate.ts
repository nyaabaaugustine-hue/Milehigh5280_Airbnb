/**
 * Trigger On-Demand Revalidation
 * Call this after any content update in the admin dashboard
 * 
 * @param path - Direct path to revalidate (e.g., '/properties')
 * @param slug - Content slug to map to path (e.g., 'the-palm-ayi-mensah')
 */

interface RevalidateResult {
  success: boolean;
  message: string;
  path?: string;
  error?: string;
}

export async function triggerRevalidation(path?: string, slug?: string): Promise<RevalidateResult> {
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  
  if (!revalidateSecret) {
    console.warn('[triggerRevalidation] REVALIDATE_SECRET not set - skipping revalidation');
    return {
      success: false,
      message: 'Revalidation not configured',
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${revalidateSecret}`,
      },
      body: JSON.stringify({ path, slug }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[triggerRevalidation] Failed:', error);
      return {
        success: false,
        message: error.message || 'Revalidation failed',
        error: JSON.stringify(error),
      };
    }

    const result = await response.json();
    console.log('[triggerRevalidation] Success:', result);
    
    return {
      success: true,
      message: result.message || 'Revalidation successful',
      path: result.revalidated,
    };
  } catch (error) {
    console.error('[triggerRevalidation] Error:', error);
    return {
      success: false,
      message: 'Failed to trigger revalidation',
      error: String(error),
    };
  }
}

/**
 * Revalidate multiple paths at once
 */
export async function triggerMultipleRevalidation(paths: string[]): Promise<RevalidateResult> {
  const results = await Promise.all(
    paths.map(path => triggerRevalidation(path))
  );
  
  const failed = results.filter(r => !r.success);
  
  return {
    success: failed.length === 0,
    message: `Revalidated ${results.length - failed.length}/${paths.length} paths`,
    error: failed.length > 0 ? `${failed.length} paths failed` : undefined,
  };
}

/**
 * Smart revalidation - determines which pages need updating based on content type
 */
export async function smartRevalidate(contentType: string, identifier?: string): Promise<RevalidateResult> {
  const pathMap: Record<string, string[]> = {
    property: identifier 
      ? ['/', `/properties/${identifier}`, '/properties'] 
      : ['/', '/properties'],
    blog: identifier 
      ? ['/blog', `/blog/${identifier}`] 
      : ['/blog'],
    amenity: ['/properties'],
    review: ['/'],
    site_content: ['/'],
    settings: ['/contact'],
  };

  const paths = pathMap[contentType] || ['/'];
  
  return triggerMultipleRevalidation(paths);
}

export default { triggerRevalidation, triggerMultipleRevalidation, smartRevalidate };