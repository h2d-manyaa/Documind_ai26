import React from 'react';
import { Layers, ShieldCheck, Cpu, ArrowUp, Database } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenDjangoModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDjangoModal }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 text-xs text-[#7C8090]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#101116] border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF]">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-heading">
                DocuMind <span className="text-[#00D9FF]">AI</span>
              </span>
            </div>

            <p className="text-[#B9BBC8] max-w-sm leading-relaxed text-xs">
              Evidence-grounded document intelligence and semantic RAG engine. Upload your PDFs and text files, ask complex questions, and inspect verified source passages.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md bg-[#101116] border border-white/10 text-[11px] font-mono text-[#00D9FF]">
                Adaptive Chunking
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#101116] border border-white/10 text-[11px] font-mono text-[#FF2D95]">
                Strict Grounding
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#101116] border border-white/10 text-[11px] font-mono text-[#25D9A0]">
                Verified Citations
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('overview')}
                  className="hover:text-white transition-colors"
                >
                  System Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors"
                >
                  How RAG Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="hover:text-white transition-colors"
                >
                  Features & Use Cases
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('security')}
                  className="hover:text-white transition-colors"
                >
                  Security Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Specs */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Enterprise Deployment
            </h4>
            <p className="text-xs text-[#B9BBC8] leading-relaxed">
              Compatible with full-stack TypeScript/Express and enterprise Django REST frameworks. Inspect backend models, vector indices, and unit test suites.
            </p>

            <button
              onClick={onOpenDjangoModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101116] border border-white/10 hover:border-[#00D9FF]/40 text-xs font-mono text-[#00D9FF] hover:text-white transition-all cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Inspect Django Backend Code</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div>
            © {currentYear} DocuMind AI. All rights reserved. Evidence-grounded answers with inspectable source references.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-[#7C8090] hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
