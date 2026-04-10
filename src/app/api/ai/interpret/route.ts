// POST /api/ai/interpret
// Input:  { message: string, conversationHistory?: Array<{role, content}> }
// Output: AIInterpretResponse
// Uses Grok API (xAI) for reliable LLM inference

import { NextRequest, NextResponse } from 'next/server';
import type { AIInterpretResponse } from '@/lib/ai/types';

const SYSTEM_PROMPT = `You are the AI Portal Manager (APM) for Milehigh5280, a luxury Ghana accommodation brand.

YOUR ROLE:
- Manage all website content through natural language commands
- Execute safe, auditable changes to the CMS
- Be concise and helpful

AVAILABLE ACTIONS (return as JSON):
1. updateContent - Update text: hero_title, hero_subtitle, about_text, footer_text, meta_description
2. updatePropertyPrice - Change prices (USD/GHS)
3. updateProperty - Modify property: name, location, bedrooms, bathrooms, amenities, is_live
4. approveReview - Approve guest reviews
5. deleteReview - Remove reviews (high risk)
6. publishBlogPost - Publish blog content
7. unpublishBlogPost - Unpublish blog content
8. updateContactInfo - Update: phone, whatsapp, email, address

SAFETY: All actions require confirmation. Never modify code.

RESPOND ONLY WITH VALID JSON like this:
{
  "intent": "brief summary",
  "action": "tool_name or null",
  "data": {"field": "value"},
  "risk_level": "low|medium|high",
  "requires_confirmation": true,
  "message_to_user": "What you'll do",
  "voice": "Short voice message",
  "preview": "What changes"
}

Examples:
User: "Change the price to $75"
{"intent":"Update price to $75","action":"updatePropertyPrice","data":{"propertyId":"1","newPriceUSD":75},"risk_level":"medium","requires_confirmation":true,"message_to_user":"I'll update the nightly price to $75 USD","voice":"Updating price to 75 dollars","preview":"Price: $75/night"}

User: "Update the hero headline"
{"intent":"Update hero title","action":"updateContent","data":{"key":"hero_title","value":"New Headline","section":"home"},"risk_level":"low","requires_confirmation":true,"message_to_user":"I'll update the hero headline to 'New Headline'","voice":"Updating the hero headline","preview":"Hero: New Headline"}`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    // Build conversation context
    const history = conversationHistory.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    // Check for Grok API key
    if (!process.env.GROK_API_KEY) {
      console.warn('[AI Interpret] GROK_API_KEY not set, falling back to rule-based parser');
      const response = parseIntent(message);
      return NextResponse.json(response);
    }

    // Use Grok API (xAI) - reliable and fast
    const grokResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    }).catch((err) => {
      console.error('[AI Interpret] Grok API error:', err);
      return null;
    });

    if (grokResponse?.ok) {
      const data = await grokResponse.json();
      const rawText = data.choices?.[0]?.message?.content ?? '';

      const clean = rawText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

      try {
        const parsed = JSON.parse(clean);
        return NextResponse.json(parsed);
      } catch (err) {
        console.error('[AI Interpret] JSON parse error:', err, 'Raw text:', rawText);
        // Fall through to rule-based parser
      }
    }

    // Fallback: Smart rule-based parser (works without API)
    const response = parseIntent(message);
    return NextResponse.json(response);

  } catch (err: unknown) {
    console.error('[AI Interpret] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

function parseIntent(message: string): AIInterpretResponse {
  const lower = message.toLowerCase();

  // Price updates
  if (lower.includes('price') || lower.includes('$') || lower.includes('cost')) {
    const priceMatch = message.match(/\$?\s*(\d+)/);
    if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      return {
        intent: `Update price to $${price}`,
        action: 'updatePropertyPrice',
        data: { propertyId: '1', newPriceUSD: price },
        risk_level: 'medium',
        requires_confirmation: true,
        message_to_user: `I'll update the nightly price to $${price} USD`,
        voice: `Updating price to ${price} dollars`,
        preview: `Price: $${price}/night`,
      };
    }
  }

  // Hero headline updates
  if (lower.includes('hero') || lower.includes('headline') || lower.includes('title')) {
    const titleMatch = message.match(/['"](.+?)['"]|to\s+(.+)$/i);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2] || 'New Headline') : 'New Headline';
    return {
      intent: 'Update hero headline',
      action: 'updateContent',
      data: { key: 'hero_title', value: title, section: 'home' },
      risk_level: 'low',
      requires_confirmation: true,
      message_to_user: `I'll update the hero headline to "${title}"`,
      voice: `Updating hero headline to ${title}`,
      preview: `Hero: ${title}`,
    };
  }

  // Publish/unpublish blog
  if (lower.includes('publish') && lower.includes('blog')) {
    return {
      intent: 'Publish latest blog post',
      action: 'publishBlogPost',
      data: { postId: 'latest' },
      risk_level: 'low',
      requires_confirmation: true,
      message_to_user: "I'll publish the latest blog post",
      voice: 'Publishing the latest blog post',
      preview: 'Blog: Published',
    };
  }

  // Approve review
  if (lower.includes('approve') && lower.includes('review')) {
    return {
      intent: 'Approve pending review',
      action: 'approveReview',
      data: { reviewId: 'pending' },
      risk_level: 'low',
      requires_confirmation: true,
      message_to_user: "I'll approve the most recent pending review",
      voice: 'Approving the pending review',
      preview: 'Review: Approved',
    };
  }

  // Phone/contact updates
  if (lower.includes('phone') || lower.includes('whatsapp') || lower.includes('contact')) {
    const phoneMatch = message.match(/\+?[\d\s-]+/);
    const value = phoneMatch ? phoneMatch[0].trim() : '+233 500 000 000';
    const field = lower.includes('whatsapp') ? 'whatsapp' : 'phone';
    return {
      intent: `Update ${field} number`,
      action: 'updateContactInfo',
      data: { field: field as 'phone' | 'whatsapp', value },
      risk_level: 'medium',
      requires_confirmation: true,
      message_to_user: `I'll update the ${field} number to ${value}`,
      voice: `Updating ${field} to ${value}`,
      preview: `${field}: ${value}`,
    };
  }

  // Email update
  if (lower.includes('email') || lower.includes('@')) {
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
    const value = emailMatch ? emailMatch[0] : 'new@email.com';
    return {
      intent: 'Update email address',
      action: 'updateContactInfo',
      data: { field: 'email', value },
      risk_level: 'medium',
      requires_confirmation: true,
      message_to_user: `I'll update the email to ${value}`,
      voice: `Updating email to ${value}`,
      preview: `Email: ${value}`,
    };
  }

  // Bulk price increase
  if ((lower.includes('increase') || lower.includes('raise') || lower.includes('+')) && lower.includes('price')) {
    const percentMatch = message.match(/(\d+)%/);
    const percent = percentMatch ? parseInt(percentMatch[1]) : 10;
    return {
      intent: `Increase all prices by ${percent}%`,
      action: 'bulkUpdatePrices',
      data: { percentageChange: percent, currency: 'USD' },
      risk_level: 'high',
      requires_confirmation: true,
      message_to_user: `I'll increase all property prices by ${percent}%`,
      voice: `Increasing all prices by ${percent} percent`,
      preview: `Prices: +${percent}%`,
    };
  }

  // Default: couldn't understand
  return {
    intent: 'Unrecognized command',
    action: 'updateContent' as AIInterpretResponse['action'],
    data: { key: '', value: '', section: '' },
    risk_level: 'low',
    requires_confirmation: false,
    message_to_user: "I didn't understand that. Try: 'Change the price to $75', 'Update the hero headline', 'Publish the blog post', or 'Approve the review'",
    voice: "I didn't understand that command. Try something like changing the price or updating the headline.",
    clarification_needed: false,
  };
}
