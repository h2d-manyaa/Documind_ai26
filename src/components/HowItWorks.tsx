import React, { useState } from 'react';
import { Upload, Scissors, Database, Search, FileCheck, Check, X, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'comparison' | 'finetuning'>('pipeline');

  const steps = [
    {
      step: '01',
      title: 'UPLOAD',
      subtitle: 'Document Ingestion',
      icon: Upload,
      color: '#00D9FF',
      description: 'Add your PDF or TXT files. Files undergo MIME validation, size verification, and structural extraction while preserving original page boundaries.'
    },
    {
      step: '02',
      title: 'EXTRACT & CHUNK',
      subtitle: 'Sliding Overlap Window',
      icon: Scissors,
      color: '#8B5CF6',
      description: 'Content is normalized and split into manageable, overlapping passages (480 chars, 100 char overlap) to preserve context continuity across boundaries.'
    },
    {
      step: '03',
      title: 'EMBED & STORE',
      subtitle: 'Vector Indexing',
      icon: Database,
      color: '#D817F9',
      description: 'Each chunk is mapped to high-dimensional mathematical representations and indexed in vector memory for rapid geometric similarity calculation.'
    },
    {
      step: '04',
      title: 'RETRIEVE',
      subtitle: 'Cosine Similarity Search',
      icon: Search,
      color: '#007BA7',
      description: 'When you ask a question, the engine embeds your query and retrieves the closest matching passages using configurable relevance thresholds.'
    },
    {
      step: '05',
      title: 'GROUNDED ANSWER',
      subtitle: 'Evidence Synthesis',
      icon: FileCheck,
      color: '#FF2D95',
      description: 'The model formulates an answer derived solely from retrieved evidence, appending verified source citations [Source N] with inspectable passages.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#0A0A0D] border-t border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101116] border border-[#00D9FF]/30 text-xs font-mono text-[#00D9FF]">
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            How RAG Works in <span className="text-[#00D9FF]">DocuMind AI</span>
          </h2>
          <p className="text-sm sm:text-base text-[#B9BBC8]">
            Retrieval-Augmented Generation connects generative models to your authoritative documents, replacing hallucinations with verifiable citations.
          </p>

          {/* Sub-navigation tabs */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-gradient-to-r from-[#FF2D95] to-[#D817F9] text-white shadow-[0_0_15px_rgba(255,45,149,0.3)]'
                  : 'bg-[#101116] text-[#7C8090] hover:text-white border border-white/5'
              }`}
            >
              5-Step Technical Pipeline
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'comparison'
                  ? 'bg-gradient-to-r from-[#FF2D95] to-[#D817F9] text-white shadow-[0_0_15px_rgba(255,45,149,0.3)]'
                  : 'bg-[#101116] text-[#7C8090] hover:text-white border border-white/5'
              }`}
            >
              Without RAG vs With RAG
            </button>
            <button
              onClick={() => setActiveTab('finetuning')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'finetuning'
                  ? 'bg-gradient-to-r from-[#FF2D95] to-[#D817F9] text-white shadow-[0_0_15px_rgba(255,45,149,0.3)]'
                  : 'bg-[#101116] text-[#7C8090] hover:text-white border border-white/5'
              }`}
            >
              RAG vs Fine-Tuning
            </button>
          </div>
        </div>

        {/* Tab 1: 5-Step Pipeline */}
        {activeTab === 'pipeline' && (
          <div>
            {/* Desktop horizontal flow */}
            <div className="hidden lg:grid grid-cols-5 gap-4 relative">
              {steps.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.step}
                    className="relative group p-5 rounded-2xl bg-[#101116] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Step Pill */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-[#7C8090]">
                          {item.step}
                        </span>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${item.color}15`, color: item.color }}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white font-heading">{item.title}</h3>
                      <div className="text-xs font-mono text-[#00D9FF] mb-3">{item.subtitle}</div>
                      <p className="text-xs text-[#B9BBC8] leading-relaxed">{item.description}</p>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="absolute top-1/2 -right-3 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#171820] border border-white/20 flex items-center justify-center text-[#7C8090] group-hover:text-[#00D9FF] group-hover:border-[#00D9FF]/40 transition-colors">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile / Tablet vertical timeline */}
            <div className="lg:hidden space-y-4">
              {steps.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.step}
                    className="p-5 rounded-2xl bg-[#101116] border border-white/10 flex gap-4 items-start"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#7C8090]">{item.step}</span>
                        <h3 className="text-base font-bold text-white font-heading">{item.title}</h3>
                      </div>
                      <div className="text-xs font-mono text-[#00D9FF]">{item.subtitle}</div>
                      <p className="text-xs text-[#B9BBC8] leading-relaxed pt-1">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Without RAG vs With RAG */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Without RAG */}
            <div className="p-6 rounded-2xl bg-[#101116] border border-[#FF647C]/30 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-[#FF647C] font-semibold">
                  <X className="w-5 h-5" />
                  <span>Without RAG (Naive LLM)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF647C]/15 text-[#FF647C]">
                  TRAINING WEIGHTS ONLY
                </span>
              </div>

              <ul className="space-y-3 text-xs text-[#B9BBC8]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FF647C] mt-0.5 font-bold">✕</span>
                  <span>Relies solely on memorized static data with an arbitrary cutoff date.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FF647C] mt-0.5 font-bold">✕</span>
                  <span>Confidently hallucinates citations, page numbers, and fabricated clauses.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FF647C] mt-0.5 font-bold">✕</span>
                  <span>Zero visibility into proprietary internal PDFs, spreadsheets, or docs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#FF647C] mt-0.5 font-bold">✕</span>
                  <span>Cannot provide proof or clickable inspectable source references.</span>
                </li>
              </ul>
            </div>

            {/* With RAG */}
            <div className="p-6 rounded-2xl bg-[#101116] border border-[#25D9A0]/40 relative overflow-hidden shadow-[0_0_20px_rgba(37,217,160,0.1)]">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-[#25D9A0] font-semibold">
                  <Check className="w-5 h-5" />
                  <span>With DocuMind AI RAG</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#25D9A0]/15 text-[#25D9A0]">
                  AUTHORITATIVE EVIDENCE
                </span>
              </div>

              <ul className="space-y-3 text-xs text-[#B9BBC8]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#25D9A0] mt-0.5 font-bold">✓</span>
                  <span>Grounds answers in your exact documents uploaded minutes ago.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#25D9A0] mt-0.5 font-bold">✓</span>
                  <span>Strict abstention rule: admits when information is not in the text.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#25D9A0] mt-0.5 font-bold">✓</span>
                  <span>Every claim links to an inspectable source passage with page numbers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#25D9A0] mt-0.5 font-bold">✓</span>
                  <span>Enterprise data isolation: vectors and text deleted on demand.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: RAG vs Fine-Tuning */}
        {activeTab === 'finetuning' && (
          <div className="max-w-4xl mx-auto rounded-2xl bg-[#101116] border border-white/10 p-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#7C8090] font-mono">
                  <th className="pb-3">DIMENSION</th>
                  <th className="pb-3 text-[#00D9FF]">RETRIEVAL-AUGMENTED GENERATION (RAG)</th>
                  <th className="pb-3 text-[#FF2D95]">MODEL FINE-TUNING</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#B9BBC8]">
                <tr>
                  <td className="py-3 font-medium text-white">Knowledge Updates</td>
                  <td className="py-3 text-[#25D9A0]">Instantaneous (Upload & index in seconds)</td>
                  <td className="py-3 text-[#FF647C]">Slow (Requires retraining & pipeline runs)</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">Source Verification</td>
                  <td className="py-3 text-[#25D9A0]">100% Inspectable citations & exact pages</td>
                  <td className="py-3 text-[#FF647C]">Opaque (Weights cannot provide verified citations)</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">Cost & Compute</td>
                  <td className="py-3 text-[#25D9A0]">Low (Standard embedding & inference API)</td>
                  <td className="py-3 text-[#FF647C]">Expensive (High GPU hours for training)</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">Access Control & Deletion</td>
                  <td className="py-3 text-[#25D9A0]">Strict (Delete vectors instantly removes knowledge)</td>
                  <td className="py-3 text-[#FF647C]">Impossible without full model retraining</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
};
