import React, { useState } from 'react';
import { X, FileText, CheckCircle, ExternalLink, Sparkles, Copy, Check, Hash, Bookmark } from 'lucide-react';
import { SourceCitation } from '../../types';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  citations: SourceCitation[];
  selectedCitationId?: string;
  queryQuestion?: string;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  citations,
  selectedCitationId,
  queryQuestion
}) => {
  const [inspectModalCitation, setInspectModalCitation] = useState<SourceCitation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const highlightSnippet = (snippet: string, matchedTerms?: string[]) => {
    if (!matchedTerms || matchedTerms.length === 0) return snippet;

    // Build regex of terms
    const escapedTerms = matchedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!escapedTerms) return snippet;

    const regex = new RegExp(`(${escapedTerms})`, 'gi');
    const parts = snippet.split(regex);

    return parts.map((part, index) => {
      const isMatch = matchedTerms.some(t => t.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <mark key={index} className="bg-[#00D9FF]/25 text-[#00D9FF] px-1 py-0.5 rounded font-medium">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <>
      <div className="w-80 md:w-96 flex flex-col h-full bg-[#0A0A0D] border-l border-white/10 shrink-0">
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#101116]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#00D9FF]/15 text-[#00D9FF] flex items-center justify-center">
              <Bookmark className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Source Evidence ({citations.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#7C8090] hover:text-white transition-colors"
            aria-label="Close evidence drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Evidence List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {citations.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <FileText className="w-8 h-8 text-[#7C8090] mx-auto opacity-40" />
              <p className="text-xs text-[#7C8090]">No active evidence passages for this answer.</p>
            </div>
          ) : (
            citations.map((cite, index) => {
              const isSelected = selectedCitationId === cite.id;
              const similarityPercent = Math.min(100, Math.round(cite.similarityScore * 100));

              return (
                <div
                  key={cite.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#171820] border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.2)]'
                      : 'bg-[#101116] border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Card Header: Tag, File, Page */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30">
                      [Source {index + 1}]
                    </span>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#25D9A0]">
                      <CheckCircle className="w-3 h-3" />
                      <span>{similarityPercent}% Match</span>
                    </div>
                  </div>

                  {/* Document & Page */}
                  <div className="text-xs font-semibold text-white truncate mb-1" title={cite.documentName}>
                    {cite.documentName}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#7C8090] mb-3">
                    {cite.pageNumber && (
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#00D9FF]">
                        Page {cite.pageNumber}
                      </span>
                    )}
                    <span className="truncate">Chunk: {cite.chunkIndex}</span>
                  </div>

                  {/* Excerpt with Keyword Highlight */}
                  <p className="text-xs text-[#B9BBC8] leading-relaxed line-clamp-4 bg-[#050505] p-2.5 rounded-lg border border-white/5 font-mono text-[11px]">
                    {highlightSnippet(cite.snippet, cite.matchedTerms)}
                  </p>

                  {/* Actions */}
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <button
                      onClick={() => setInspectModalCitation(cite)}
                      className="text-[#00D9FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Passage</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleCopy(cite.id, cite.snippet)}
                      className="text-[#7C8090] hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === cite.id ? <Check className="w-3 h-3 text-[#25D9A0]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === cite.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Inspect Full Passage Modal */}
      {inspectModalCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0A0A0D] border border-white/20 p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h4 className="text-base font-bold text-white font-heading">
                  {inspectModalCitation.documentName}
                </h4>
                <div className="text-xs font-mono text-[#7C8090] flex items-center gap-3 mt-1">
                  {inspectModalCitation.pageNumber && (
                    <span className="text-[#00D9FF]">Page {inspectModalCitation.pageNumber}</span>
                  )}
                  <span>Chunk Index: {inspectModalCitation.chunkIndex}</span>
                  <span>ID: {inspectModalCitation.id}</span>
                </div>
              </div>

              <button
                onClick={() => setInspectModalCitation(null)}
                className="p-1 rounded text-[#7C8090] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-[#050505] border border-white/10 text-xs sm:text-sm text-[#F7F7FA] font-mono leading-relaxed whitespace-pre-wrap">
              {highlightSnippet(inspectModalCitation.snippet, inspectModalCitation.matchedTerms)}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-[#25D9A0] font-mono">
                Verified Grounding Evidence
              </span>
              <button
                onClick={() => setInspectModalCitation(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
