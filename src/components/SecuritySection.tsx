import React from 'react';
import { ShieldCheck, Lock, KeyRound, Trash2, EyeOff, FileWarning } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityControls = [
    {
      title: 'Prompt-Injection Defense',
      icon: ShieldCheck,
      color: '#00D9FF',
      description: 'Document passages are treated strictly as inert untrusted text wrapped in boundary delimiters. Embedded instructions attempting to alter system rules are rendered completely ineffectual.'
    },
    {
      title: 'Server-Side Secret Isolation',
      icon: KeyRound,
      color: '#FF2D95',
      description: 'LLM and embedding API credentials remain exclusively in server environment variables. Zero API keys are bundled into frontend assets or exposed over client network requests.'
    },
    {
      title: 'MIME & Payload Validation',
      icon: FileWarning,
      color: '#FFC857',
      description: 'Rigorous server-side buffer validation enforces 25MB ceiling limits and verifies file headers before text extraction, preventing malformed payload exploits.'
    },
    {
      title: 'Zero Permanent Data Lock-in',
      icon: Trash2,
      color: '#25D9A0',
      description: 'Deleting a document permanently purges all raw text, chunks, and high-dimensional vector representations from the system in real time.'
    },
    {
      title: 'Evidence-Grounded Abstention',
      icon: Lock,
      color: '#8B5CF6',
      description: 'Unlike ungrounded LLMs that guess when data is missing, DocuMind enforces automated abstention thresholds when candidate passages fall below confidence minimums.'
    },
    {
      title: 'Private Vector Workspaces',
      icon: EyeOff,
      color: '#007BA7',
      description: 'Retrieval queries only search vectors within your authorized workspace boundaries, ensuring complete tenant and session isolation.'
    }
  ];

  return (
    <section id="security" className="py-20 bg-[#0A0A0D] border-t border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101116] border border-[#25D9A0]/30 text-xs font-mono text-[#25D9A0]">
            <span>DATA INTEGRITY & DEFENSE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Enterprise Security Architecture
          </h2>
          <p className="text-sm sm:text-base text-[#B9BBC8]">
            Built with defense-in-depth principles: untrusted content isolation, server-side secret boundaries, and deterministic vector pruning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityControls.map((ctrl) => {
            const IconComp = ctrl.icon;
            return (
              <div
                key={ctrl.title}
                className="p-6 rounded-2xl bg-[#101116] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${ctrl.color}15`, color: ctrl.color }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading mb-2">{ctrl.title}</h3>
                  <p className="text-xs text-[#B9BBC8] leading-relaxed">{ctrl.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
