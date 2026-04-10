'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Mic, MicOff, Bot, User, Loader2, 
  ChevronDown, ChevronUp, Settings, Brain, Sparkles,
  DollarSign, Type, Phone, Mail, Star, FileText,
  Image, Calendar, Award, TrendingUp, Command, Headphones
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIInterpretResponse } from '@/lib/ai/types';

interface APMMessage {
  id: string;
  role: 'user' | 'assistant' | 'action';
  content: string;
  aiResponse?: AIInterpretResponse;
  actionStatus?: 'pending' | 'approved' | 'executed' | 'rejected' | 'failed';
  logId?: string;
  timestamp: string;
}

const SHORTCUTS = [
  { icon: <DollarSign size={18} />, label: 'Price', prompt: 'Change the price to $75' },
  { icon: <Type size={18} />, label: 'Headline', prompt: 'Update the hero headline' },
  { icon: <Phone size={18} />, label: 'Phone', prompt: 'Update the phone number' },
  { icon: <Mail size={18} />, label: 'Email', prompt: 'Update the email address' },
  { icon: <Star size={18} />, label: 'Review', prompt: 'Approve the pending review' },
  { icon: <FileText size={18} />, label: 'Publish', prompt: 'Publish the latest blog post' },
];

export default function AIPortalManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<APMMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [executingLogId, setExecutingLogId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hello! I'm your AI Portal Manager. Use the shortcuts below or type your command.",
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg: Omit<APMMessage, 'id' | 'timestamp'>) => {
    const full: APMMessage = {
      ...msg,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, full]);
    return full;
  };

  const handleShortcut = (prompt: string) => {
    setIsOpen(true);
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setLoading(true);
    addMessage({ role: 'user', content: text });

    try {
      const res = await fetch('/api/ai/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const aiResponse = await res.json();

      if (aiResponse.action) {
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
          aiResponse,
          actionStatus: 'pending',
          logId,
        });
      } else {
        addMessage({ role: 'assistant', content: aiResponse.message_to_user });
      }
    } catch {
      addMessage({ role: 'assistant', content: '⚠️ Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (msg: APMMessage) => {
    if (!msg.aiResponse || !msg.logId) return;
    setExecutingLogId(msg.logId);
    
    setMessages(prev => prev.map(m => {
      if (m.id !== msg.id) return m;
      return { ...m, actionStatus: 'approved' as const };
    }));

    try {
      const res = await fetch('/api/ai/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: msg.aiResponse, confirmed: true, logId: msg.logId }),
      });
      const result = await res.json();
      
      const newStatus = result.success ? 'executed' : 'failed';
      setMessages(prev => prev.map(m => {
        if (m.id !== msg.id) return m;
        return { ...m, actionStatus: newStatus as APMMessage['actionStatus'] };
      }));
      
      addMessage({ 
        role: 'assistant', 
        content: result.success ? `✅ ${result.message}` : `❌ ${result.message}` 
      });
    } catch {
      setMessages(prev => prev.map(m => {
        if (m.id !== msg.id) return m;
        return { ...m, actionStatus: 'failed' as const };
      }));
    } finally {
      setExecutingLogId(null);
    }
  };

  const handleReject = (msg: APMMessage) => {
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, actionStatus: 'rejected' as const } : m));
    addMessage({ role: 'assistant', content: "❌ Cancelled. What else?" });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-16 h-16 bg-gradient-to-br from-[var(--gold)] to-[#8B6914] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
      >
        <Sparkles size={28} className="text-[#080808]" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-4 sm:right-4 z-50 flex flex-col bg-[var(--obsidian)] border border-[var(--border)] shadow-2xl w-full h-full sm:w-[95vw] sm:max-w-[480px] sm:h-[85vh] sm:rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--gold)] to-[#8B6914] rounded-full flex items-center justify-center">
            <Brain size={20} className="text-[#080808]" />
          </div>
          <div>
            <h3 className="text-white text-lg font-bold">AI Portal Manager</h3>
            <p className="text-[var(--text-subtle)] text-xs">Online & Ready</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 text-[var(--text-muted)] hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Messages & Shortcuts Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', msg.role === 'user' ? 'bg-[var(--gold)] text-[#080808]' : 'bg-[var(--gold)]/20')}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} className="text-[var(--gold)]" />}
              </div>
              <div className={cn('max-w-[80%] px-4 py-3 rounded-2xl text-base', msg.role === 'user' ? 'bg-[var(--gold)] text-[#080808]' : 'bg-[var(--surface-2)] text-white', msg.actionStatus === 'executed' && 'border border-emerald-500/30', msg.actionStatus === 'failed' && 'border border-red-500/30')}>
                {msg.content}
                {msg.aiResponse && !msg.actionStatus && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs uppercase text-[var(--gold)]">{msg.aiResponse.action}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded', msg.aiResponse.risk_level === 'low' && 'bg-emerald-500/20 text-emerald-400', msg.aiResponse.risk_level === 'high' && 'bg-red-500/20 text-red-400')}>{msg.aiResponse.risk_level}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleConfirm(msg)} disabled={executingLogId === msg.logId} className="flex-1 bg-[var(--gold)] text-[#080808] text-sm py-2 rounded-lg hover:bg-[#E4B429]">
                        Confirm
                      </button>
                      <button onClick={() => handleReject(msg)} className="px-4 border border-[var(--border)] text-sm rounded-lg hover:text-white">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                <Bot size={18} className="text-[var(--gold)]" />
              </div>
              <div className="bg-[var(--surface-2)] px-4 py-3 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[var(--gold)]" />
                <span className="text-[var(--text-muted)]">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Shortcuts Sidebar - Right Side */}
        <div className="w-24 border-l border-[var(--border)] bg-[var(--surface-2)] p-2 flex flex-col gap-2">
          <span className="text-[var(--text-subtle)] text-xs text-center mb-1">Quick</span>
          {SHORTCUTS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleShortcut(s.prompt)}
              className="flex flex-col items-center gap-1 p-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--gold)] whitespace-nowrap text-xs"
            >
              {s.icon}
              <span className="text-[var(--text-muted)]">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] p-4 bg-[var(--surface)]">
        <div className="flex gap-3">
          <button className="w-12 h-12 flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)] shrink-0 rounded-xl">
            <Mic size={20} />
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type your command..."
            className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 rounded-xl outline-none focus:border-[var(--gold)] text-base resize-none min-h-[48px]"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={cn('w-12 h-12 flex items-center justify-center shrink-0 rounded-xl', input.trim() && !loading ? 'bg-[var(--gold)] text-[#080808]' : 'bg-[var(--surface-3)] text-[var(--text-subtle)]')}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}