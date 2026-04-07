import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { posts } from '@/components/home/BlogSection';

export const metadata: Metadata = {
  title: 'News & Stories — Milehigh Properties',
  description: 'Insights into luxury travel, Ghanaian culture, and the latest from Milehigh Properties.',
};

export default function NewsPage() {
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen">

      {/* ── Page Hero ── */}
      <section className="relative pt-40 pb-20 px-6 lg:px-12 border-b border-[var(--border)] overflow-hidden">
        {/* Faint background texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="max-w-[1440px] mx-auto relative z-10">
          <p className="section-label mb-4">Journal &amp; Stories</p>
          <h1 className="font-serif font-light text-white leading-tight mb-5 text-[clamp(2.5rem,6vw,6rem)]">
            News &amp; <span className="italic text-gold-gradient">Stories</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl leading-relaxed text-base">
            Curated insights into the best of Ghana, luxury hosting, and lifestyle
            updates from the Milehigh portfolio.
          </p>
        </div>
      </section>

      {/* ── Featured Post ── */}
      <section className="py-16 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <Link
          href={`/news/${featured.slug}`}
          className="group grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[var(--border)] hover:border-[var(--gold)]/40 transition-all duration-500 overflow-hidden bg-[var(--surface)]"
        >
          {/* Image side */}
          <div className="relative h-72 lg:h-auto min-h-[340px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080808]/40" />
            <div className="absolute top-5 left-5">
              <span className="bg-[var(--gold)] text-[#080808] text-[0.6rem] font-black uppercase tracking-widest px-3 py-1.5">
                Featured
              </span>
            </div>
          </div>

          {/* Text side */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-5">
              <span className={`text-[0.6rem] tracking-[0.25em] uppercase font-bold ${featured.categoryColor}`}>
                {featured.category}
              </span>
              <span className="text-[var(--gold)] text-[0.6rem] tracking-widest uppercase border border-[var(--border)] px-2.5 py-1">
                {featured.tag}
              </span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-white leading-tight mb-4 group-hover:text-[var(--gold)] transition-colors duration-300">
              {featured.title}
            </h2>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 line-clamp-3">
              {featured.excerpt}
            </p>
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-6">
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-[var(--gold)]" />
                  {featured.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-[var(--gold)]" />
                  {featured.readTime}
                </span>
              </div>
              <span className="flex items-center gap-2 text-[0.65rem] uppercase tracking-widest font-bold text-[var(--gold)] group-hover:gap-3 transition-all">
                Read
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--border)]" />
          <div className="w-2 h-2 rotate-45 border border-[var(--gold)] opacity-60" />
          <p className="section-label">All Articles</p>
          <div className="w-2 h-2 rotate-45 border border-[var(--gold)] opacity-60" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--border)]" />
        </div>
      </div>

      {/* ── Rest of Posts ── */}
      <section className="pb-24 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group flex flex-col h-full bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)]/40 transition-all duration-500 overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
            >
              {/* Image */}
              <div className="relative h-60 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className={`text-[0.58rem] tracking-widest uppercase font-bold bg-[#080808]/75 backdrop-blur-sm border border-current/20 px-3 py-1.5 ${post.categoryColor}`}>
                    {post.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[#080808]/75 backdrop-blur-sm border border-[var(--border)] px-3 py-1.5">
                  <Clock size={10} className="text-[var(--gold)]" />
                  <span className="text-[0.58rem] text-[var(--text-muted)] tracking-wider">{post.readTime}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-7">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[0.55rem] tracking-[0.25em] uppercase font-medium text-[var(--gold)] border border-[var(--border)] px-2.5 py-1">
                    {post.tag}
                  </span>
                  <span className="text-[var(--text-subtle)] text-[0.6rem]">{post.date}</span>
                </div>

                <h3 className="font-serif text-2xl font-light text-white leading-snug mb-3 group-hover:text-[var(--gold)] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-3 flex-1 mb-6">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between border-t border-[var(--border)] pt-5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full border border-[var(--border-bright)] flex items-center justify-center text-[0.55rem] font-bold text-[var(--gold)]"
                      style={{ background: 'rgba(201,150,58,0.12)' }}
                    >
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-[var(--text-muted)] text-[0.65rem]">{post.author}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--gold)] group-hover:gap-2.5 transition-all">
                    Read
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
