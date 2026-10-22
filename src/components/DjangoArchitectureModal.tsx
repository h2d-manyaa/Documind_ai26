import React, { useState } from 'react';
import { X, Check, Copy, Database, Code, Terminal, FileCode } from 'lucide-react';

interface DjangoArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DjangoArchitectureModal: React.FC<DjangoArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'models' | 'service' | 'views' | 'tests'>('models');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets = {
    models: `from django.db import models
import uuid

class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='documind/%Y/%m/')
    file_type = models.CharField(max_length=10, choices=[('pdf', 'PDF'), ('txt', 'TXT')])
    file_size_bytes = models.BigIntegerField()
    status = models.CharField(max_length=20, default='READY')
    total_chunks = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class DocumentChunk(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    chunk_index = models.PositiveIntegerField()
    page_number = models.PositiveIntegerField(null=True, blank=True)
    text_content = models.TextField()
    token_count_estimate = models.PositiveIntegerField(default=0)
    embedding_json = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)`,

    service: `import math, re
from typing import List, Dict, Any

INSUFFICIENT_INFORMATION_MESSAGE = "I couldn't find enough information in the uploaded documents to answer this question reliably."

def chunk_text(text: str, chunk_size: int = 480, chunk_overlap: int = 100) -> List[str]:
    # Sliding window chunking with semantic overlap
    clean = re.sub(r'\\s+', ' ', text).strip()
    chunks, start, step = [], 0, max(1, chunk_size - chunk_overlap)
    while start < len(clean):
        end = min(start + chunk_size, len(clean))
        chunks.append(clean[start:end])
        if end >= len(clean): break
        start += step
    return chunks

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    return dot / (norm_a * norm_b) if norm_a and norm_b else 0.0`,

    views: `from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Document, DocumentChunk
from .rag_service import INSUFFICIENT_INFORMATION_MESSAGE

class RAGQueryView(APIView):
    def post(self, request):
        question = request.data.get('question', '').strip()
        # Perform vector similarity lookup over DocumentChunk
        chunks = DocumentChunk.objects.select_related('document').all()
        # Compute cosine similarity, build evidence context, and enforce strict grounding
        ...
        return Response({'answer': answer, 'citations': citations, 'isGrounded': True})`,

    tests: `from django.test import TestCase
from .rag_service import chunk_text, cosine_similarity

class DocuMindTests(TestCase):
    def test_chunking_overlap(self):
        chunks = chunk_text("DocuMind RAG test " * 20, chunk_size=100, chunk_overlap=25)
        self.assertGreaterEqual(len(chunks), 2)

    def test_cosine_similarity(self):
        self.assertAlmostEqual(cosine_similarity([1, 0], [1, 0]), 1.0)
        self.assertAlmostEqual(cosine_similarity([1, 0], [0, 1]), 0.0)`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0A0A0D] border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#101116]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/15 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Enterprise Django Backend Architecture
              </h3>
              <p className="text-xs text-[#7C8090] font-mono">
                Production-ready Python / DRF reference located in <span className="text-[#00D9FF]">/backend_django/</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#7C8090] hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-[#050505] text-xs font-mono">
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'models'
                ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40'
                : 'text-[#7C8090] hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            models.py
          </button>

          <button
            onClick={() => setActiveTab('service')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'service'
                ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40'
                : 'text-[#7C8090] hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            rag_service.py
          </button>

          <button
            onClick={() => setActiveTab('views')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'views'
                ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40'
                : 'text-[#7C8090] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            views.py
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'tests'
                ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/40'
                : 'text-[#7C8090] hover:text-white'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            tests.py
          </button>

          <div className="ml-auto">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#25D9A0]" /> : <Copy className="w-3.5 h-3.5 text-[#7C8090]" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="p-5 overflow-auto flex-1 bg-[#050505]">
          <pre className="text-xs font-mono text-[#F7F7FA] leading-relaxed p-4 rounded-xl bg-[#0A0A0D] border border-white/10 overflow-x-auto">
            <code>{codeSnippets[activeTab]}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 bg-[#101116] flex items-center justify-between text-xs text-[#B9BBC8]">
          <span>Full files preserved under <code className="text-[#00D9FF]">/backend_django</code></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
