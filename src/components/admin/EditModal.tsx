'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  title: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'url';
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
  }>;
  initialData: Record<string, unknown>;
  loading?: boolean;
}

export default function EditModal({
  open,
  onClose,
  onSave,
  title,
  fields,
  initialData,
  loading = false,
}: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  if (!open) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(formData);
      toast.success('Saved successfully');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] sticky top-0 bg-[var(--surface)] backdrop-blur-sm">
          <h2 className="font-serif text-2xl text-white">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--surface-2)] rounded-xl">
            <X size={20} className="text-[var(--text-muted)]" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {fields.map(field => (
            <div key={field.name}>
              {field.type === 'checkbox' ? (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(formData[field.name])}
                    onChange={e => updateField(field.name, e.target.checked)}
                    className="w-5 h-5 rounded bg-[var(--surface-2)] border-[var(--border)] text-[var(--gold)]"
                  />
                  <label className="text-[var(--text-muted)] text-sm">{field.label}</label>
                </div>
              ) : field.type === 'textarea' ? (
                <label className="space-y-2 text-sm text-[var(--text-muted)] block">
                  {field.label}
                  <textarea
                    value={String(formData[field.name] || '')}
                    onChange={e => updateField(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors resize-none"
                  />
                </label>
              ) : field.type === 'select' ? (
                <label className="space-y-2 text-sm text-[var(--text-muted)] block">
                  {field.label}
                  <select
                    value={String(formData[field.name] || '')}
                    onChange={e => updateField(field.name, e.target.value)}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none"
                  >
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className="space-y-2 text-sm text-[var(--text-muted)] block">
                  {field.label}
                  <input
                    type={field.type}
                    value={String(formData[field.name] ?? '')}
                    onChange={e => updateField(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white px-4 py-3 rounded-2xl focus:border-[var(--gold)] outline-none transition-colors"
                  />
                </label>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 p-6 border-t border-[var(--border)]">
          <button onClick={onClose} className="flex-1 px-5 py-3 bg-[var(--surface-2)] border border-[var(--border)] text-white rounded-2xl hover:bg-[var(--surface-3)]">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[var(--gold)] text-[#080808] rounded-2xl hover:bg-[#E4B429] font-semibold disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}