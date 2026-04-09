import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://thepalmayimensah.com';
  const now  = new Date().toISOString();
  return [
    { url: base,                                          lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/properties`,                          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/booking`,                             lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/host`,                                lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/about`,                               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/ghana-guide`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/news`,                                lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/contact`,                             lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/news/hidden-gems-ayi-mensah`,         lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/news/best-luxury-stays-accra`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/news/ayi-mensah-travel-guide`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/news/ghana-luxury-travel`,            lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}
