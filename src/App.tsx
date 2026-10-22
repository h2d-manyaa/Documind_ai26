import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { SecuritySection } from './components/SecuritySection';
import { Footer } from './components/Footer';
import { WorkspaceView } from './components/Workspace/WorkspaceView';
import { DjangoArchitectureModal } from './components/DjangoArchitectureModal';
import { DocumentRecord, WorkspaceStats } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [isDjangoModalOpen, setIsDjangoModalOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [stats, setStats] = useState<WorkspaceStats>({
    totalDocuments: 0,
    readyDocuments: 0,
    totalChunks: 0,
    totalTokens: 0,
    vectorDbStatus: 'Active'
  });
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);

  // Check URL query parameters for ?autostart=1 or ?view=workspace
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' || params.get('view') === 'workspace') {
      setCurrentView('workspace');
    }
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsDocumentsLoading(true);
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsDocumentsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchDocuments();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleResetSeed = async () => {
    try {
      setIsDocumentsLoading(true);
      const res = await fetch('/api/reset-seed', { method: 'POST' });
      if (res.ok) {
        await fetchDocuments();
      }
    } catch (err) {
      console.error('Reset seed failed:', err);
    } finally {
      setIsDocumentsLoading(false);
    }
  };

  const handleNavigate = (view: 'landing' | 'workspace', targetSection?: string) => {
    setCurrentView(view);
    if (view === 'landing' && targetSection) {
      setTimeout(() => {
        const el = document.getElementById(targetSection);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#F7F7FA]">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        stats={stats}
        onOpenDjangoModal={() => setIsDjangoModalOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        {currentView === 'landing' ? (
          <>
            <Hero
              onStartExploring={() => setCurrentView('workspace')}
              onHowItWorks={() => {
                const el = document.getElementById('how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <HowItWorks />
            <Features />
            <SecuritySection />
            <Footer
              onNavigate={(sectionId) => {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenDjangoModal={() => setIsDjangoModalOpen(true)}
            />
          </>
        ) : (
          <WorkspaceView
            documents={documents}
            stats={stats}
            onRefreshDocuments={fetchDocuments}
            onDeleteDocument={handleDeleteDocument}
            onResetSeed={handleResetSeed}
            isDocumentsLoading={isDocumentsLoading}
          />
        )}
      </main>

      <DjangoArchitectureModal
        isOpen={isDjangoModalOpen}
        onClose={() => setIsDjangoModalOpen(false)}
      />
    </div>
  );
}
