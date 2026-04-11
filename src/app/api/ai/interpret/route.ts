// POST /api/ai/interpret
// Input:  { message: string, conversationHistory?: Array<{role, content}> }
// Output: AIInterpretResponse — NEVER executes anything, only interprets.
//
// AI priority chain:
//  1. Anthropic Claude (ANTHROPIC_API_KEY)
//  2. Groq/Mixtral    (GROK_API_KEY)
//  3. Cloudflare AI  (CF_API_TOKEN + CF_ACCOUNT_ID)
//  4. Rule-based parser                     ← always works, no API needed

import { NextRequest, NextResponse } from 'next/server';
import type { AIInterpretResponse } from '@/lib/ai/types';

// ─── System prompt shared across all AI providers ────────────────────────────
const SYSTEM_PROMPT = `You are the AI Portal Manager (APM) for Milehigh5280 — Ghana's premier luxury accommodation brand.

YOUR ROLE: Act as a helpful website assistant with FULL access to manage all website content through natural language commands.

AVAILABLE ACTIONS — Use ANY of these:

=== CONTENT MANAGEMENT ===
1. updateContent — Update any website text
   - hero_title, hero_subtitle, tagline, about_title, about_text, about_image
   - footer_text, footer_contact, footer_address
   - meta_title, meta_description, meta_keywords
   - any text element on any page

2. updateContactInfo — Update contact details
   - phone, whatsapp, email, location, address

=== PROPERTIES ===
3. createProperty — Create a new property listing
   - name, tagline, description, pricePerNight, location, bedrooms, bathrooms, guests
   - type (villa/apartment/penthouse/cottage), amenities

4. updateProperty — Modify an existing property
   - name, tagline, description, badge (Editors Choice/Most Booked/New Arrival/Exclusive)
   - images, amenities

5. updatePropertyPrice — Change nightly price
   - newPriceUSD, newPriceGHS (auto-calculated)

6. togglePropertyLive — Publish or unpublish a property
   - isLive: true/false

7. bulkUpdatePrices — Adjust all property prices
   - percentageChange (+/-%), currency (USD/GHS/both)

=== BLOG POSTS ===
8. createBlogPost — Create a new blog article
   - title, excerpt, content, category, tag, image, author

9. updateBlogPost — Edit an existing blog post
   - title, excerpt, content, category, tag, image

10. publishBlogPost — Publish a blog post (make public)
11. unpublishBlogPost — Unpublish a blog post (make draft)

=== REVIEWS ===
12. approveReview — Approve a guest review (make public)
13. deleteReview — Permanently delete a review (HIGH risk - requires double confirmation)

=== AMENITIES ===
14. createAmenity — Add a new amenity
   - name, icon, category

15. updateAmenity — Modify an amenity
16. deleteAmenity — Remove an amenity

=== SETTINGS ===
17. updateSiteSettings — Update site-wide settings
   - currency, timezone, min_nights, checkin_time, checkout_time

=== EXAMPLES ===

User: "Update the hero headline to Your Private Palm Retreat"
Action: updateContent
Data: {"key":"hero_title","value":"Your Private Palm Retreat","section":"home"}

User: "Add a new property called Serenity Villa priced at $85"
Action: createProperty
Data: {"name":"Serenity Villa","tagline":"Your serene escape","description":"A beautiful villa...","pricePerNight":85,"location":"Ayi Mensah","bedrooms":2,"bathrooms":2,"guests":4,"type":"villa"}

User: "Create a blog post about Ghana travel tips"
Action: createBlogPost
Data: {"title":"Top Ghana Travel Tips for 2025","excerpt":"Discover the best tips...","content":"Full article content...","category":"Travel Tips","tag":"ghana"}

User: "Increase all prices by 10%"
Action: bulkUpdatePrices
Data: {"percentageChange":10,"currency":"both"}

User: "Publish the blog post about Accra"
Action: publishBlogPost
Data: {"postSlug":"accra-travel-tips"}

STRICT RESPONSE FORMAT — respond ONLY with this JSON (no extra text, no markdown):
{
  "intent": "brief one-line summary",
  "action": "tool_name | null",
  "data": {},
  "risk_level": "low | medium | high",
  "requires_confirmation": true/false,
  "message_to_user": "Friendly explanation",
  "preview": "Short preview or null",
  "clarification_needed": true/false,
  "clarification_question": "Question if needed or null"
}

IMPORTANT:
- Set action to null only if you don't understand the request
- For anything related to website management, respond with appropriate action
- Be helpful and proactive — suggest useful actions
- Ask clarifying questions if user request is ambiguous
- Default to requires_confirmation: true for any changes`;

// ─── Anthropic API call ───────────────────────────────────────────────────────
async function callAnthropic(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key.includes('your-key-here') || key.length < 20) return null;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001',   // fast + cheap for this use case
        max_tokens: 600,
        system:     SYSTEM_PROMPT,
        messages:   [...history, { role: 'user', content: message }],
      }),
    });

    if (!res.ok) {
      console.error('[AI Interpret] Anthropic error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.content?.[0]?.text ?? null;
  } catch (err) {
    console.error('[AI Interpret] Anthropic fetch failed:', err);
    return null;
  }
}

// ─── Groq API call ────────────────────────────────────────────────────────────
async function callGroq(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<string | null> {
  const key = process.env.GROK_API_KEY;
  if (!key || key.length < 10) return null;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model:       'llama3-8b-8192',    // reliable, fast Groq model
        max_tokens:  600,
        temperature: 0.2,
        messages:    [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
          { role: 'user', content: message },
        ],
      }),
    });

    if (!res.ok) {
      console.error('[AI Interpret] Groq error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error('[AI Interpret] Groq fetch failed:', err);
    return null;
  }
}

// ─── Cloudflare Workers AI call ───────────────────────────────────────────────
async function callCloudflare(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<string | null> {
  const token = process.env.CF_API_TOKEN;
  const accountId = process.env.CF_ACCOUNT_ID;
  
  if (!token || !accountId || token.length < 10 || accountId.length < 10) {
    return null;
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: message },
          ],
          max_tokens: 600,
        }),
      }
    );

    if (!res.ok) {
      console.error('[AI Interpret] Cloudflare error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.result?.response ?? null;
  } catch (err) {
    console.error('[AI Interpret] Cloudflare fetch failed:', err);
    return null;
  }
}

// ─── Parse raw AI text to AIInterpretResponse ─────────────────────────────────
function parseAIResponse(raw: string): AIInterpretResponse | null {
  const clean = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(clean);
    // Validate it has the required shape
    if (typeof parsed.message_to_user === 'string') return parsed as AIInterpretResponse;
    return null;
  } catch {
    return null;
  }
}

// ─── Rule-based fallback (works with zero API keys) ──────────────────────────
function ruleBasedParser(message: string): AIInterpretResponse {
  const lower = message.toLowerCase().trim();

  // ── Greetings / chitchat ────────────────────────────────────────────────────
  const greetings = ['hello', 'hi', 'hey', 'howdy', 'hiya', 'good morning', 'good evening', 'sup', 'what\'s up'];
  if (greetings.some(g => lower === g || lower.startsWith(g + ' ') || lower.startsWith(g + '!'))) {
    return {
      intent:                 'Greeting',
      action:                 null as unknown as AIInterpretResponse['action'],
      data:                   {} as AIInterpretResponse['data'],
      risk_level:             'low',
      requires_confirmation:  false,
      message_to_user:        "Hi! I'm your AI website assistant 👋\n\nI can help you update Milehigh5280's website content. Try:\n• \"Change the price to $75\"\n• \"Update the hero headline to Welcome to Paradise\"\n• \"Increase all prices by 10%\"\n• \"Publish the blog post\"\n• \"Approve the latest review\"",
      preview:                null as unknown as string,
      clarification_needed:   false,
      clarification_question: null as unknown as string,
    };
  }

  // ── Price update (single property) ─────────────────────────────────────────
  if (lower.includes('price') || lower.includes('cost') || lower.includes('rate')) {
    const priceMatch = message.match(/\$\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:dollars?|usd)/i);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1] || priceMatch[2]);
      const ghs   = Math.round(price * 15.8);
      return {
        intent:                `Update nightly price to $${price}`,
        action:                'updatePropertyPrice',
        data:                  { propertyId: '1', newPriceUSD: price, newPriceGHS: ghs },
        risk_level:            'medium',
        requires_confirmation: true,
        message_to_user:       `I'll update the nightly price to $${price} USD (≈ GHS ${ghs.toLocaleString()}). Confirm to apply?`,
        preview:               `Price: $${price}/night`,
        clarification_needed:  false,
        clarification_question: null as unknown as string,
      };
    }

    // Bulk % change
    const percentMatch = message.match(/(\d+)\s*%/);
    if (percentMatch) {
      const pct       = parseInt(percentMatch[1]);
      const direction = lower.includes('decrease') || lower.includes('reduce') || lower.includes('drop') || lower.includes('lower') ? -pct : pct;
      return {
        intent:                `${direction > 0 ? 'Increase' : 'Decrease'} all prices by ${Math.abs(direction)}%`,
        action:                'bulkUpdatePrices',
        data:                  { percentageChange: direction, currency: 'both' },
        risk_level:            'high',
        requires_confirmation: true,
        message_to_user:       `⚠️ I'll ${direction > 0 ? 'increase' : 'decrease'} ALL property prices by ${Math.abs(direction)}%. This affects all listings. Confirm?`,
        preview:               `All prices: ${direction > 0 ? '+' : ''}${direction}%`,
        clarification_needed:  false,
        clarification_question: null as unknown as string,
      };
    }
  }

  // ── Hero / headline / title ─────────────────────────────────────────────────
  if (lower.includes('hero') || lower.includes('headline') || lower.includes('heading') ||
      (lower.includes('title') && !lower.includes('blog'))) {
    // Extract quoted value or text after "to"
    const quoted = message.match(/['"](.+?)['"]/);
    const toText = message.match(/\bto\b\s+(.+)$/i);
    const value  = quoted?.[1] ?? toText?.[1]?.trim() ?? '';

    if (!value) {
      return {
        intent:                'Update hero headline — needs value',
        action:                null as unknown as AIInterpretResponse['action'],
        data:                  {} as AIInterpretResponse['data'],
        risk_level:            'low',
        requires_confirmation: false,
        message_to_user:       'What should the new headline say? Try: "Update the headline to Your Luxury Escape in Ghana"',
        preview:               null as unknown as string,
        clarification_needed:   true,
        clarification_question: 'What text should the new headline say?',
      };
    }

    return {
      intent:                `Update homepage headline`,
      action:                'updateContent',
      data:                  { key: 'hero_title', value, section: 'home' },
      risk_level:            'low',
      requires_confirmation: true,
      message_to_user:       `I'll update the homepage headline to "${value}". Confirm?`,
      preview:               `Hero title: "${value}"`,
      clarification_needed:  false,
      clarification_question: null as unknown as string,
    };
  }

  // ── Blog post ───────────────────────────────────────────────────────────────
  if (lower.includes('blog') || lower.includes('post') || lower.includes('article')) {
    const unpublish = lower.includes('unpublish') || lower.includes('hide') || lower.includes('take down');
    return {
      intent:                `${unpublish ? 'Unpublish' : 'Publish'} blog post`,
      action:                unpublish ? 'unpublishBlogPost' : 'publishBlogPost',
      data:                  { postId: 'latest' },
      risk_level:            'low',
      requires_confirmation: true,
      message_to_user:       `I'll ${unpublish ? 'unpublish' : 'publish'} the latest blog post. Confirm?`,
      preview:               `Blog post: ${unpublish ? 'Hidden' : 'Published ✅'}`,
      clarification_needed:  false,
      clarification_question: null as unknown as string,
    };
  }

  // ── Review ──────────────────────────────────────────────────────────────────
  if (lower.includes('review')) {
    const del = lower.includes('delete') || lower.includes('remove') || lower.includes('hide');
    if (del) {
      return {
        intent:                'Delete review',
        action:                'deleteReview',
        data:                  { reviewId: 'pending', reason: 'Admin request' },
        risk_level:            'high',
        requires_confirmation: true,
        message_to_user:       '⚠️ I\'ll permanently delete this review. This cannot be undone. Confirm?',
        preview:               'Review: DELETED',
        clarification_needed:  false,
        clarification_question: null as unknown as string,
      };
    }
    return {
      intent:                'Approve pending review',
      action:                'approveReview',
      data:                  { reviewId: 'pending' },
      risk_level:            'low',
      requires_confirmation: true,
      message_to_user:       "I'll approve the most recent pending review and make it public. Confirm?",
      preview:               'Review: Approved ✅',
      clarification_needed:  false,
      clarification_question: null as unknown as string,
    };
  }

  // ── Contact / phone / WhatsApp / email ──────────────────────────────────────
  if (lower.includes('phone') || lower.includes('whatsapp') || lower.includes('contact') ||
      lower.includes('email') || lower.includes('@')) {
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = message.match(/\+?[\d][\d\s\-()]{6,}/);

    if (emailMatch) {
      return {
        intent:                'Update email address',
        action:                'updateContactInfo',
        data:                  { field: 'email', value: emailMatch[0] },
        risk_level:            'medium',
        requires_confirmation: true,
        message_to_user:       `I'll update the contact email to ${emailMatch[0]}. Confirm?`,
        preview:               `Email: ${emailMatch[0]}`,
        clarification_needed:  false,
        clarification_question: null as unknown as string,
      };
    }

    if (phoneMatch) {
      const field = lower.includes('whatsapp') ? 'whatsapp' : 'phone';
      const value = phoneMatch[0].trim();
      return {
        intent:                `Update ${field} number`,
        action:                'updateContactInfo',
        data:                  { field: field as 'phone' | 'whatsapp', value },
        risk_level:            'medium',
        requires_confirmation: true,
        message_to_user:       `I'll update the ${field} to ${value}. Confirm?`,
        preview:               `${field}: ${value}`,
        clarification_needed:  false,
        clarification_question: null as unknown as string,
      };
    }
  }

  // ── Property live/unpublish ──────────────────────────────────────────────────
  if (lower.includes('unpublish') || lower.includes('take down') || lower.includes('go live') ||
      lower.includes('make live') || lower.includes('publish') && lower.includes('property')) {
    const goLive = lower.includes('live') || lower.includes('publish');
    return {
      intent:                `${goLive ? 'Publish' : 'Unpublish'} property`,
      action:                'togglePropertyLive',
      data:                  { propertyId: '1', isLive: goLive },
      risk_level:            'high',
      requires_confirmation: true,
      message_to_user:       `⚠️ I'll ${goLive ? 'make Milehigh5280 LIVE (visible to guests)' : 'UNPUBLISH Milehigh5280 (hidden from guests)'}. Confirm?`,
      preview:               `Property: ${goLive ? 'LIVE ✅' : 'HIDDEN ⛔'}`,
      clarification_needed:  false,
      clarification_question: null as unknown as string,
    };
  }

  // ── GHS / cedis price ────────────────────────────────────────────────────────
  if ((lower.includes('ghs') || lower.includes('cedi') || lower.includes('₵')) && lower.includes('price')) {
    const ghsMatch = message.match(/(\d+(?:,\d+)?)/);
    if (ghsMatch) {
      const ghs = parseInt(ghsMatch[1].replace(',', ''));
      const usd = Math.round(ghs / 15.8);
      return {
        intent:                `Update price to GHS ${ghs}`,
        action:                'updatePropertyPrice',
        data:                  { propertyId: '1', newPriceUSD: usd, newPriceGHS: ghs },
        risk_level:            'medium',
        requires_confirmation: true,
        message_to_user:       `I'll update the nightly price to GHS ${ghs.toLocaleString()} (≈ $${usd} USD). Confirm?`,
        preview:               `Price: GHS ${ghs.toLocaleString()}/night`,
        clarification_needed:  false,
        clarification_question: null as unknown as string,
      };
    }
  }

  // ── Unrecognized — return null action so chat shows plain assistant message ──
  return {
    intent:                'Unrecognized request',
    action:                null as unknown as AIInterpretResponse['action'],
    data:                  {} as AIInterpretResponse['data'],
    risk_level:            'low',
    requires_confirmation: false,
    message_to_user:       "I didn't quite understand that. Here are things I can help with:\n\n• **Prices** — \"Change the price to $75\"\n• **Headlines** — \"Update the hero headline to Welcome to Paradise\"\n• **Bulk pricing** — \"Increase all prices by 10%\"\n• **Blog posts** — \"Publish the latest blog post\"\n• **Reviews** — \"Approve the latest review\"\n• **Contact** — \"Update the phone number to +233 055 123 4567\"\n• **Property status** — \"Take the property live\" or \"Unpublish the property\"",
    preview:               null as unknown as string,
    clarification_needed:  false,
    clarification_question: null as unknown as string,
  };
}

// ─── Main POST handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    // Build history for context window
    const history: Array<{ role: 'user' | 'assistant'; content: string }> = conversationHistory
      .slice(-10)
      .filter((m: { role: string }) => m.role === 'user' || m.role === 'assistant')
      .map((m: { role: string; content: string }) => ({
        role:    m.role as 'user' | 'assistant',
        content: m.content,
      }));

    // ── Try AI providers in priority order ────────────────────────────────────

    // 1. Anthropic Claude
    const anthropicRaw = await callAnthropic(message, history);
    if (anthropicRaw) {
      const parsed = parseAIResponse(anthropicRaw);
      if (parsed) {
        console.log('[AI Interpret] Used: Anthropic');
        return NextResponse.json(parsed);
      }
    }

    // 2. Groq / Mixtral
    const groqRaw = await callGroq(message, history);
    if (groqRaw) {
      const parsed = parseAIResponse(groqRaw);
      if (parsed) {
        console.log('[AI Interpret] Used: Groq');
        return NextResponse.json(parsed);
      }
    }

    // 3. Cloudflare Workers AI
    const cfRaw = await callCloudflare(message, history);
    if (cfRaw) {
      const parsed = parseAIResponse(cfRaw);
      if (parsed) {
        console.log('[AI Interpret] Used: Cloudflare AI');
        return NextResponse.json(parsed);
      }
    }

    // 4. Rule-based fallback (always works)
    console.log('[AI Interpret] Used: Rule-based fallback');
    const fallback = ruleBasedParser(message);
    return NextResponse.json(fallback);

  } catch (err: unknown) {
    console.error('[AI Interpret] Unexpected error:', err);
    // Even on catastrophic error, return a user-friendly response
    const emergency = ruleBasedParser((await req.json().catch(() => ({ message: '' }))).message ?? '');
    return NextResponse.json(emergency);
  }
}
