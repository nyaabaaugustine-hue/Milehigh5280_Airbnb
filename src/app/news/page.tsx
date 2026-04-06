import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { blogPosts } from '@/lib/data';

export const metadata: Metadata = {
  title: 'News & Stories — Milehigh Properties',
  description: 'Insights into luxury travel, Ghanaian culture, and the latest from Milehigh Properties.',
};

export default function NewsPage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative pt-40 pb-20 px-6 lg:px-12 border-b border-[var(--border)]">
        <div className="max-w-[1440px] mx-auto">
          <p className="section-label mb-4">Journal</p>
          <h1 className="font-serif font-light text-white leading-tight mb-4 text-5xl lg:text-7xl">
            News &amp; <span className="italic text-gold-gradient">Stories</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl leading-relaxed">
            Curated insights into the best of Ghana, luxury hosting, and
            lifestyle updates from the Milehigh portfolio.
          </p>
        </div>
      </section>

      {/* ── Blog Grid ── */}
      <section className="py-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group flex flex-col h-full bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)]/40 transition-all duration-500 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="bg-[var(--obsidian)]/80 backdrop-blur-md border border-[var(--border)] text-[var(--gold)] text-[0.6rem] uppercase tracking-[0.2em] px-3 py-1.5 font-bold">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[var(--text-subtle)] text-[0.65rem] uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-[var(--gold)]" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[var(--gold)]" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-white mb-4 group-hover:text-[var(--gold)] transition-colors duration-300 leading-tight">
                  {post.title}
                </h3>

                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-6 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-[0.65rem] uppercase tracking-widest font-bold text-white group-hover:text-[var(--gold)] transition-colors inline-flex items-center gap-2">
                    Read Article
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <BookOpen size={16} className="text-[var(--border-bright)] opacity-30 group-hover:opacity-100 group-hover:text-[var(--gold)] transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
