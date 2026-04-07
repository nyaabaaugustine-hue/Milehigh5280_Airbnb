import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import { extendedPosts as posts } from '@/lib/extendedPosts';

// ── Static params so Next.js pre-renders all three posts ──────────────────────
export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

// ── Per-post metadata ─────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Article Not Found' };
  return {
    title:       `${post.title} | Milehigh5280`,
    description: post.excerpt,
    openGraph: {
      title:       post.title,
      description: post.excerpt,
      images:      [{ url: post.image }],
    },
  };
}

// ── Render content paragraphs with bold headings ───────────────────────────────
function renderContent(raw: string) {
  return raw.split('\n\n').map((para, i) => {
    // Paragraph that is entirely a **heading**
    if (/^\*\*.+\*\*$/.test(para.trim())) {
      const text = para.trim().slice(2, -2);
      return (
        <h3 key={i} className="font-serif text-2xl lg:text-3xl font-light text-white mt-14 mb-5 flex items-center gap-4">
          <span className="w-8 h-px bg-[var(--gold)] shrink-0" />
          {text}
        </h3>
      );
    }

    // Paragraph starting with **Heading** on its own line
    const match = para.match(/^\*\*(.+?)\*\*\n([\s\S]+)$/);
    if (match) {
      return (
        <div key={i} className="mt-14 mb-5">
          <h3 className="font-serif text-2xl lg:text-3xl font-light text-white mb-4 flex items-center gap-4">
            <span className="w-8 h-px bg-[var(--gold)] shrink-0" />
            {match[1]}
          </h3>
          <p className="text-[var(--text-muted)] text-[1.05rem] leading-[1.95]">{match[2]}</p>
        </div>
      );
    }

    return (
      <p key={i} className="text-[var(--text-muted)] text-[1.05rem] leading-[1.95] mb-7">
        {para}
      </p>
    );
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post       = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const otherPosts = posts.filter((p) => p.slug !== slug);
  const nextPost   = otherPosts[0];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden mt-[72px]">

        {/* Full-bleed background image */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.38) saturate(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/55 to-[#080808]/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/60 via-transparent to-transparent" />
        </div>

        {/* Decorative corner lines */}
        <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-[var(--gold)] opacity-30 pointer-events-none" />
        <div className="absolute top-8 right-8 w-10 h-10 border-t border-r border-[var(--gold)] opacity-30 pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 pb-16 lg:pb-28 w-full">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-[0.7rem] text-[var(--text-muted)] mb-10 tracking-widest uppercase">
            <Link href="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
            <span className="opacity-30">/</span>
            <Link href="/news" className="hover:text-[var(--gold)] transition-colors">News &amp; Stories</Link>
            <span className="opacity-30">/</span>
            <span className="text-[var(--text-subtle)] truncate max-w-[220px] normal-case">{post.title}</span>
          </nav>

          {/* Category badges */}
          <div className="flex flex-wrap items-center gap-3 mb-7">
            <span className={`inline-block text-[0.6rem] tracking-[0.28em] uppercase font-bold px-3 py-1.5 border border-current/30 bg-[#080808]/70 backdrop-blur-sm ${post.categoryColor}`}>
              {post.category}
            </span>
            <span className="inline-block text-[var(--gold)] text-[0.6rem] tracking-[0.2em] uppercase border border-[var(--gold)]/30 px-3 py-1.5 bg-[#080808]/70 backdrop-blur-sm">
              {post.tag}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif font-light text-white leading-[1.06] text-[clamp(1.9rem,4.5vw,4rem)] max-w-3xl mb-8">
            {post.title}
          </h1>

          {/* Author / date / read-time row */}
          <div className="flex flex-wrap items-center gap-6 text-[var(--text-muted)] text-sm">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full border border-[var(--border-bright)] flex items-center justify-center text-xs font-bold text-[var(--gold)]"
                style={{ background: 'rgba(201,150,58,0.15)' }}
              >
                {post.author.charAt(0)}
              </div>
              <span className="text-white font-medium">{post.author}</span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[var(--gold)]" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-[var(--gold)]" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          BODY GRID
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-16 xl:gap-28 py-16 lg:py-24">

          {/* ── ARTICLE ─────────────────────────────────────────── */}
          <article>
            {/* Pull-quote / excerpt */}
            <blockquote className="font-serif text-xl lg:text-2xl font-light text-white/75 leading-relaxed mb-14 border-l-[3px] border-[var(--gold)] pl-7 italic">
              {post.excerpt}
            </blockquote>

            {/* Decorative gold rule */}
            <div className="flex items-center gap-4 mb-14">
              <div className="w-14 h-px bg-[var(--gold)]" />
              <div className="w-2 h-2 rotate-45 bg-[var(--gold)]" />
              <div className="flex-1 h-px bg-gradient-to-r from-[var(--gold)]/20 to-transparent" />
            </div>

            {/* Body text */}
            <div>
              {renderContent(post.content)}
            </div>

            {/* Tags */}
            <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-wrap items-center gap-3">
              <span className="text-[var(--text-subtle)] text-xs uppercase tracking-widest mr-1">Tags:</span>
              {[post.category, post.tag, 'Ghana', 'Milehigh Properties', 'Ayi Mensah'].map((t) => (
                <span
                  key={t}
                  className="text-[0.62rem] uppercase tracking-widest text-[var(--gold)] border border-[var(--border)] px-3 py-1.5 hover:border-[var(--gold)] transition-colors cursor-default"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Author card */}
            <div className="mt-12 border border-[var(--border)] p-6 lg:p-8 flex items-start gap-6 bg-[var(--surface)] hover:border-[var(--gold)]/30 transition-colors duration-300">
              <div
                className="w-16 h-16 rounded-full border border-[var(--border-bright)] flex items-center justify-center text-xl font-bold text-[var(--gold)] shrink-0"
                style={{ background: 'rgba(201,150,58,0.1)' }}
              >
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-widest mb-1.5">Written by</p>
                <p className="text-white font-semibold text-base mb-2">{post.author}</p>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-md">
                  Part of the Milehigh team — writing about luxury living, travel inspiration,
                  and the beauty of life in Accra, Ghana.
                </p>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-10">
              <Link href="/news" className="inline-flex items-center gap-2 btn-ghost text-[0.7rem] py-3 px-6">
                <ArrowLeft size={13} />
                All Articles
              </Link>
            </div>
          </article>

          {/* ── SIDEBAR ─────────────────────────────────────────── */}
          <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">

            {/* Book CTA card */}
            <div className="border border-[var(--gold)]/35 bg-[rgba(201,150,58,0.03)] overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg"
                  alt="Milehigh5280 — The Palm, Ayi Mensah"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/30 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <p className="text-[var(--gold)] text-[0.6rem] tracking-[0.25em] uppercase font-bold">Milehigh5280 🌴</p>
                  <p className="text-white text-sm font-light">Ayi Mensah · Accra</p>
                </div>
              </div>
              <div className="p-6">
                <p className="section-label mb-3">Stay in Ayi Mensah</p>
                <h3 className="font-serif text-2xl text-white font-light mb-3 leading-tight">
                  Experience it <span className="italic text-gold-gradient">for yourself</span>
                </h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-5">
                  Our luxury private apartment sits right in the neighbourhood this article describes.
                  Book your stay and live it first-hand.
                </p>
                <Link href="/properties/the-palm-ayi-mensah" className="btn-gold w-full justify-center text-[0.7rem] py-3 mb-2.5">
                  View The Palm 🌴
                </Link>
                <Link href="/contact" className="btn-ghost w-full justify-center text-[0.7rem] py-3">
                  Talk to Concierge
                </Link>
              </div>
            </div>

            {/* More articles */}
            <div>
              <p className="section-label mb-5">More Stories</p>
              <div className="space-y-3">
                {otherPosts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/news/${p.slug}`}
                    className="group flex gap-4 border border-[var(--border)] p-4 hover:border-[var(--gold)]/35 transition-colors duration-300 bg-[var(--surface)]"
                  >
                    <div className="relative w-20 h-16 shrink-0 overflow-hidden border border-[var(--border)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[0.55rem] tracking-widest uppercase font-bold ${p.categoryColor}`}>
                        {p.category}
                      </span>
                      <p className="text-white text-xs leading-snug mt-1 line-clamp-2 group-hover:text-[var(--gold)] transition-colors">
                        {p.title}
                      </p>
                      <p className="text-[var(--text-subtle)] text-[0.6rem] mt-1.5 flex items-center gap-1">
                        <Clock size={9} className="text-[var(--gold)]" />
                        {p.readTime}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ghana Fast Facts */}
            <div className="border border-[var(--border)] p-6 bg-[var(--surface)]">
              <p className="section-label mb-5">🇬🇭 Ghana Quick Facts</p>
              <div className="space-y-3">
                {[
                  { label: 'Capital',      value: 'Accra' },
                  { label: 'Currency',     value: 'Ghana Cedi (GHS)' },
                  { label: 'Language',     value: 'English + Twi' },
                  { label: 'Time Zone',    value: 'GMT+0 (No DST)' },
                  { label: 'Best Season',  value: 'Nov – March' },
                  { label: 'Visa Policy',  value: 'On Arrival (most)' },
                  { label: 'Airport',      value: 'Kotoka Int\'l (ACC)' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm border-b border-[var(--border)] pb-2.5 last:border-0 last:pb-0">
                    <span className="text-[var(--text-muted)]">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          NEXT ARTICLE STRIP
      ═══════════════════════════════════════════════════════════════ */}
      {nextPost && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="section-label mb-2">Up Next</p>
                <h3 className="font-serif text-2xl lg:text-3xl font-light text-white max-w-2xl leading-snug">
                  {nextPost.title}
                </h3>
              </div>
              <Link href={`/news/${nextPost.slug}`} className="btn-gold shrink-0 gap-2 whitespace-nowrap">
                Read Article
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
