import { blogPosts, getPostBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import AudioPlayer from './AudioPlayer';
import Image from 'next/image';

export async function generateStaticParams() {
  // Ensure blogPosts exists and is an array before mapping
  if (!blogPosts || !Array.isArray(blogPosts)) return [];
  
  return blogPosts.map((p) => ({
    slug: p.slug,
  }));
}

export default function NewsPost({ params }: { params: { slug: string } }) {
  // Use the helper function for consistency
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      {post.image && (
        <Image 
          src={post.image} 
          alt={post.title} 
          width={1200} 
          height={600} 
          className="w-full h-96 object-cover rounded-3xl mb-12 shadow-xl" 
          unoptimized 
        />
      )}
      <h1 className="text-5xl font-serif font-bold text-white mb-8">{post.title}</h1>
      <div className="prose prose-invert prose-lg max-w-none text-slate-300">
        {post.content}
      </div>
      <AudioPlayer />
    </main>
  );
}