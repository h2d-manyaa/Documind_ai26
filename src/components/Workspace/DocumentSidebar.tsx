import React, { useState } from 'react';
import { FileText, Trash2, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Database, Layers } from 'lucide-react';
import { DocumentRecord, WorkspaceStats } from '../../types';

interface DocumentSidebarProps {
  documents: DocumentRecord[];
  selectedDocIds: string[];
  onToggleDocSelection: (id: string) => void;
  onSelectAllDocs: () => void;
  onDeleteDoc: (id: string) => Promise<void>;
  onResetSeed: () => Promise<void>;
  stats: WorkspaceStats;
  isLoading: boolean;
}

export const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  documents,
  selectedDocIds,
  onToggleDocSelection,
  onSelectAllDocs,
  onDeleteDoc,
  onResetSeed,
  stats,
  isLoading
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? All associated vectors and chunk indices will be permanently removed.`)) {
      setDeletingId(id);
      try {
        await onDeleteDoc(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const allSelected = selectedDocIds.length === 0 || selectedDocIds.length === documents.length;

  return (
    <div className="flex flex-col h-full bg-[#0A0A0D] border-r border-white/10">
      {/* Workspace Header / Stats */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00D9FF]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              Knowledge Base
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
            {stats.readyDocuments} Ready
          </span>
        </div>

        {/* Metric pills */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded-lg bg-[#101116] border border-white/5">
            <div className="text-[10px] text-[#7C8090]">CHUNKS</div>
            <div className="text-sm font-semibold text-white">{stats.totalChunks}</div>
          </div>
          <div className="p-2 rounded-lg bg-[#101116] border border-white/5">
            <div className="text-[10px] text-[#7C8090]">EST. TOKENS</div>
            <div className="text-sm font-semibold text-[#00D9FF]">{stats.totalTokens}</div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            onClick={onSelectAllDocs}
            className={`font-mono text-[11px] hover:underline cursor-pointer ${
              allSelected ? 'text-[#00D9FF]' : 'text-[#7C8090]'
            }`}
          >
            {allSelected ? 'All Docs Active' : 'Select All'}
          </button>

          <button
            onClick={onResetSeed}
            className="flex items-center gap-1 text-[11px] font-mono text-[#7C8090] hover:text-white cursor-pointer"
            title="Restore reference blueprints & policies"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Samples</span>
          </button>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {documents.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <FileText className="w-8 h-8 text-[#7C8090] mx-auto opacity-50" />
            <p className="text-xs text-[#7C8090]">No documents uploaded yet.</p>
            <button
              onClick={onResetSeed}
              className="text-xs font-mono text-[#00D9FF] hover:underline cursor-pointer"
            >
              Load Sample Documents
            </button>
          </div>
        ) : (
          documents.map((doc) => {
            const isSelected = selectedDocIds.length === 0 || selectedDocIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                className={`group relative p-3 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#101116] border-white/15 hover:border-[#00D9FF]/40'
                    : 'bg-[#050505] border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => onToggleDocSelection(doc.id)}
                    className="flex-1 cursor-pointer flex items-start gap-2.5 min-w-0"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                        doc.type === 'pdf'
                          ? 'bg-[#FF2D95]/15 text-[#FF2D95] border border-[#FF2D95]/30'
                          : 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30'
                      }`}
                    >
                      {doc.type.toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white truncate" title={doc.name}>
                        {doc.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#7C8090] flex items-center gap-2 mt-0.5">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>{doc.chunkCount} chunks</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(doc.id, doc.name)}
                    disabled={deletingId === doc.id}
                    className="p-1 rounded text-[#7C8090] hover:text-[#FF647C] opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    aria-label={`Delete ${doc.name}`}
                    title="Permanently delete document and its vectors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status indicator */}
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-[#25D9A0]">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                  <span className="text-[#7C8090]">{doc.totalTokens} tokens</span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
