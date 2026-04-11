'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Bot, User, AlertTriangle, CheckCircle, XCircle,
  Loader2, History, Trash2, ChevronDown, ChevronUp,
  ShieldAlert, ShieldCheck, Shield, Zap, Info, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, AIInterpretResponse, ActionLog } from '@/lib/ai/types';

// ─── Suggested prompts ────────────────────────────────────────────────────────
const SUGGESTED_PROMPTS = [
  { label: '💰 Price',     prompt: 'Change the nightly price to $65' },
  { label: '✍️ Headline',  prompt: 'Update the homepage headline to "Your Luxury Escape in Ghana"' },
  { label: '📱 Phone',     prompt: 'Change the phone number to +233 055 123 4567' },
  { label: '📝 Blog post', prompt: 'Publish the latest blog post' },
  { label: '📈 All prices',prompt: 'Increase all property prices by 10%' },
  { label: '⭐ Review',    prompt: 'Approve the most recent pending review' },
];

// ─── Risk badge ───────────────────────────────────────────────────────────────
function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cfg = {
    low:    { Icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', label: 'Low Risk' },
    medium: { Icon: Shield,      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',       label: 'Med Risk' },
    high:   { Icon: ShieldAlert, color: 'text-red-400 bg-red-400/10 border-red-400/20',             label: 'High Risk' },
  }[level];
  return (
    <span className={cn('inline-flex items-center gap-1 text-[0.58rem] uppercase tracking-widest px-2 py-0.5 border', cfg.color)}>
      <cfg.Icon size={9} />
      {cfg.label}
    </span>
  );
}

// ─── Action Preview Card ──────────────────────────────────────────────────────
function ActionPreviewCard({
  aiResponse, onConfirm, onReject, status, loading,
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
  const pending  = !executed && !rejected && !failed;

  return (
    <div className={cn(
      'mt-2 border overflow-hidden transition-all duration-300 text-sm',
      executed ? 'border-emerald-500/30 bg-emerald-500/5' :
      rejected ? 'border-[var(--border)] bg-[var(--surface-2)] opacity-50' :
      failed   ? 'border-red-500/40 bg-red-500/10' :
                 'border-[var(--gold)]/40 bg-[var(--surface-2)]',
    )}>

      {/* Tool + Risk */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 flex-wrap border-b border-[var(--border)]">
        <code className="text-[0.65rem] text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 font-mono border border-[var(--gold)]/20">
          {aiResponse.action}
        </code>
        <RiskBadge level={aiResponse.risk_level} />
        {aiResponse.preview && (
          <span className="text-[var(--text-muted)] text-[0.65rem] font-mono ml-auto">
            {aiResponse.preview}
          </span>
        )}
      </div>

      {/* Collapsible data */}
      {aiResponse.data && Object.keys(aiResponse.data).length > 0 && (
        <>
          <button
            onClick={() => setShowData(v => !v)}
            className="w-full px-4 py-1.5 flex items-center gap-1.5 text-[var(--text-subtle)] text-[0.65rem] hover:text-white transition-colors border-b border-[var(--border)]"
          >
            {showData ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            {showData ? 'Hide' : 'Show'} action data
          </button>
          {showData && (
            <div className="px-4 py-2 border-b border-[var(--border)]">
              <pre className="text-[0.62rem] text-[var(--text-muted)] overflow-x-auto leading-relaxed">
                {JSON.stringify(aiResponse.data, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}

      {/* Confirm / Cancel */}
      {pending && (
        <div className="flex gap-2 px-3 py-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--gold)] text-[#080808] text-[0.7rem] font-bold uppercase tracking-widest py-2 hover:bg-[#E4B429] transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {loading
              ? <><Loader2 size={12} className="animate-spin" /> Applying…</>
              : <><Zap size={12} /> Confirm & Apply</>}
          </button>
          <button
            onClick={onReject}
            disabled={loading}
            className="px-4 py-2 border border-[var(--border)] text-[var(--text-muted)] text-[0.7rem] uppercase tracking-widest hover:border-red-500/40 hover:text-red-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Terminal states */}
      {executed && (
        <div className="px-4 py-2 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle size={12} /> Applied successfully
        </div>
      )}
      {rejected && (
        <div className="px-4 py-2 text-[var(--text-subtle)] text-xs flex items-center gap-2">
          <XCircle size={12} /> Cancelled
        </div>
      )}
      {failed && (
        <div className="px-4 py-2 text-red-400 text-xs flex items-center gap-2">
          <AlertTriangle size={12} /> Failed — check logs
        </div>
      )}
    </div>
  );
}

// ─── Single message bubble ────────────────────────────────────────────────────
function MessageBubble({
  message, onConfirm, onReject, executingLogId,
}: {
  message: ChatMessage;
  onConfirm: (msg: ChatMessage) => void;
  onReject:  (msg: ChatMessage) => void;
  executingLogId?: string | null;
}) {
  const isUser   = message.role === 'user';
  const isAction = message.role === 'action';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-[var(--text-subtle)] text-[0.6rem] tracking-widest uppercase">{message.content}</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
    );
  }

  return (
    <div className={cn('flex gap-3 items-start', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'w-7 h-7 shrink-0 flex items-center justify-center mt-0.5 text-xs font-bold',
        isUser
          ? 'bg-[var(--gold)] text-[#080808]'
          : 'bg-[var(--surface-3)] border border-[var(--border)]',
      )}>
        {isUser ? <User size={13} /> : <Bot size={13} className="text-[var(--gold)]" />}
      </div>

      {/* Content */}
      <div className={cn('flex flex-col gap-1 min-w-0', isUser ? 'items-end max-w-[80%]' : 'items-start max-w-[85%]')}>
        <div className={cn(
          'px-4 py-3 text-sm leading-relaxed whitespace-pre-line',
          isUser
            ? 'bg-[var(--gold)]/15 border border-[var(--gold)]/25 text-white'
            : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)]',
        )}>
          {message.content}
        </div>

        {/* Action card */}
        {isAction && message.aiResponse && (
          <div className="w-full">
            <ActionPreviewCard
              aiResponse={message.aiResponse}
              onConfirm={() => onConfirm(message)}
              onReject={() => onReject(message)}
              status={message.actionStatus}
              loading={executingLogId === message.logId}
            />
          </div>
        )}

        <span className="text-[var(--text-subtle)] text-[0.58rem] px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// ─── Log drawer ───────────────────────────────────────────────────────────────
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
        <h3 className="font-serif text-white text-lg">Action History</h3>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white">
          <XCircle size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin text-[var(--gold)]" /></div>}
        {!loading && logs.length === 0 && (
          <p className="text-center text-[var(--text-muted)] text-sm py-10">No actions yet.</p>
        )}
        {logs.map(log => (
          <div key={log.id} className="border border-[var(--border)] p-3 bg-[var(--surface-2)] text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <code className="text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-0.5 text-[0.65rem]">{log.tool}</code>
              <span className={cn('font-medium text-[0.65rem]', statusColor[log.status] ?? 'text-white')}>
                {log.status.toUpperCase()}
              </span>
            </div>
            <p className="text-[var(--text-subtle)] mb-1.5">{new Date(log.timestamp).toLocaleString()}</p>
            {log.before && Object.keys(log.before).length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-[var(--text-subtle)] mb-1">Before</p>
                  <pre className="bg-[var(--surface-3)] p-2 text-[0.6rem] overflow-x-auto text-[var(--text-muted)]">
                    {JSON.stringify(log.before, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-emerald-400 mb-1">After</p>
                  <pre className="bg-[var(--surface-3)] p-2 text-[0.6rem] overflow-x-auto text-emerald-400">
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

// ─── Main AdminChat component ─────────────────────────────────────────────────
export default function AdminChat() {
  const [messages,       setMessages]       = useState<ChatMessage[]>([]);
  const [input,          setInput]          = useState('');
  const [loading,        setLoading]        = useState(false);
  const [executingLogId, setExecutingLogId] = useState<string | null>(null);
  const [showLogs,       setShowLogs]       = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      id:        'welcome',
      role:      'assistant',
      content:   "Hi! I'm your AI website manager 👋\n\nI can update prices, headlines, contact details, blog posts, reviews, and more — all in plain English. Just tell me what to change and I'll show you a preview before applying anything.",
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const full: ChatMessage = { ...msg, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, full]);
    return full;
  }, []);

  // ── Send ─────────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);
    addMessage({ role: 'user', content: text });

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

      if (!res.ok) throw new Error(`API error ${res.status}`);
      const aiResponse: AIInterpretResponse = await res.json();

      // ── No action or clarification needed → plain assistant message ──────────
      const hasAction = aiResponse.action && typeof aiResponse.action === 'string';
      const hasData   = aiResponse.data && Object.keys(aiResponse.data).length > 0;

      if (!hasAction || !hasData || aiResponse.clarification_needed) {
        addMessage({ role: 'assistant', content: aiResponse.message_to_user ?? "I'm not sure how to help with that. Try a more specific command." });
        return;
      }

      // ── Has valid action → create log entry + show action card ───────────────
      let logId: string | undefined;
      try {
        const logRes = await fetch('/api/ai/execute', {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ action: aiResponse }),
        });
        if (logRes.ok) {
          const logData = await logRes.json();
          logId = logData.logId;
        }
      } catch { /* non-fatal — still show the action card */ }

      addMessage({ role: 'action', content: aiResponse.message_to_user, aiResponse, actionStatus: 'pending', logId });

    } catch (err) {
      console.error('[Chat] handleSend error:', err);
      addMessage({ role: 'assistant', content: '⚠️ Something went wrong communicating with the server. Please try again.' });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  // ── Confirm ──────────────────────────────────────────────────────────────────
  const handleConfirm = async (msg: ChatMessage) => {
    if (!msg.aiResponse || !msg.logId) {
      addMessage({ role: 'assistant', content: '⚠️ Could not link this action to a log entry. Please try again.' });
      return;
    }
    setExecutingLogId(msg.logId);
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, actionStatus: 'approved' as const } : m));

    try {
      const res = await fetch('/api/ai/execute', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: msg.aiResponse, confirmed: true, logId: msg.logId }),
      });
      const result = await res.json();

      if (result.success) {
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, actionStatus: 'executed' as const } : m));
        addMessage({ role: 'assistant', content: `✅ ${result.message}` });
      } else {
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, actionStatus: 'failed' as const } : m));
        addMessage({ role: 'assistant', content: `❌ ${result.message ?? result.error ?? 'Execution failed.'}` });
      }
    } catch {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, actionStatus: 'failed' as const } : m));
      addMessage({ role: 'assistant', content: '❌ Network error — execution failed. Please try again.' });
    } finally {
      setExecutingLogId(null);
    }
  };

  // ── Reject ───────────────────────────────────────────────────────────────────
  const handleReject = async (msg: ChatMessage) => {
    if (msg.logId) {
      fetch('/api/ai/execute', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ confirmed: false, logId: msg.logId }),
      }).catch(() => {});
    }
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, actionStatus: 'rejected' as const } : m));
    addMessage({ role: 'assistant', content: "Cancelled. What else would you like to change?" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const clearChat = () => setMessages([{
    id: 'cleared', role: 'system', content: 'Chat cleared',
    timestamp: new Date().toISOString(),
  }]);

  return (
    <div className="flex flex-col h-full relative bg-[var(--surface)] border border-[var(--border)] overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface-2)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center">
            <Sparkles size={15} className="text-[var(--gold)]" />
          </div>
          <div>
            <h2 className="text-white font-medium text-sm leading-tight">AI Website Manager</h2>
            <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-widest">
              {loading ? '● Thinking…' : '● Ready'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogs(true)}
            className="flex items-center gap-1 text-[0.65rem] text-[var(--text-muted)] hover:text-[var(--gold)] border border-[var(--border)] px-2.5 py-1.5 hover:border-[var(--gold)] transition-colors"
          >
            <History size={12} /> Logs
          </button>
          <button
            onClick={clearChat}
            className="text-[var(--text-muted)] hover:text-red-400 border border-[var(--border)] p-1.5 hover:border-red-400/30 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* ── Safety notice ── */}
      <div className="px-4 py-2 border-b border-[var(--border)] bg-[var(--gold)]/5 flex items-center gap-2 shrink-0">
        <Info size={11} className="text-[var(--gold)] shrink-0" />
        <p className="text-[0.62rem] text-[var(--text-muted)]">
          Nothing changes until you click <strong className="text-white">Confirm & Apply</strong>. All actions are logged.
        </p>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onConfirm={handleConfirm}
            onReject={handleReject}
            executingLogId={executingLogId}
          />
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center">
              <Bot size={13} className="text-[var(--gold)]" />
            </div>
            <div className="bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 flex items-center gap-2">
              <Loader2 size={13} className="animate-spin text-[var(--gold)]" />
              <span className="text-[var(--text-muted)] text-sm">Thinking…</span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* ── Quick prompts (shown when fresh) ── */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 shrink-0">
          <p className="text-[var(--text-subtle)] text-[0.6rem] uppercase tracking-widest mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map(s => (
              <button
                key={s.label}
                onClick={() => { setInput(s.prompt); inputRef.current?.focus(); }}
                className="text-[0.68rem] border border-[var(--border)] px-2.5 py-1.5 text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-white transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className="border-t border-[var(--border)] px-4 py-3 bg-[var(--surface-2)] shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Change the price to $80 per night…"
            rows={1}
            disabled={loading}
            className="flex-1 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-sm px-3.5 py-2.5 outline-none resize-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
            style={{ minHeight: '42px', maxHeight: '100px' }}
            onInput={e => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 100) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={cn(
              'w-10 h-10 flex items-center justify-center transition-all shrink-0',
              input.trim() && !loading
                ? 'bg-[var(--gold)] text-[#080808] hover:bg-[#E4B429]'
                : 'bg-[var(--surface-3)] text-[var(--text-subtle)] cursor-not-allowed',
            )}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
        <p className="text-[var(--text-subtle)] text-[0.58rem] mt-1.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      {/* ── Log drawer ── */}
      <LogDrawer open={showLogs} onClose={() => setShowLogs(false)} />
    </div>
  );
}
