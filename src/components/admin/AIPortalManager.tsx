'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Send, Mic, MicOff, Bot, User, Loader2, 
  ChevronDown, ChevronUp, Volume2, Settings, Zap,
  Brain, Home, Building2, Star, FileText, Globe, 
  TrendingUp, MessageSquare, Phone, Mail, DollarSign,
  Type, Image, Palette, Calendar, Clock, Award,
  ChevronRight, Command, Sparkles, Headphones
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIInterpretResponse } from '@/lib/ai/types';

interface APMMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'action';
  content: string;
  voiceContent?: string;
  aiResponse?: AIInterpretResponse;
  actionStatus?: 'pending' | 'approved' | 'executed' | 'rejected' | 'failed';
  logId?: string;
  timestamp: string;
}

interface Shortcut {
  icon: React.ReactNode;
  label: string;
  prompt: string;
  color: string;
}

const SHORTCUTS: Shortcut[] = [
  { icon: <DollarSign size={18} />, label: 'Price', prompt: 'Change the price to $75', color: 'text-emerald-400' },
  { icon: <Type size={18} />, label: 'Headline', prompt: 'Update the hero headline', color: 'text-blue-400' },
  { icon: <Phone size={18} />, label: 'Phone', prompt: 'Update the phone number', color: 'text-purple-400' },
  { icon: <Mail size={18} />, label: 'Email', prompt: 'Update the email address', color: 'text-amber-400' },
  { icon: <Star size={18} />, label: 'Review', prompt: 'Approve the pending review', color: 'text-pink-400' },
  { icon: <FileText size={18} />, label: 'Publish', prompt: 'Publish the latest blog post', color: 'text-cyan-400' },
  { icon: <Image size={18} />, label: 'Gallery', prompt: 'Update the property gallery', color: 'text-orange-400' },
  { icon: <Calendar size={18} />, label: 'Availability', prompt: 'Check availability for next weekend', color: 'text-teal-400' },
  { icon: <Award size={18} />, label: 'Feature', prompt: 'Make this property featured', color: 'text-yellow-400' },
  { icon: <TrendingUp size={18} />, label: 'Stats', prompt: 'Show me the dashboard statistics', color: 'text-indigo-400' },
];

export default function AIPortalManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<APMMessage[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [showParams, setShowParams] = useState(false);
  const [executingLogId, setExecutingLogId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hello! I'm your AI Portal Manager. Use the quick shortcuts below or type your command. Try 'Change price to $75' or 'Update headline'",
      voiceContent: "Hello! I'm your AI Portal Manager. Use the quick shortcuts or type your command.",
      timestamp: new Date().toISOString(),
    }]);

    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = useCallback((text: string) => {
    if (synthRef.current && !window.location.hash.includes('mute')) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  }, []);

  const addMessage = useCallback((msg: Omit<APMMessage, 'id' | 'timestamp'>) => {
    const full: APMMessage = {
      ...msg,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, full]);
    if (full.voiceContent && !isOpen) {
      setUnreadCount(c => c + 1);
    }
    return full;
  }, [isOpen]);

  const handleShortcut = (shortcut: Shortcut) => {
    if (!isOpen) setIsOpen(true);
    setInput(shortcut.prompt);
    setShowShortcuts(false);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setLoading(true);
    setShowShortcuts(false);

    const userMsg = addMessage({ role: 'user', content: text });

    try {
      const res = await fetch('/api/ai/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          conversationHistory: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const aiResponse: AIInterpretResponse = await res.json();

      if (aiResponse.clarification_needed) {
        addMessage({ 
          role: 'assistant', 
          content: aiResponse.clarification_question ?? aiResponse.message_to_user,
          voiceContent: aiResponse.clarification_question ?? aiResponse.message_to_user,
        });
        return;
      }

      if (!aiResponse.action) {
        addMessage({ 
          role: 'assistant', 
          content: aiResponse.message_to_user,
          voiceContent: aiResponse.message_to_user,
        });
        return;
      }

      let logId: string | undefined;
      try {
        const logRes = await fetch('/api/ai/execute', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: aiResponse }),
        });
        const logData = await logRes.json();
        logId = logData.logId;
      } catch {}

      addMessage({
        role: 'action',
        content: aiResponse.message_to_user,
        voiceContent: aiResponse.voice ?? aiResponse.message_to_user,
        aiResponse,
        actionStatus: 'pending',
        logId,
      });

    } catch {
      addMessage({ 
        role: 'assistant', 
        content: '⚠️ Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleConfirm = async (msg: APMMessage) => {
    if (!msg.aiResponse || !msg.logId) return;

    setExecutingLogId(msg.logId);
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, actionStatus: 'approved' as const } : m,
    ));

    try {
      const res = await fetch('/api/ai/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: msg.aiResponse,
          confirmed: true,
          logId: msg.logId,
        }),
      });

      const result = await res.json();

      if (result.success) {
        setMessages(prev => prev.map(m =>
          m.id === msg.id ? { ...m, actionStatus: 'executed' as const } : m,
        ));
        addMessage({
          role: 'assistant',
          content: `✅ ${result.message}`,
          voiceContent: `Action completed. ${result.message}`,
        });
      } else {
        setMessages(prev => prev.map(m =>
          m.id === msg.id ? { ...m, actionStatus: 'failed' as const } : m,
        ));
        addMessage({
          role: 'assistant',
          content: `❌ ${result.message}`,
        });
      }
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === msg.id ? { ...m, actionStatus: 'failed' as const } : m,
      ));
    } finally {
      setExecutingLogId(null);
    }
  };

  const handleReject = async (msg: APMMessage) => {
    if (msg.logId) {
      await fetch('/api/ai/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmed: false, logId: msg.logId }),
      }).catch(() => {});
    }
    setMessages(prev => prev.map(m =>
      m.id === msg.id ? { ...m, actionStatus: 'rejected' as const } : m,
    ));
    addMessage({
      role: 'assistant',
      content: "❌ Cancelled. What else can I help you with?",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Mini floating button (when minimized or closed)
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-3">
        {/* Notification badge */}
        {unreadCount > 0 && (
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
            {unreadCount} new
          </div>
        )}
        
        {/* Expand button */}
        <button
          onClick={() => { setIsOpen(true); setUnreadCount(0); }}
          className="relative w-16 h-16 bg-gradient-to-br from-[var(--gold)] to-[#8B6914] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
        >
          <Sparkles size={28} className="text-[#080808] group-hover:animate-spin" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full animate-pulse" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      'fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 z-[100] flex flex-col bg-[var(--obsidian)] border border-[var(--border)] shadow-2xl transition-all duration-500 rounded-none sm:rounded-2xl overflow-hidden',
      'w-full h-full sm:w-[95vw] sm:max-w-[480px] sm:h-[85vh]'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-gradient-to-r from-[var(--surface)] to-[var(--surface-2)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-[var(--gold)] to-[#8B6914] rounded-full flex items-center justify-center shadow-lg">
            <Brain size={22} className="text-[#080808]" />
          </div>
          <div>
            <h3 className="text-white text-lg font-bold">AI Portal Manager</h3>
            <p className="text-[var(--text-subtle)] text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Online & Ready
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className={cn(
              'p-2 rounded-lg transition-all',
              showShortcuts ? 'bg-[var(--gold)]/20 text-[var(--gold)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]'
            )}
            title="Quick shortcuts"
          >
            <Command size={18} />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 text-[var(--text-muted)] hover:bg-[var(--surface-2)] rounded-lg transition-colors hidden sm:block"
            title="Minimize"
          >
            {isMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button
            onClick={() => { setIsOpen(false); setIsMinimized(false); }}
            className="p-2 text-[var(--text-muted)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Quick Shortcuts Bar */}
      {showShortcuts && (
        <div className="border-b border-[var(--border)] bg-[var(--surface-2)] p-3 overflow-x-auto shrink-0">
          <div className="flex gap-2 min-w-max">
            {SHORTCUTS.map((shortcut, i) => (
              <button
                key={i}
                onClick={() => handleShortcut(shortcut)}
                className="flex items-center gap-2 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)] transition-all duration-200 group whitespace-nowrap"
              >
                <span className={shortcut.color}>{shortcut.icon}</span>
                <span className="text-xs text-[var(--text-muted)] group-hover:text-white transition-colors">
                  {shortcut.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[var(--obsidian)]/50">
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
            <div className="w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
              <Bot size={18} className="text-[var(--gold)]" />
            </div>
            <div className="bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-[var(--gold)]" />
              <span className="text-[var(--text-muted)] text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] p-4 bg-[var(--surface)] shrink-0">
        {/* Voice indicator */}
        {isListening && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm">Listening...</span>
          </div>
        )}
        
        <div className="flex gap-3 items-end">
          <button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
              if (SR) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const recognition = new SR() as any;
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.onresult = (event: { results: { length: number; [index: number]: { 0: { transcript: string } } } }) => {
                  const transcript = Array.from(event.results).map((r: { 0: { transcript: string } }) => r[0].transcript).join('');
                  setInput(transcript);
                };
                recognition.onend = () => setIsListening(false);
                setIsListening(true);
                recognition.start();
              }
            }}
            className={cn(
              'w-12 h-12 flex items-center justify-center border transition-all duration-300 shrink-0 rounded-xl',
              isListening 
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)]'
            )}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type or tap a shortcut..."
              rows={1}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-base px-4 py-3 rounded-xl outline-none resize-none focus:border-[var(--gold)] transition-colors placeholder:text-[var(--text-subtle)]"
              style={{ minHeight: '48px', maxHeight: '100px' }}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 100) + 'px';
              }}
              disabled={loading}
            />
          </div>
          
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={cn(
              'w-12 h-12 flex items-center justify-center transition-all duration-300 shrink-0 rounded-xl',
              input.trim() && !loading
                ? 'bg-gradient-to-br from-[var(--gold)] to-[#8B6914] text-[#080808] hover:shadow-lg hover:shadow-[var(--gold)]/20'
                : 'bg-[var(--surface-3)] text-[var(--text-subtle)]'
            )}
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-[var(--text-subtle)]">
          <span className="flex items-center gap-1.5">
            <Command size={12} /> Shortcuts available
          </span>
          <span className="flex items-center gap-1.5">
            <Headphones size={12} /> Voice enabled
          </span>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, onConfirm, onReject, executingLogId }: {
  message: APMMessage;
  onConfirm: (msg: APMMessage) => void;
  onReject: (msg: APMMessage) => void;
  executingLogId?: string | null;
}) {
  const isUser = message.role === 'user';
  const isAction = message.role === 'action';
  const executed = message.actionStatus === 'executed';
  const rejected = message.actionStatus === 'rejected';
  const failed = message.actionStatus === 'failed';

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
        isUser ? 'bg-[var(--gold)] text-[#080808]' : 'bg-gradient-to-br from-[var(--gold)]/30 to-[var(--gold)]/10 border border-[var(--gold)]/20'
      )}>
        {isUser ? <User size={18} /> : <Bot size={18} className="text-[var(--gold)]" />}
      </div>
      
      <div className={cn('max-w-[85%] flex flex-col gap-2', isUser ? 'items-end' : 'items-start')}>
        <div className={cn(
          'px-4 py-3 text-base leading-relaxed rounded-2xl',
          isUser
            ? 'bg-gradient-to-br from-[var(--gold)] to-[#8B6914] text-[#080808] rounded-tr-sm'
            : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm',
          executed && 'border-emerald-500/30 bg-emerald-500/5',
          rejected && 'opacity-60',
          failed && 'border-red-500/30 bg-red-500/5',
        )}>
          {message.content}
        </div>

        {isAction && message.aiResponse && (
          <div className={cn(
            'border rounded-xl overflow-hidden w-full max-w-sm',
            executed ? 'border-emerald-500/30 bg-emerald-500/5' :
            rejected ? 'border-red-500/20 opacity-60' :
            failed ? 'border-red-500/40 bg-red-500/10' :
            'border-[var(--gold)]/30 bg-[var(--gold)]/5',
          )}>
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[var(--gold)] text-xs uppercase tracking-wider font-bold bg-[var(--gold)]/10 px-2 py-1 rounded">
                  {message.aiResponse.action}
                </span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded',
                  message.aiResponse.risk_level === 'low' && 'bg-emerald-500/20 text-emerald-400',
                  message.aiResponse.risk_level === 'medium' && 'bg-amber-500/20 text-amber-400',
                  message.aiResponse.risk_level === 'high' && 'bg-red-500/20 text-red-400',
                )}>
                  {message.aiResponse.risk_level} risk
                </span>
              </div>
              {message.aiResponse.preview && (
                <p className="text-[var(--text-muted)] text-sm font-mono bg-[var(--surface-3)] p-2 rounded">
                  {message.aiResponse.preview}
                </p>
              )}
            </div>
            {!executed && !rejected && !failed && (
              <div className="border-t border-[var(--border)] px-4 py-3 flex gap-3">
                <button
                  onClick={() => onConfirm(message)}
                  disabled={executingLogId === message.logId}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold py-2.5 px-4 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {executingLogId === message.logId ? (
                    <><Loader2 size={14} className="animate-spin" /> Processing...</>
                  ) : (
                    <><Sparkles size={14} /> Confirm</>
                  )}
                </button>
                <button
                  onClick={() => onReject(message)}
                  className="px-4 border border-[var(--border)] text-[var(--text-muted)] text-sm hover:bg-[var(--surface-2)] hover:text-white transition-all rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
            {(executed || rejected || failed) && (
              <div className={cn(
                'border-t px-4 py-2 text-sm flex items-center gap-2',
                executed && 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
                rejected && 'border-red-500/20 text-red-400 bg-red-500/5',
                failed && 'border-red-500/30 text-red-400 bg-red-500/10',
              )}>
                {executed && '✓ Executed successfully'}
                {rejected && '✗ Cancelled'}
                {failed && '✗ Execution failed'}
              </div>
            )}
          </div>
        )}

        <span className="text-[var(--text-subtle)] text-xs px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
