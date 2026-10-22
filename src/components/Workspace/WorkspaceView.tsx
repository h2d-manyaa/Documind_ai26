import React, { useState } from 'react';
import { DocumentRecord, WorkspaceStats, ChatMessage, SourceCitation, QueryResponse } from '../../types';
import { DocumentSidebar } from './DocumentSidebar';
import { DocumentUploadCard } from './DocumentUploadCard';
import { ChatArea } from './ChatArea';
import { ChatComposer } from './ChatComposer';
import { EvidenceDrawer } from './EvidenceDrawer';
import { Layers, Bookmark, Upload, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface WorkspaceViewProps {
  documents: DocumentRecord[];
  stats: WorkspaceStats;
  onRefreshDocuments: () => Promise<void>;
  onDeleteDocument: (id: string) => Promise<void>;
  onResetSeed: () => Promise<void>;
  isDocumentsLoading: boolean;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  documents,
  stats,
  onRefreshDocuments,
  onDeleteDocument,
  onResetSeed,
  isDocumentsLoading
}) => {
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isQueryLoading, setIsQueryLoading] = useState(false);

  // Evidence Drawer state
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(true);
  const [activeCitations, setActiveCitations] = useState<SourceCitation[]>([]);
  const [selectedCitationId, setSelectedCitationId] = useState<string | undefined>();
  const [lastQuery, setLastQuery] = useState('');

  // Mobile drawer states
  const [mobileDocsOpen, setMobileDocsOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const toggleDocSelection = (id: string) => {
    setSelectedDocIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((dId) => dId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAllDocs = () => {
    if (selectedDocIds.length === documents.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(documents.map((d) => d.id));
    }
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isQueryLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsQueryLoading(true);
    setLastQuery(textToSend.trim());

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend.trim(),
          documentIds: selectedDocIds.length > 0 ? selectedDocIds : undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Query failed with status ${response.status}`);
      }

      const data: QueryResponse = await response.json();

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
        citations: data.citations,
        isGrounded: data.isGrounded,
        retrievalCount: data.retrievedChunksCount,
        similarityScore: data.bestSimilarity
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.citations && data.citations.length > 0) {
        setActiveCitations(data.citations);
        setIsEvidenceOpen(true);
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Error: ${err.message || 'Failed to complete query. Please check server logs.'}`,
        timestamp: new Date().toISOString(),
        isGrounded: false
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsQueryLoading(false);
    }
  };

  const handleSelectCitation = (citation: SourceCitation) => {
    setSelectedCitationId(citation.id);
    setIsEvidenceOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4.5rem)] bg-[#050505] overflow-hidden">
      
      {/* Workspace Top Toolbar */}
      <div className="h-12 border-b border-white/10 bg-[#0A0A0D] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile docs toggle */}
          <button
            onClick={() => setMobileDocsOpen(!mobileDocsOpen)}
            className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#101116] border border-white/10 text-xs font-mono text-[#00D9FF]"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Docs ({stats.readyDocuments})</span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#25D9A0] animate-pulse"></span>
            <span className="text-xs font-mono font-medium text-white">WORKSPACE ACTIVE</span>
            <span className="text-xs font-mono text-[#7C8090]">
              ({stats.readyDocuments} ready docs • {stats.totalChunks} indexed chunks)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101116] hover:bg-[#171820] border border-white/10 hover:border-[#00D9FF]/40 text-xs font-medium text-white transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Upload Document</span>
          </button>

          {/* Evidence Toggle */}
          <button
            onClick={() => setIsEvidenceOpen(!isEvidenceOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              isEvidenceOpen
                ? 'bg-[#00D9FF]/15 border-[#00D9FF]/40 text-[#00D9FF]'
                : 'bg-[#101116] border-white/10 text-[#7C8090] hover:text-white'
            }`}
            title="Toggle Source Evidence Drawer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Evidence ({activeCitations.length})</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Desktop Left Sidebar: Documents */}
        <div className="hidden md:block w-72 lg:w-80 h-full shrink-0">
          <DocumentSidebar
            documents={documents}
            selectedDocIds={selectedDocIds}
            onToggleDocSelection={toggleDocSelection}
            onSelectAllDocs={handleSelectAllDocs}
            onDeleteDoc={onDeleteDocument}
            onResetSeed={onResetSeed}
            stats={stats}
            isLoading={isDocumentsLoading}
          />
        </div>

        {/* Mobile Left Sidebar Overlay */}
        {mobileDocsOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileDocsOpen(false)}
            />
            <div className="relative w-80 max-w-[85%] bg-[#0A0A0D] h-full shadow-2xl z-50">
              <div className="flex justify-end p-2 border-b border-white/10">
                <button
                  onClick={() => setMobileDocsOpen(false)}
                  className="p-1 rounded text-[#7C8090] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-[calc(100%-48px)]">
                <DocumentSidebar
                  documents={documents}
                  selectedDocIds={selectedDocIds}
                  onToggleDocSelection={toggleDocSelection}
                  onSelectAllDocs={handleSelectAllDocs}
                  onDeleteDoc={onDeleteDocument}
                  onResetSeed={onResetSeed}
                  stats={stats}
                  isLoading={isDocumentsLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Center Chat View */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050505]">
          <ChatArea
            messages={messages}
            isLoading={isQueryLoading}
            onSelectCitation={handleSelectCitation}
            onSelectSuggestedPrompt={(p) => handleSendQuery(p)}
            hasDocuments={documents.length > 0}
          />

          <ChatComposer
            input={input}
            setInput={setInput}
            onSend={() => handleSendQuery()}
            isLoading={isQueryLoading}
            disabled={documents.length === 0}
          />
        </div>

        {/* Right Evidence Drawer */}
        {isEvidenceOpen && (
          <EvidenceDrawer
            isOpen={isEvidenceOpen}
            onClose={() => setIsEvidenceOpen(false)}
            citations={activeCitations}
            selectedCitationId={selectedCitationId}
            queryQuestion={lastQuery}
          />
        )}

      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-[#0A0A0D] border border-white/20 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#00D9FF]" />
                <h3 className="text-base font-bold text-white font-heading">
                  Ingest Document
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-[#7C8090] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <DocumentUploadCard
              onUploadSuccess={async () => {
                await onRefreshDocuments();
                setShowUploadModal(false);
              }}
            />

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
