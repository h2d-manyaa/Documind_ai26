import React, { useState } from 'react';
import { Layers, Shield, Terminal, BookOpen, Cpu, Sparkles, Menu, X, ArrowRight, Database } from 'lucide-react';
import { WorkspaceStats } from '../types';

interface HeaderProps {
  currentView: 'landing' | 'workspace';
  onNavigate: (view: 'landing' | 'workspace', targetSection?: string) => void;
  stats?: WorkspaceStats;
  onOpenDjangoModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  stats,
  onOpenDjangoModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (sectionId) {
      if (currentView !== 'landing') {
        onNavigate('landing', sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate('landing');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#050505]/85 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick()}
          className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-[#00D9FF] rounded-lg p-1"
          aria-label="DocuMind AI Home"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#101116] to-[#171820] border border-[#00D9FF]/40 flex items-center justify-center shadow-lg group-hover:border-[#00D9FF] transition-all duration-300">
            <div className="absolute inset-0 bg-[#00D9FF]/10 rounded-xl blur-xs group-hover:bg-[#00D9FF]/20 transition-all"></div>
            {/* Custom Logo icon: layered doc outline + neural node */}
            <div className="relative flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#00D9FF] transition-transform group-hover:scale-105" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FF2D95] shadow-[0_0_8px_#FF2D95]"></span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                DocuMind <span className="text-[#00D9FF]">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
                RAG v4.0
              </span>
            </div>
            <span className="hidden md:block text-[11px] font-mono text-[#7C8090] tracking-wide">
              DOCUMENT INTELLIGENCE ENGINE
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#B9BBC8]" aria-label="Main Navigation">
          <button
            onClick={() => handleNavClick('overview')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('security')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Security
          </button>
          <button
            onClick={onOpenDjangoModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#101116] border border-white/10 hover:border-[#00D9FF]/50 text-xs font-mono text-[#00D9FF] hover:text-white transition-all cursor-pointer"
            title="Inspect Django backend models & API code"
          >
            <Database className="w-3.5 h-3.5 text-[#00D9FF]" />
            Django Architecture
          </button>
        </nav>

        {/* Real Status Badge & Workspace CTA */}
        <div className="flex items-center gap-3">
          {stats && stats.readyDocuments > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#101116] border border-white/10 text-xs font-mono text-[#B9BBC8]">
              <span className="w-2 h-2 rounded-full bg-[#25D9A0] animate-pulse"></span>
              <span>{stats.readyDocuments} {stats.readyDocuments === 1 ? 'doc' : 'docs'} indexed</span>
            </div>
          )}

          {currentView === 'landing' ? (
            <button
              onClick={() => onNavigate('workspace')}
              className="relative group inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white bg-gradient-to-r from-[#FF2D95] to-[#D817F9] hover:from-[#ff3d9f] hover:to-[#df2bfb] shadow-[0_0_20px_rgba(255,45,149,0.35)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF2D95]"
            >
              <span>OPEN WORKSPACE</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-white bg-[#101116] hover:bg-[#171820] border border-white/15 hover:border-[#00D9FF]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
            >
              <span>VIEW OVERVIEW</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#101116] border border-white/10 text-[#B9BBC8] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0A0D] border-b border-white/10 px-4 py-5 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#B9BBC8]">
            <button
              onClick={() => handleNavClick('overview')}
              className="text-left py-2 px-3 rounded-lg hover:bg-white/5 hover:text-white"
            >
              Overview
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left py-2 px-3 rounded-lg hover:bg-white/5 hover:text-white"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('features')}
              className="text-left py-2 px-3 rounded-lg hover:bg-white/5 hover:text-white"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('security')}
              className="text-left py-2 px-3 rounded-lg hover:bg-white/5 hover:text-white"
            >
              Security
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDjangoModal();
              }}
              className="flex items-center gap-2 py-2 px-3 rounded-lg bg-[#101116] border border-white/10 text-xs font-mono text-[#00D9FF]"
            >
              <Database className="w-3.5 h-3.5" />
              Django Architecture
            </button>
          </div>

          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(currentView === 'landing' ? 'workspace' : 'landing');
              }}
              className="w-full py-2.5 rounded-xl font-medium text-sm text-center text-white bg-gradient-to-r from-[#FF2D95] to-[#D817F9]"
            >
              {currentView === 'landing' ? 'OPEN WORKSPACE' : 'BACK TO OVERVIEW'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
