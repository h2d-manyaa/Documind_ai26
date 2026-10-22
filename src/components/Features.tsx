import React from 'react';
import { BookOpen, Code2, LineChart, Building2, FolderArchive, FileSearch } from 'lucide-react';

export const Features: React.FC = () => {
  const useCases = [
    {
      title: 'Research & Academic Study',
      icon: BookOpen,
      color: '#00D9FF',
      description: 'Ingest scholarly preprints, conference papers, and reference literature. Extract key equations, methodologies, and cross-reference multiple findings.'
    },
    {
      title: 'Technical Documentation & APIs',
      icon: Code2,
      color: '#8B5CF6',
      description: 'Navigate sprawling software specs, SDK manuals, and architecture guides without losing track of parameter types, error codes, and version caveats.'
    },
    {
      title: 'Business & Financial Reports',
      icon: LineChart,
      color: '#FF2D95',
      description: 'Audit quarterly earnings, SEC filings, board briefs, and investment memos with numerical citations directly referenced to source tables.'
    },
    {
      title: 'Internal Knowledge Bases',
      icon: Building2,
      color: '#007BA7',
      description: 'Consolidate organizational SOPs, onboarding manuals, compliance guidelines, and HR handbooks into a single grounded conversational interface.'
    },
    {
      title: 'Personal Document Collections',
      icon: FolderArchive,
      color: '#D817F9',
      description: 'Search personal notes, tax documentation, lease agreements, and medical records with confidence that sensitive files remain strictly isolated.'
    },
    {
      title: 'Document Summarization',
      icon: FileSearch,
      color: '#25D9A0',
      description: 'Generate concise executive summaries, risk breakdowns, and action items with verifiable passages ready for one-click inspection.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101116] border border-[#FF2D95]/30 text-xs font-mono text-[#FF2D95]">
            <span>CAPABILITIES & WORKFLOWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Built for Knowledge-Intensive Work
          </h2>
          <p className="text-sm sm:text-base text-[#B9BBC8]">
            Transform static documents into conversational intelligence across six core professional environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc) => {
            const IconComp = uc.icon;
            return (
              <div
                key={uc.title}
                className="group p-6 rounded-2xl bg-[#0A0A0D] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between hover:bg-[#101116]/80"
              >
                <div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${uc.color}15`, color: uc.color, border: `1px solid ${uc.color}30` }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-heading mb-2">{uc.title}</h3>
                  <p className="text-xs sm:text-sm text-[#B9BBC8] leading-relaxed">{uc.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
