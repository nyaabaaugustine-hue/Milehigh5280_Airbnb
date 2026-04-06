'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const posts = [
  {
    id: 1,
    category: 'Travel Tips',
    categoryColor: 'text-emerald-400',
    title: 'Hidden Gems of Ayi Mensah: A Local's Guide to Ghana's Quietest Hill Town',
    excerpt:
      'Tucked away from Accra's buzz, Ayi Mensah is a lush, unhurried corner of Greater Accra where waterfalls meet red-dirt roads and birdsong replaces traffic. Here's what to do, eat, and explore.',
    author: 'Milehigh Team',
    date: 'March 2025',
    readTime: '5 min read',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380288/1_qwgwqd.png',
    tag: 'Local Guide',
  },
  {
    id: 2,
    category: 'Ghana Culture',
    categoryColor: 'text-amber-400',
    title: 'Beyond the Beach: Why Discerning Travellers Are Choosing Accra Over Cape Town in 2025',
    excerpt:
      'With world-class restaurants, vibrant art galleries, and a booming short-stay market, Accra has quietly become West Africa's hottest luxury destination — and Ayi Mensah sits right at the heart of it.',
    author: 'Augustine N.',
    date: 'February 2025',
    readTime: '7 min read',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302732/A_3_dcbuqu.jpg',
    tag: 'Destination',
  },
  {
    id: 3,
    category: 'Host Spotlight',
    categoryColor: 'text-rose-400',
    title: 'Inside Milehigh Properties: How We Turned One Apartment into a Luxury Hospitality Brand',
    excerpt:
      'From furnishing the first bedroom to managing five-star guest reviews, Milehigh Properties co-founder Herbert shares the journey of building Ghana's most thoughtful short-stay experience.',
    author: 'Herbert P.',
    date: 'January 2025',
    readTime: '6 min read',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg',
    tag: 'Our Story',
  },
];

export default function BlogSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="py-24 lg:py-36 px-6 lg:px-12 max-w-[1440px] mx-auto"
      aria-label="Blog — Our News and Stories"
    >
      <div ref={ref}>
        {/* ── Header ── */}
        <div
          className={cn(
            'flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6 transition-all duration-700',
            vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <div>
            <p className="section-label mb-4">From the Desk of Milehigh</p>
            <h2 className="font-serif font-light text-white leading-tight">
              Our News &amp;<br />
              <span className="italic text-gold-gradient">Stories</span>
            </h2>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3">
            <p className="text-[var(--text-muted)] text-sm max-w-xs text-left lg:text-right leading-relaxed">
              Travel tips, local discoveries, and behind-the-scenes stories from our team
              in Ayi Mensah, Accra.
            </p>
            <a
              href="#"
              className="btn-ghost text-[0.7rem] py-3 px-6 inline-flex items-center gap-2"
            >
              All Articles
              <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* ── Gold Divider ── */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--border)]" />
          <div className="w-2 h-2 rotate-45 border border-[var(--gold)] opacity-60" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--border)]" />
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} parentVis={vis} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Individual Blog Card ─────────────────────────────────────────────────────
function BlogCard({
  post,
  index,
  parentVis,
}: {
  post: (typeof posts)[0];
  index: number;
  parentVis: boolean;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-all duration-700 cursor-pointer',
        hovered
          ? 'border-[var(--border-bright)] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(201,150,58,0.1)] -translate-y-1'
          : '',
        parentVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* ── Image ── */}
      <div className="relative h-56 overflow-hidden bg-[var(--surface-2)] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          onLoad={() => setImgLoaded(true)}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-all duration-700',
            hovered ? 'scale-105' : 'scale-100',
            imgLoaded ? 'opacity-100' : 'opacity-0',
          )}
        />
        {/* Skeleton while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[var(--surface-3)] animate-pulse" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/80 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[var(--obsidian)]/75 backdrop-blur-sm border border-[var(--border)] px-3 py-1.5">
          <Tag size={9} className="text-[var(--gold)]" />
          <span className={cn('text-[0.58rem] font-sans font-medium tracking-widest uppercase', post.categoryColor)}>
            {post.category}
          </span>
        </div>

        {/* Read time */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[var(--obsidian)]/75 backdrop-blur-sm border border-[var(--border)] px-3 py-1.5">
          <Clock size={9} className="text-[var(--gold)]" />
          <span className="text-[0.58rem] font-sans text-[var(--text-muted)] tracking-wider">{post.readTime}</span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-6">
        {/* Tag pill */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[0.55rem] tracking-[0.25em] uppercase font-sans font-medium text-[var(--gold)] border border-[var(--border)] px-2.5 py-1">
            {post.tag}
          </span>
          <span className="text-[var(--text-subtle)] text-[0.6rem] tracking-wider">{post.date}</span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            'font-serif text-xl font-light leading-snug mb-3 transition-colors duration-300',
            hovered ? 'text-[var(--gold)]' : 'text-white',
          )}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div className="flex items-center gap-2">
            {/* Author avatar placeholder */}
            <div
              className="w-7 h-7 rounded-full border border-[var(--border-bright)] flex items-center justify-center text-[0.55rem] font-bold text-[var(--gold)] uppercase"
              style={{ background: 'rgba(201,150,58,0.12)' }}
            >
              {post.author.charAt(0)}
            </div>
            <span className="text-[var(--text-muted)] text-[0.65rem] tracking-wide">{post.author}</span>
          </div>
          <span
            className={cn(
              'flex items-center gap-1 text-[0.65rem] font-sans font-medium tracking-[0.12em] uppercase transition-all duration-300',
              hovered ? 'text-[var(--gold)] gap-2' : 'text-[var(--text-subtle)]',
            )}
          >
            Read
            <ArrowRight size={11} className={cn('transition-transform duration-300', hovered ? 'translate-x-1' : '')} />
          </span>
        </div>
      </div>

      {/* ── Gold accent line on hover ── */}
      <div
        className={cn(
          'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--gold)] to-transparent transition-all duration-500',
          hovered ? 'w-full' : 'w-0',
        )}
      />
    </article>
  );
}
