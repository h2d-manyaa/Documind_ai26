import React, { useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface ChatComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  disabled
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height up to 160px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && !disabled && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="w-full bg-[#0A0A0D] border-t border-white/10 p-3 sm:p-4 shrink-0">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading && !disabled && input.trim()) {
              onSend();
            }
          }}
          className="relative flex items-end gap-2 p-1.5 sm:p-2 rounded-2xl bg-[#101116] border border-white/15 focus-within:border-[#00D9FF]/60 focus-within:shadow-[0_0_15px_rgba(0,217,255,0.15)] transition-all"
        >
          <label htmlFor="rag-query-composer" className="sr-only">
            Ask a question about your documents
          </label>

          <textarea
            id="rag-query-composer"
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            placeholder={
              disabled
                ? 'Upload a document or select an indexed document to begin...'
                : 'Ask a question about your documents... (Shift+Enter for newline)'
            }
            className="w-full resize-none bg-transparent py-2 px-3 text-sm text-[#F7F7FA] placeholder-[#7C8090] focus:outline-none disabled:opacity-50 min-h-[44px] max-h-[160px]"
          />

          <button
            type="submit"
            disabled={disabled || isLoading || !input.trim()}
            className="h-11 w-11 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-r from-[#FF2D95] to-[#D817F9] hover:from-[#ff3d9f] hover:to-[#df2bfb] disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-[0_0_15px_rgba(255,45,149,0.3)] transition-all focus:outline-none focus:ring-2 focus:ring-[#FF2D95]"
            aria-label="Send query"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#7C8090] px-2 pt-2">
          <span>Evidence-grounded RAG • Press Enter to send</span>
          <span className="hidden sm:inline">Strict Citation Verification</span>
        </div>
      </div>
    </div>
  );
};
