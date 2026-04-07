import { posts } from '@/lib/data';
import { notFound } from 'next/navigation';
import AudioPlayer from './AudioPlayer';

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
    <
       "tl img src={po
      <AudioPlayer />
    </>
  );
}