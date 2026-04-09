import { MetadataRoute } from 'next';
import { properties, blogPosts } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://thepalmayimensah.com';
  const now  = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                                          lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/properties`,                          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/booking`,                             lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/host`,                                lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/ghana-guide`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/news`,                                lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/contact`,                             lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`,                             lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/terms`,                               lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
    { url: `${base}/cancellation`,                        lastModified: now, changeFrequency: 'yearly',  priority: 0.4 },
  ];

  const propertyPages: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${base}/properties/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/news/${post.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...propertyPages, ...blogPages];
}
