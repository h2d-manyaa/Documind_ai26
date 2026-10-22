import React, { useState } from 'react';
import { Sparkles, Bot, User, Copy, Check, Bookmark, AlertCircle, ArrowUpRight, HelpCircle } from 'lucide-react';
import { ChatMessage, SourceCitation } from '../../types';

interface ChatAreaProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSelectCitation: (citation: SourceCitation) => void;
  onSelectSuggestedPrompt: (prompt: string) => void;
  hasDocuments: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onSelectCitation,
  onSelectSuggestedPrompt,
  hasDocuments
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const suggestedPrompts = [
    'How does DocuMind AI eliminate hallucinations?',
    'What is the sliding window chunking and overlap strategy?',
    'Explain the prompt injection defense policy',
    'What happens when evidence in documents is insufficient?'
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {messages.length === 0 ? (
        <div className="max-w-2xl mx-auto py-12 text-center space-y-6 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#101116] to-[#171820] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] mx-auto shadow-[0_0_25px_rgba(0,217,255,0.15)]">
            <Sparkles className="w-7 h-7 text-[#00D9FF]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Your knowledge is waiting.
            </h3>
            <p className="text-sm text-[#B9BBC8] max-w-md mx-auto">
              Ask a question about your uploaded documents to discover relevant information with inspectable citations.
            </p>
          </div>

          {/* Suggested Prompts */}
          <div className="pt-4 text-left">
            <div className="text-xs font-mono text-[#7C8090] mb-3 text-center sm:text-left">
              SUGGESTED EXPLORATIONS (GROUNDED IN SEEDED BLUEPRINTS):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSelectSuggestedPrompt(prompt)}
                  className="p-3 text-left rounded-xl bg-[#101116] border border-white/10 hover:border-[#00D9FF]/40 text-xs text-[#B9BBC8] hover:text-white transition-all flex items-start justify-between gap-2 group cursor-pointer"
                >
                  <span>{prompt}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#7C8090] group-hover:text-[#00D9FF] shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#101116] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 sm:p-5 border transition-all ${
                    isUser
                      ? 'bg-[#171820] border-white/10 text-white rounded-tr-sm'
                      : msg.isGrounded === false
                      ? 'bg-[#101116] border-[#FFC857]/30 text-[#F7F7FA] rounded-tl-sm'
                      : 'bg-[#101116] border-white/10 text-[#F7F7FA] rounded-tl-sm'
                  }`}
                >
                  {/* Assistant response header */}
                  {!isUser && (
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/5 text-[11px] font-mono text-[#7C8090]">
                      <div className="flex items-center gap-2">
                        {msg.isGrounded === false ? (
                          <span className="flex items-center gap-1 text-[#FFC857]">
                            <AlertCircle className="w-3 h-3" /> Abstention / Missing Evidence
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[#25D9A0]">
                            <Sparkles className="w-3 h-3" /> Grounded Synthesis
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="text-[#7C8090] hover:text-white flex items-center gap-1 cursor-pointer"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-[#25D9A0]" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {/* Message body */}
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {/* Citations Chips */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5">
                      <div className="text-[11px] font-mono text-[#7C8090] mb-2 flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-[#00D9FF]" />
                        <span>VERIFIED CITATIONS (CLICK TO INSPECT):</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cite, cIdx) => (
                          <button
                            key={cite.id}
                            onClick={() => onSelectCitation(cite)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#050505] border border-white/10 hover:border-[#00D9FF]/50 text-xs font-mono text-[#00D9FF] hover:text-white transition-all cursor-pointer"
                          >
                            <span className="text-[#FF2D95] font-bold">[Source {cIdx + 1}]</span>
                            <span className="truncate max-w-[140px] text-[#B9BBC8]">{cite.documentName}</span>
                            {cite.pageNumber && (
                              <span className="text-[10px] text-[#7C8090]">p.{cite.pageNumber}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#171820] border border-white/20 flex items-center justify-center text-white shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3.5 items-start">
              <div className="w-8 h-8 rounded-xl bg-[#101116] border border-[#00D9FF]/30 flex items-center justify-center text-[#00D9FF] shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-[#101116] border border-white/10 text-xs font-mono text-[#00D9FF] flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-[#00D9FF] animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-[#D817F9] animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#FF2D95] animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>Retrieving relevant vector passages and synthesizing answer...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
