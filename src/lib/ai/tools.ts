// ─── Tool Definitions & Risk Catalogue ───────────────────────────────────────
// Each tool has a defined risk level, description, and schema hint.
// The AI system prompt references this catalogue.

import type { ToolName, RiskLevel } from './types';

export interface ToolDefinition {
  name: ToolName;
  description: string;
  riskLevel: RiskLevel;
  riskReason: string;
  requiresConfirmation: boolean;
  inputSchema: string;  // Human-readable schema hint for the system prompt
}

export const TOOL_CATALOGUE: ToolDefinition[] = [
  {
    name: 'updateContent',
    description: 'Update a single piece of text content on the website (headline, description, tagline, etc.)',
    riskLevel: 'low',
    riskReason: 'Edits a single text field. Easily reversible.',
    requiresConfirmation: true,
    inputSchema: '{ key: string, value: string, section: string }',
  },
  {
    name: 'updateContactInfo',
    description: 'Update phone number, WhatsApp number, email address, or location',
    riskLevel: 'medium',
    riskReason: 'Affects guest communication channels sitewide.',
    requiresConfirmation: true,
    inputSchema: '{ field: "phone"|"whatsapp"|"email"|"location", value: string }',
  },
  {
    name: 'updatePropertyPrice',
    description: 'Update the nightly price for a specific property',
    riskLevel: 'medium',
    riskReason: 'Directly affects booking revenue.',
    requiresConfirmation: true,
    inputSchema: '{ propertyId: string, newPriceUSD: number, newPriceGHS?: number }',
  },
  {
    name: 'bulkUpdatePrices',
    description: 'Apply a percentage increase or decrease to ALL property prices',
    riskLevel: 'high',
    riskReason: 'Affects all properties simultaneously. Revenue impact.',
    requiresConfirmation: true,
    inputSchema: '{ percentageChange: number, currency: "USD"|"GHS"|"both" }',
  },
  {
    name: 'createProperty',
    description: 'Add a brand new property listing to the website',
    riskLevel: 'medium',
    riskReason: 'Creates new public-facing content.',
    requiresConfirmation: true,
    inputSchema: '{ name, tagline, description, pricePerNight, location, bedrooms, bathrooms, guests, type }',
  },
  {
    name: 'updateProperty',
    description: 'Update specific fields on an existing property listing',
    riskLevel: 'medium',
    riskReason: 'Modifies live property content.',
    requiresConfirmation: true,
    inputSchema: '{ propertyId: string, updates: { name?, tagline?, description?, pricePerNight?, isLive?, badge? } }',
  },
  {
    name: 'togglePropertyLive',
    description: 'Publish or unpublish a property (make it visible/invisible to guests)',
    riskLevel: 'high',
    riskReason: 'Toggling live status directly affects guest-facing availability.',
    requiresConfirmation: true,
    inputSchema: '{ propertyId: string, isLive: boolean }',
  },
  {
    name: 'publishBlogPost',
    description: 'Publish or unpublish a blog post',
    riskLevel: 'low',
    riskReason: 'Controls content visibility only.',
    requiresConfirmation: true,
    inputSchema: '{ postId: string }',
  },
  {
    name: 'unpublishBlogPost',
    description: 'Unpublish a blog post (hide from website)',
    riskLevel: 'low',
    riskReason: 'Hides content from public, easily reversed.',
    requiresConfirmation: true,
    inputSchema: '{ postId: string }',
  },
  {
    name: 'approveReview',
    description: 'Approve a pending guest review to make it publicly visible',
    riskLevel: 'low',
    riskReason: 'Only makes verified reviews public.',
    requiresConfirmation: false,
    inputSchema: '{ reviewId: string }',
  },
  {
    name: 'deleteReview',
    description: 'Delete a guest review permanently',
    riskLevel: 'high',
    riskReason: 'Permanently removes content. Cannot be undone.',
    requiresConfirmation: true,
    inputSchema: '{ reviewId: string, reason: string }',
  },
];

export const getTool = (name: ToolName): ToolDefinition | undefined =>
  TOOL_CATALOGUE.find(t => t.name === name);

// ─── System Prompt Builder ────────────────────────────────────────────────────
// This is injected into the AI model to constrain its behaviour.

export function buildSystemPrompt(): string {
  const toolList = TOOL_CATALOGUE.map(t =>
    `- ${t.name} (risk: ${t.riskLevel}): ${t.description}\n  Schema: ${t.inputSchema}`
  ).join('\n');

  return `You are the AI administrator for Milehigh5280, a luxury short-stay property website in Accra, Ghana.

YOUR ONLY JOB is to interpret admin requests and produce structured JSON actions.

## AVAILABLE TOOLS
${toolList}

## STRICT RULES
1. You MUST NEVER modify code, access environment variables, or trigger deployments.
2. You MUST ONLY use the tools listed above.
3. You MUST ALWAYS return valid JSON in the exact format below — nothing else.
4. If a request is ambiguous, set clarification_needed: true and ask one clear question.
5. If a request is outside your tools, explain politely and set action to null.

## RESPONSE FORMAT (STRICT - return ONLY this JSON, no markdown, no explanation outside JSON)
{
  "intent": "<short human-readable summary of what you understood>",
  "action": "<tool name or null>",
  "data": { <tool input matching the schema> },
  "risk_level": "low | medium | high",
  "requires_confirmation": true,
  "message_to_user": "<friendly message explaining what will happen>",
  "preview": "<optional: what the change will look like>",
  "clarification_needed": false,
  "clarification_question": null
}

## CURRENT PROPERTY
- Property 1: "Milehigh5280 🌴" (ID: 1, slug: the-palm-ayi-mensah) — Live

## EXAMPLES
User: "Change the price to $75 per night"
Response: { "intent": "Update Milehigh5280 nightly price to $75", "action": "updatePropertyPrice", "data": { "propertyId": "1", "newPriceUSD": 75, "newPriceGHS": 1185 }, "risk_level": "medium", "requires_confirmation": true, "message_to_user": "I will update the nightly price for Milehigh5280 from the current rate to $75 USD (≈ GHS 1,185). Do you want to proceed?", "preview": "Price: $75/night", "clarification_needed": false, "clarification_question": null }

User: "Update the hero headline to Welcome to Paradise"
Response: { "intent": "Update homepage hero headline", "action": "updateContent", "data": { "key": "hero_title", "value": "Welcome to Paradise", "section": "home" }, "risk_level": "low", "requires_confirmation": true, "message_to_user": "I will update the homepage headline to \\"Welcome to Paradise\\". Ready to apply?", "preview": "Hero title: \\"Welcome to Paradise\\"", "clarification_needed": false, "clarification_question": null }`;
}
