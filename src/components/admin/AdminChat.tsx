'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Bot, User, AlertTriangle, CheckCircle, XCircle,
  Loader2, History, Trash2, RotateCcw, ChevronDown, ChevronUp,
  ShieldAlert, ShieldCheck, Shield, Zap, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, AIInterpretResponse, ActionLog } from '@/lib/ai/types';

// ─── Suggested prompts ────────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  { label: 'Update price',        prompt: 'Change the nightly price to $65' },
  { label: 'Edit headline',       prompt: 'Update the homepage headline to "Your Luxury Escape in Ghana"' },
  { label: 'Update phone',        prompt: 'Change the phone number to +233 055 123 4567' },
  { label: 'Publish blog post',   prompt: 'Publish the latest blog post' },
  { label: 'Increase all prices', prompt: 'Increase all property prices by 10%' },
  { label: 'Approve a review',    prompt: 'Approve the most recent pending review' },
];

// ─── Risk badge ───────────────────────────────────────────────────────────────
function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cfg = {
    low:    { Icon: ShieldCheck,  color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', label: 'Low Risk' },
    medium: { Icon: Shield,       color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',       label: 'Medium Risk' },
    high:   { Icon: ShieldAlert,  color: 'text-red-400 bg-red-400/10 border-red-400/20',             label: 'High Risk' },
  }[level];

  return (
    <span className={cn('inline-flex items-center gap-1 text-[0.6rem] uppercase tracking-widest px-2 py-1 border', cfg.color)}>
      <cfg.Icon size={10} />
      {cfg.label}
    </span>
  );
}

// ─── Action Preview Card ──────────────────────────────────────────────────────
function ActionPreviewCard({
  aiResponse,
  onConfirm,
  onReject,
  status,
  loading,
}: {
  aiResponse: AIInterpretResponse;
  onConfirm: () => void;
  onReject: () => void;
  status?: ActionLog['status'];
  loading?: boolean;
}) {
  const [showData, setShowData] = useState(false);
  const executed = status === 'executed';
  const rejected = status === 'rejected';
  const failed   = status === 'failed';

  return (
    <div className={cn(
      'mt-3 border rounded-sm overflow-hidden transition-all duration-300',
      executed ? 'border-emerald-500/30 bg-emerald-500/5' :
      rejected ? 'border-red-500/20 bg-red-500/5 opacity-60' :
      failed   ? 'border-red-500/40 bg-red-500/10' :
                 'border-[var(--gold)]/30 bg-[var(--gold)]/5',
    )}>
      {/* Header */}
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[0.6rem] tracking-[0.2em] uppercase font-mono text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 border border-[var(--gold)]/20">
              {aiResponse.action}
            </span>
            <RiskBadge level={aiResponse.risk_level} />
          </div>
          <p className="text-white text-sm font-medium leading-snug">{aiResponse.message_to_user}</p>
          {aiResponse.preview && (
            <p className="text-[var(--text-muted)] text-xs mt-1 font-mono">{aiResponse.preview}</p>
          )}
        </div>

        {/* Status icon */}
        {executed && <CheckCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" />}
        {rejected  && <XCircle   size={20} className="text-red-400 shrink-0 mt-0.5" />}
        {failed    && <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />}
      </div>

      {/* Data preview (collapsible) */}
      {Object.keys(aiResponse.data ?? {}).length > 0 && (
        <div className="border-t border-[var(--border)]">
          <button
            onClick={() => setShowData(v => !v)}
            className="w-full px-4 py-2 flex items-center gap-2 text-[var(--text-muted)] text-xs hover:text-white transition-colors"
          >
            {showData ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showData ? 'Hide' : 'Show'} action data
          </button>
          {showData && (
            <div className="px-4 pb-3">
              <pre className="text-[0.65rem] text-[var(--text-muted)] bg-[var(--surface-3)] p-3 overflow-x-auto rounded-sm leading-relaxed">
                {JSON.stringify(aiResponse.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Confirm / Reject buttons */}
      {!executed && !rejected && !failed && (
        <div className="border-t border-[var(--border)] px-4 py-3 flex items-center gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--gold)] text-[#080808] text-xs font-bold uppercase tracking-widest py-2.5 px-4 hover:bg-[#E4B429] transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {loading ? (
              <><Loader2 size={13} className="animate-spin" /> Executing…</>
            ) : (
              <><Zap size={13} /> Confirm & Apply</>
            )}
          </button>
          <button
            onClick={onReject}
            disabled={loading}
            className="px-4 py-2.5 border border-[var(--border)] text-[var(--text-muted)] text-xs uppercase tracking-widest hover:text-white hover:border-red-500/50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Status messages */}
      {executed && (
        <div className="border-t border-emerald-500/20 px-4 py-2.5 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle size={12} />
          Action executed successfully
        </div>
      )}
      {rejected && (
        <div className="border-t border-red-500/20 px-4 py-2.5 text-red-400 text-xs flex items-center gap-2">
          <XCircle size={12} />
          Action cancelled
        </div>
      )}
      {failed && (
        <div className="border-t border-red-500/30 px-4 py-2.5 text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle size={12} />
          Execution failed — check logs for details
        </div>
      )}
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({
  message,
  onConfirm,
  onReject,
  executingLogId,
}: {
  message: ChatMessage;
  onConfirm: (msg: ChatMessage) => void;
  onReject:  (msg: ChatMessage) => void;
  executingLogId?: string | null;
}) {
  const isUser   = message.role === 'user';
  const isBot    = message.role === 'assistant';
  const isAction = message.role === 'action';
  const isSystem = message.role === 'system';

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      {!isSystem && (
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
          isUser   ? 'bg-[var(--gold)] text-[#080808]'    :
          isAction ? 'bg-[var(--gold)]/20 border border-[var(--gold)]/30' :
                     'bg-[var(--surface-3)] border border-[var(--border)]',
        )}>
          {isUser ? <User size={14} /> : <Bot size={14} className="text-[var(--gold)]" />}
        </div>
      )}

      {/* Bubble */}
      <div className={cn(
        'max-w-[80%] flex flex-col gap-1',
        isUser   ? 'items-end'  :
        isSystem ? 'items-center w-full max-w-full' :
                   'items-start',
      )}>
        {isSystem ? (
          <div className="flex items-center gap-2 text-[var(--text-subtle)] text-xs py-2">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span>{message.content}</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>
        ) : (
          <>
            <div className={cn(
              'px-4 py-3 text-sm leading-relaxed',
              isUser
                ? 'bg-[var(--gold)]/15 border border-[var(--gold)]/25 text-white'
                : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)]',
            )}>
              {message.content}
            </div>

            {/* Action preview card */}
            {isAction && message.aiResponse && (
              <div className="w-full max-w-[480px]">
                <ActionPreviewCard
                  aiResponse={message.aiResponse}
                  onConfirm={() => onConfirm(message)}
                  onReject={() => onReject(message)}
                  status={message.actionStatus}
                  loading={executingLogId === message.logId}
                />
              </div>
            )}

            <span className="text-[var(--text-subtle)] text-[0.6rem] px-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Log Drawer ───────────────────────────────────────────────────────────────
function LogDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/ai/logs?limit=30')
      .then(r => r.json())
      .then(d => setLogs(d.logs ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const statusColor: Record<string, string> = {
    pending:  'text-amber-400',
    approved: 'text-blue-400',
    executed: 'text-emerald-400',
    rejected: 'text-[var(--text-subtle)]',
    failed:   'text-red-400',
    undone:   'text-purple-400',
  };

  return (
    <div className="absolute inset-0 bg-[var(--surface)] z-20 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <h3 className="font-serif text-lg text-white">Action History</h3>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors">
          <XCircle size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 size={20} className="animate-spin text-[var(--gold)]" />
          </div>
        )}
        {!loading && logs.length === 0 && (
          <p className="text-center text-[var(--text-muted)] text-sm py-8">No actions yet.</p>
        )}
        {logs.map(log => (
          <div key={log.id} className="border border-[var(--border)] p-4 bg-[var(--surface-2)]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <span className="text-xs font-mono text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5">
                {log.tool}
              </span>
              <span className={cn('text-xs font-medium', statusColor[log.status] ?? 'text-white')}>
                {log.status.toUpperCase()}
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-xs mb-2">
              {new Date(log.timestamp).toLocaleString()}
            </p>
            {log.before && Object.keys(log.before).length > 0 && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[var(--text-subtle)] mb-1">Before</p>
                  <pre className="text-[var(--text-muted)] bg-[var(--surface-3)] p-2 overflow-x-auto text-[0.6rem]">
                    {JSON.stringify(log.before, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-[var(--text-subtle)] mb-1">After</p>
                  <pre className="text-emerald-400 bg-[var(--surface-3)] p-2 overflow-x-auto text-[0.6rem]">
                    {JSON.stringify(log.after, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Chat Component ──────────────────────────────────────────────────────
export default function AdminChat() {
  const [messages,       setMessages]       = useState<ChatMessage[]>([]);
  const [input,          setInput]          = useState('');
  const [loading,        setLoading]        = useState(false);
  const [executingLogId, setExecutingLogId] = useState<string | null>(null);
  const [showLogs,       setShowLogs]       = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    setMessages([{
      id:        'welcome',
      role:      'assistant',
      content:   "Hi! I'm your AI website assistant. Tell me what you'd like to update on the Milehigh5280 website — prices, text, reviews, blog posts, and more. I'll show you exactly what will change before applying anything.",
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const full: ChatMessage = {
      ...msg,
      id:        crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, full]);
    return full;
  }, []);

  // ── Send message → interpret ───────────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);

    // Add user message
    addMessage({ role: 'user', content: text });

    // Build conversation history for context
    const history = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    try {
      const res = await fetch('/api/ai/interpret', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text, conversationHistory: history }),
      });

      const aiResponse: AIInterpretResponse = await res.json();

      // Clarification needed — show as assistant message only
      if (aiResponse.clarification_needed) {
        addMessage({ role: 'assistant', content: aiResponse.clarification_question ?? aiResponse.message_to_user });
        return;
      }

      // No action available
      if (!aiResponse.action) {
        addMessage({ role: 'assistant', content: aiResponse.message_to_user });
        return;
      }

      // Pre-create log entry so we have a logId ready
      let logId: string | undefined;
      try {
        const logRes = await fetch('/api/ai/execute', {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ action: aiResponse }),
        });
        const logData = await logRes.json();
        logId = logData.logId;
      } catch { /* non-fatal */ }

      // Add action message with preview card
      addMessage({
        role:         'action',
        content:      aiResponse.message_to_user,
        aiResponse,
        actionStatus: 'pending',
        logId,
      });

    } catch (err) {
      console.error('[Chat] Error:', err);
      addMessage({ role: 'assistant', content: '⚠️ Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // ── Confirm action ─────────────────────────────────────────────────────────
  const handleConfirm = async (msg: ChatMessage) => {
    if (!msg.aiResponse || !msg.logId) return;

    setExecutingLogId(msg.logId);

    // Update message status to loading
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, actionStatus: 'approved' as const } : m,
    ));

    try {
      const res = await fetch('/api/ai/execute', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          action:    msg.aiResponse,
          confirmed: true,
          logId:     msg.logId,
        }),
      });

      const result = await res.json();

      if (result.success) {
        // Mark as executed
        setMessages(prev => prev.map(m =>
          m.id === msg.id ? { ...m, actionStatus: 'executed' as const } : m,
        ));
        addMessage({
          role:    'assistant',
          content: `✅ ${result.message}`,
        });
      } else {
        setMessages(prev => prev.map(m =>
          m.id === msg.id ? { ...m, actionStatus: 'failed' as const } : m,
        ));
        addMessage({
          role:    'assistant',
          content: `❌ ${result.message ?? result.error ?? 'Execution failed.'}`,
        });
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === msg.id ? { ...m, actionStatus: 'failed' as const } : m,
      ));
      addMessage({ role: 'assistant', content: '❌ Execution failed — please try again.' });
    } finally {
      setExecutingLogId(null);
    }
  };

  // ── Reject action ──────────────────────────────────────────────────────────
  const handleReject = async (msg: ChatMessage) => {
    if (msg.logId) {
      await fetch('/api/ai/execute', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ confirmed: false, logId: msg.logId }),
      }).catch(() => {});
    }
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, actionStatus: 'rejected' as const } : m,
    ));
    addMessage({ role: 'assistant', content: "Okay, I've cancelled that action. What else can I help you with?" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      id:        'cleared',
      role:      'system',
      content:   'Chat cleared',
      timestamp: new Date().toISOString(),
    }]);
  };

  return (
    <div className="flex flex-col h-full relative bg-[var(--surface)] border border-[var(--border)]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface-2)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center">
            <Bot size={18} className="text-[var(--gold)]" />
          </div>
          <div>
            <h2 className="font-serif text-white text-lg leading-tight">AI Content Assistant</h2>
            <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-widest">
              {loading ? 'Thinking…' : 'Ready'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogs(true)}
            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors border border-[var(--border)] px-3 py-1.5 hover:border-[var(--gold)]"
            title="Action history"
          >
            <History size={13} />
            Logs
          </button>
          <button
            onClick={clearChat}
            className="text-[var(--text-muted)] hover:text-red-400 transition-colors border border-[var(--border)] p-1.5 hover:border-red-400/30"
            title="Clear chat"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* ── Safety notice ── */}
      <div className="px-5 py-2.5 border-b border-[var(--border)] bg-[var(--gold)]/5 flex items-center gap-2 shrink-0">
        <Info size={12} className="text-[var(--gold)] shrink-0" />
        <p className="text-[0.65rem] text-[var(--text-muted)]">
          All actions require your confirmation before executing. No code or config is ever modified.
        </p>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onConfirm={handleConfirm}
            onReject={handleReject}
            executingLogId={executingLogId}
          />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center">
              <Bot size={14} className="text-[var(--gold)]" />
            </div>
            <div className="bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-[var(--gold)]" />
              <span className="text-[var(--text-muted)] text-sm">Analysing your request…</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* ── Suggested prompts ── */}
      {messages.length <= 1 && (
        <div className="px-5 pb-3 shrink-0">
          <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-widest mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map(s => (
              <button
                key={s.label}
                onClick={() => { setInput(s.prompt); inputRef.current?.focus(); }}
                className="text-xs border border-[var(--border)] px-3 py-1.5 text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-white transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className="border-t border-[var(--border)] px-4 py-4 bg-[var(--surface-2)] shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Change the price to $80 per night…"
            rows={1}
            className="flex-1 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-sm px-4 py-3 outline-none resize-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
            style={{ minHeight: '46px', maxHeight: '120px' }}
            onInput={e => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 120) + 'px';
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={cn(
              'w-11 h-11 flex items-center justify-center transition-all duration-200 shrink-0',
              input.trim() && !loading
                ? 'bg-[var(--gold)] text-[#080808] hover:bg-[#E4B429]'
                : 'bg-[var(--surface-3)] text-[var(--text-subtle)] cursor-not-allowed',
            )}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="text-[var(--text-subtle)] text-[0.6rem] mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

      {/* ── Log drawer ── */}
      <LogDrawer open={showLogs} onClose={() => setShowLogs(false)} />
    </div>
  );
}
