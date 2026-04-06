'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export const posts = [
  {
    id: 1,
    slug: 'hidden-gems-ayi-mensah',
    category: 'Travel Tips',
    categoryColor: 'text-emerald-400',
    title: "Hidden Gems of Ayi Mensah: A Local Guide to Ghana's Quietest Hill Town",
    excerpt:
      "Tucked away from Accra's buzz, Ayi Mensah is a lush, unhurried corner of Greater Accra where waterfalls meet red-dirt roads and birdsong replaces traffic. Here is what to do, eat, and explore.",
    author: 'Milehigh Team',
    date: 'March 2025',
    readTime: '5 min read',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380288/1_qwgwqd.png',
    tag: 'Local Guide',
    content: `Ayi Mensah sits quietly in the eastern hills of Greater Accra, just 30 minutes from the city centre but feeling worlds apart. Lush trees line narrow red-dirt roads, birds call from thick canopy overhead, and the air carries a cool freshness that feels almost impossible this close to a capital city.

**The Drive In**
Leave Accra via the Adenta-Dodowa road. As you climb, the city noise fades and the landscape opens into rolling green hills dotted with farms and small compounds. The drive itself is half the experience.

**Where to Walk**
The trail around the Ayi Mensah hills offers stunning views across Greater Accra. Early morning (before 7am) is magical — mist clings to the valleys below while the sky shifts from amber to gold. Wear good shoes; the red laterite paths are slippery after rain.

**Local Food**
Stop at any of the roadside chop bars for fresh palm nut soup with fufu — the kind cooked over open fire that you simply cannot recreate elsewhere. Ask for "light soup" if you prefer something clearer. Wash it down with sobolo (hibiscus iced tea) served in a polythene bag.

**Waterfalls Nearby**
A short drive further brings you to small seasonal waterfalls in the Aburi foothills. They flow strongest between June and September. Locals will guide you there for a modest tip — always worth it.

**When to Visit**
The dry season (November to March) gives clear skies and comfortable temperatures. But the rainy season (April to June) transforms everything into vivid, almost surreal green. Both are spectacular in different ways.

**Staying Here**
Milehigh5280 is perfectly positioned as your base. The apartment sits right in this peaceful neighbourhood — so you get all of this beauty on your doorstep, with a luxury private apartment to return to each evening.`,
  },
  {
    id: 2,
    slug: 'accra-vs-cape-town-2025',
    category: 'Ghana Culture',
    categoryColor: 'text-amber-400',
    title: 'Beyond the Beach: Why Travellers Are Choosing Accra Over Cape Town in 2025',
    excerpt:
      "With world-class restaurants, vibrant art galleries, and a booming short-stay market, Accra has quietly become West Africa's hottest luxury destination — and Ayi Mensah sits right at the heart of it.",
    author: 'Augustine N.',
    date: 'February 2025',
    readTime: '7 min read',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775302732/A_3_dcbuqu.jpg',
    tag: 'Destination',
    content: `For years, Cape Town dominated African luxury travel. Its mountains, wine lands, and world-famous beaches drew a particular kind of traveller — one willing to pay premium prices for dramatic scenery and European-style infrastructure. But something has quietly shifted. Accra is no longer a contender; it's a destination in its own right.

**The Food Revolution**
Accra's restaurant scene has exploded in the past three years. From the refined West African tasting menus at Alata to the open-fire grills at Kɔkɔ, the city now offers dining that holds its own against any major African capital. Local chefs are returning from London, Paris, and New York with global training and an insistence on celebrating Ghanaian ingredients.

**Art and Culture**
The galleries around the Oxford Street corridor and in Labone are showing work that is selling internationally. Accra Art Week, held each November, has become a fixture on the global art calendar. The energy in the creative community is electric — young Ghanaian artists, musicians, and designers are redefining what "made in Ghana" means.

**The Short-Stay Boom**
High-quality private apartments and villas have proliferated in areas like East Legon, Airport Residential, and — increasingly — Ayi Mensah. What was once only available to returning diaspora or expats is now accessible to any traveller who books in advance.

**Practical Advantages**
Ghana is politically stable, English-speaking, and has one of West Africa's most traveller-friendly visa-on-arrival policies. The healthcare infrastructure has improved dramatically. Direct flights from London, Amsterdam, and New York make access easy.

**Why Ayi Mensah Specifically**
While much of Accra is urban and fast-paced, Ayi Mensah offers a rare combination: the serenity of a hill-village setting with proximity (30 minutes) to the city's finest restaurants, galleries, and the airport. It is, quietly, one of the best-positioned places to stay in all of West Africa.`,
  },
  {
    id: 3,
    slug: 'inside-milehigh-properties',
    category: 'Host Spotlight',
    categoryColor: 'text-rose-400',
    title: 'Inside Milehigh Properties: How We Built a Luxury Hospitality Brand in Accra',
    excerpt:
      "From furnishing the first bedroom to managing five-star guest reviews, Milehigh Properties co-founder Herbert shares the journey of building Ghana's most thoughtful short-stay experience.",
    author: 'Herbert P.',
    date: 'January 2025',
    readTime: '6 min read',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg',
    tag: 'Our Story',
    content: `It started with a single bedroom. Not a villa, not a development — just one bedroom in an apartment in Ayi Mensah that I wanted to make feel genuinely special for anyone who stayed in it.

**The Beginning**
I had been frustrated, as a Ghanaian who travelled frequently, by the gap between what our country deserved and what international visitors actually experienced when they stayed here. Hotels that felt generic. Rentals that were clean but cold. Nothing that felt like Ghana at its best.

So in 2021 I set about solving it. I spent three months sourcing furniture — some local craftwork, some imported pieces — to create a space that felt both globally luxurious and distinctly Ghanaian. The first guests arrived in early 2022.

**The Reviews Changed Everything**
The first five-star review said: "This felt like staying at a boutique hotel, but with the warmth of staying at a friend's home." I printed it out and put it on my desk. That sentence has guided every decision since.

**Building the Team**
By the end of 2022 I had brought in a property manager, a dedicated cleaner who takes extraordinary pride in her work, and a 24-hour WhatsApp support line. We were not just renting a flat — we were running a hospitality operation.

**The Milehigh Standard**
Every guest receives a personalised welcome message, a local area guide, and a stocked kitchen for their first morning. Requests for airport pickup, restaurant reservations, or local tour guides are handled personally, not outsourced. This is the standard we hold ourselves to, and the reason our rating has stayed above 4.9 across every platform.

**What's Next**
More properties are in preparation — each selected for location, quality of build, and potential to deliver that same feeling: world-class by any standard, unmistakably Ghanaian in spirit.

If you have stayed with us, thank you. You made this possible. And if you haven't yet — we hope to welcome you soon.`,
  },
];

export default function BlogSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVis(true); observer.disconnect(); }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 lg:py-36 px-6 lg:px-12 max-w-[1440px] mx-auto" aria-label="Blog News and Stories">
      <div ref={ref}>
        {/* Header */}
        <div className={cn(
          'flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6 transition-all duration-700',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}>
          <div>
            <p className="section-label mb-4">From the Desk of Milehigh</p>
            <h2 className="font-serif font-light text-white leading-tight">
              Our News &amp;<br />
              <span className="italic text-gold-gradient">Stories</span>
            </h2>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3">
            <p className="text-[var(--text-muted)] text-sm max-w-xs text-left lg:text-right leading-relaxed">
              Travel tips, local discoveries, and behind-the-scenes stories from our team in Ayi Mensah, Accra.
            </p>
            <Link href="/blog" className="btn-ghost text-[0.7rem] py-3 px-6 inline-flex items-center gap-2">
              All Articles
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Gold Divider */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--border)]" />
          <div className="w-2 h-2 rotate-45 border border-[var(--gold)] opacity-60" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--border)]" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} parentVis={vis} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post, index, parentVis }: { post: typeof posts[0]; index: number; parentVis: boolean }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/blog/${post.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-all duration-700 cursor-pointer',
        hovered ? 'border-[var(--border-bright)] shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(201,150,58,0.1)] -translate-y-1' : '',
        parentVis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Image */}
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
        {!imgLoaded && <div className="absolute inset-0 bg-[var(--surface-3)] animate-pulse" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#080808]/75 backdrop-blur-sm border border-[var(--border)] px-3 py-1.5">
          <Tag size={9} className="text-[var(--gold)]" />
          <span className={cn('text-[0.58rem] font-sans font-medium tracking-widest uppercase', post.categoryColor)}>
            {post.category}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[#080808]/75 backdrop-blur-sm border border-[var(--border)] px-3 py-1.5">
          <Clock size={9} className="text-[var(--gold)]" />
          <span className="text-[0.58rem] font-sans text-[var(--text-muted)] tracking-wider">{post.readTime}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[0.55rem] tracking-[0.25em] uppercase font-sans font-medium text-[var(--gold)] border border-[var(--border)] px-2.5 py-1">
            {post.tag}
          </span>
          <span className="text-[var(--text-subtle)] text-[0.6rem] tracking-wider">{post.date}</span>
        </div>

        <h3 className={cn(
          'font-serif text-xl font-light leading-snug mb-3 transition-colors duration-300',
          hovered ? 'text-[var(--gold)]' : 'text-white',
        )}>
          {post.title}
        </h3>

        <p className="text-[var(--text-muted)] text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-[var(--border-bright)] flex items-center justify-center text-[0.55rem] font-bold text-[var(--gold)] uppercase"
              style={{ background: 'rgba(201,150,58,0.12)' }}>
              {post.author.charAt(0)}
            </div>
            <span className="text-[var(--text-muted)] text-[0.65rem] tracking-wide">{post.author}</span>
          </div>
          <span className={cn(
            'flex items-center gap-1 text-[0.65rem] font-sans font-medium tracking-[0.12em] uppercase transition-all duration-300',
            hovered ? 'text-[var(--gold)] gap-2' : 'text-[var(--text-subtle)]',
          )}>
            Read
            <ArrowRight size={11} className={cn('transition-transform duration-300', hovered ? 'translate-x-1' : '')} />
          </span>
        </div>
      </div>

      {/* Gold accent line on hover */}
      <div className={cn(
        'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--gold)] to-transparent transition-all duration-500',
        hovered ? 'w-full' : 'w-0',
      )} />
    </Link>
  );
}
