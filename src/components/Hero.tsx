import React, { useState } from 'react';
import { ArrowRight, FileText, Sparkles, CheckCircle2, Search, Cpu, Database, Eye, Compass } from 'lucide-react';

interface HeroProps {
  onStartExploring: () => void;
  onHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartExploring, onHowItWorks }) => {
  const [activeNode, setActiveNode] = useState<number>(2);

  const pipelineNodes = [
    { id: 1, label: 'Doc Ingestion', type: 'PDF / TXT', color: '#00D9FF' },
    { id: 2, label: 'Semantic Chunking', type: 'Sliding Overlap', color: '#8B5CF6' },
    { id: 3, label: 'Vector Index', type: 'High-Dim Space', color: '#D817F9' },
    { id: 4, label: 'Grounded Answer', type: 'Cited Evidence', color: '#FF2D95' }
  ];

  return (
    <section id="overview" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-[#050505]">
      {/* Cinematic ambient background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#00D9FF]/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[520px] h-[520px] rounded-full bg-[#FF2D95]/10 blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Copy / Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101116] border border-[#00D9FF]/30 text-xs font-mono text-[#00D9FF] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]"></span>
              <span>DOCUMENT INTELLIGENCE / RAG ENGINE</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-heading leading-[1.12]">
              Your Documents.{' '}
              <span className="bg-gradient-to-r from-[#00D9FF] via-[#D817F9] to-[#FF2D95] bg-clip-text text-transparent">
                Beyond Search.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-[#B9BBC8] font-normal max-w-2xl leading-relaxed">
              Upload your documents. Ask better questions. Get evidence-grounded answers with source passages you can inspect.
            </p>

            {/* Primary and Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onStartExploring}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[#FF2D95] to-[#D817F9] hover:from-[#ff3d9f] hover:to-[#df2bfb] shadow-[0_0_25px_rgba(255,45,149,0.4)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF2D95]"
              >
                <span>START EXPLORING</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onHowItWorks}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-[#0A0A0D] hover:bg-[#101116] border border-white/15 hover:border-[#00D9FF]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#00D9FF]"
              >
                <span>HOW IT WORKS</span>
                <Compass className="w-4 h-4 text-[#00D9FF]" />
              </button>
            </div>

            {/* Supporting Labels */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono text-[#7C8090]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]"></span>
                <span className="text-[#B9BBC8] font-medium">PDF + TXT</span>
                <span>SUPPORT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D817F9]"></span>
                <span className="text-[#B9BBC8] font-medium">SEMANTIC RETRIEVAL</span>
                <span>COSINE SIMILARITY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D95]"></span>
                <span className="text-[#B9BBC8] font-medium">SOURCE REFERENCES</span>
                <span>VERIFIABLE EVIDENCE</span>
              </div>
            </div>
          </div>

          {/* AI / Document Visualization / Right Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[480px] lg:max-w-none">
              
              {/* Card Container with fine glowing borders */}
              <div className="relative rounded-2xl bg-[#0A0A0D]/90 border border-white/15 p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
                {/* Visual rim light */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00D9FF]/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FF2D95]/20 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header of graphic */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF647C]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#FFC857]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#25D9A0]"></span>
                    <span className="ml-2 text-xs font-mono text-[#7C8090]">documind-rag-engine.sys</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00D9FF]/10 text-[11px] font-mono text-[#00D9FF] border border-[#00D9FF]/30">
                    <Cpu className="w-3 h-3" />
                    <span>EMBEDDINGS ACTIVE</span>
                  </div>
                </div>

                {/* Simulated Neural Retrieval Core & Vector Nodes */}
                <div className="py-6 space-y-4">
                  {/* Floating Document Input Pill */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#101116] border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FF2D95]/15 border border-[#FF2D95]/30 flex items-center justify-center text-[#FF2D95]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">RAG_Technical_Blueprint.pdf</div>
                        <div className="text-[10px] font-mono text-[#7C8090]">2 Pages • 8 Sliding Chunks • Indexed</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#25D9A0]/10 text-[#25D9A0] border border-[#25D9A0]/25">
                      READY
                    </span>
                  </div>

                  {/* Connected Vector Space Visualization */}
                  <div className="relative py-3 px-4 rounded-xl bg-[#050505] border border-white/10">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#7C8090] mb-2">
                      <div className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-[#00D9FF]" />
                        <span>VECTOR SPACE RETRIEVAL</span>
                      </div>
                      <span className="text-[#00D9FF] font-semibold">cos(θ) = 0.942</span>
                    </div>

                    {/* Node stages */}
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {pipelineNodes.map((node) => {
                        const isCurrent = activeNode === node.id;
                        return (
                          <button
                            key={node.id}
                            onClick={() => setActiveNode(node.id)}
                            className={`p-2 rounded-lg text-left transition-all border ${
                              isCurrent
                                ? 'bg-[#171820] border-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.2)]'
                                : 'bg-[#101116] border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="text-[10px] font-mono font-medium text-white truncate">{node.label}</div>
                            <div className="text-[9px] font-mono text-[#7C8090] truncate">{node.type}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grounded Output Passages & Citation Highlight */}
                  <div className="p-4 rounded-xl bg-[#101116] border border-[#00D9FF]/30 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF2D95]" />
                        Grounded Synthesis
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30">
                        [Source 1: p.1]
                      </span>
                    </div>

                    <p className="text-xs text-[#B9BBC8] leading-relaxed">
                      "DocuMind AI eliminates hallucinations by restricting answers exclusively to candidate vector chunks, enforcing a standardized abstention rule when evidence confidence is insufficient."
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#7C8090]">
                      <span className="text-[#25D9A0] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Citation Verified
                      </span>
                      <span className="text-[#00D9FF] hover:underline cursor-pointer flex items-center gap-1" onClick={onStartExploring}>
                        <Eye className="w-3 h-3" /> Inspect Passage
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-label banner */}
                <div className="text-center pt-2 text-[11px] font-mono text-[#7C8090]">
                  Live Evidence Pipeline • Zero Ungrounded Assumptions
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
