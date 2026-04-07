import { posts } from '@/lib/data';
import { notFound } from 'next/navigation';
import AudioPlayer from './AudioPlayer';
import Image from 'next/image';

// This function now works because 'posts' is imported from a non-client file
export async function generateStaticParams() {
  return posts.map((p) => ({
    slug: p.slug,
  }));
}

export default function NewsPost({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);

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