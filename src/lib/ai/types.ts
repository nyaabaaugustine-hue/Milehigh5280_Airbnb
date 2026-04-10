// ─── AI Tool System Types ─────────────────────────────────────────────────────
// These are the ONLY actions the AI is allowed to request.
// All execution is gated behind user confirmation.

export type RiskLevel = 'low' | 'medium' | 'high';

export type ToolName =
  | 'updateContent'
  | 'createProperty'
  | 'updateProperty'
  | 'updatePropertyPrice'
  | 'bulkUpdatePrices'
  | 'updateContactInfo'
  | 'publishBlogPost'
  | 'unpublishBlogPost'
  | 'approveReview'
  | 'deleteReview'
  | 'togglePropertyLive';

// ─── Tool Input Schemas ──────────────────────────────────────────────────────

export interface UpdateContentInput {
  key: string;       // e.g. "hero_title", "contact_email"
  value: string;
  section: string;   // e.g. "home", "about", "contact"
}

export interface CreatePropertyInput {
  name: string;
  tagline: string;
  description: string;
  pricePerNight: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  type: string;
}

export interface UpdatePropertyInput {
  propertyId: string;
  updates: Partial<{
    name: string;
    tagline: string;
    description: string;
    pricePerNight: number;
    pricePerNightGHS: number;
    isLive: boolean;
    badge: string;
  }>;
}

export interface UpdatePropertyPriceInput {
  propertyId: string;
  newPriceUSD: number;
  newPriceGHS?: number;
}

export interface BulkUpdatePricesInput {
  percentageChange: number;   // e.g. 10 = +10%, -5 = -5%
  currency: 'USD' | 'GHS' | 'both';
}

export interface UpdateContactInfoInput {
  field: 'phone' | 'whatsapp' | 'email' | 'location';
  value: string;
}

export interface PublishBlogPostInput {
  postId: string;
}

export interface ApproveReviewInput {
  reviewId: string;
}

export interface DeleteReviewInput {
  reviewId: string;
  reason: string;
}

export interface TogglePropertyLiveInput {
  propertyId: string;
  isLive: boolean;
}

// ─── Tool Call (what AI produces) ────────────────────────────────────────────

export type ToolInput =
  | UpdateContentInput
  | CreatePropertyInput
  | UpdatePropertyInput
  | UpdatePropertyPriceInput
  | BulkUpdatePricesInput
  | UpdateContactInfoInput
  | PublishBlogPostInput
  | ApproveReviewInput
  | DeleteReviewInput
  | TogglePropertyLiveInput;

export interface AIToolCall {
  tool: ToolName;
  input: ToolInput;
}

// ─── AI Response (strict contract) ──────────────────────────────────────────

export interface AIInterpretResponse {
  intent: string;              // Human-readable intent summary
  action: ToolName;            // Which tool to call
  data: ToolInput;             // Tool arguments
  risk_level: RiskLevel;
  requires_confirmation: boolean;
  message_to_user: string;     // What to show the user
  preview?: string;            // Optional preview of what will change
  clarification_needed?: boolean;
  clarification_question?: string;
  voice?: string;              // Voice feedback message
}

// ─── Action Log ──────────────────────────────────────────────────────────────

export interface ActionLog {
  id: string;
  timestamp: string;
  tool: ToolName;
  input: ToolInput;
  status: 'pending' | 'approved' | 'executed' | 'rejected' | 'failed' | 'undone';
  executedBy: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  airtableRecordId?: string;
  error?: string;
}

// ─── Chat Message ────────────────────────────────────────────────────────────

export type ChatMessageRole = 'user' | 'assistant' | 'system' | 'action';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: string;
  aiResponse?: AIInterpretResponse;  // Attached when role === 'action'
  actionStatus?: ActionLog['status'];
  logId?: string;
}

// ─── Execution Result ────────────────────────────────────────────────────────

export interface ExecutionResult {
  success: boolean;
  logId: string;
  message: string;
  airtableRecordId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}
