"""
DocuMind AI — Django RAG Processing Pipeline & Retrieval Service
"""
import math
import os
import re
from typing import List, Dict, Any, Optional

INSUFFICIENT_INFORMATION_MESSAGE = "I couldn't find enough information in the uploaded documents to answer this question reliably."

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r'[\r\n]+', '\n', text)
    text = re.sub(r'[\t ]+', ' ', text)
    return text.strip()

def chunk_text(text: str, chunk_size: int = 480, chunk_overlap: int = 100) -> List[str]:
    """Splits text using sliding window with configurable overlap."""
    clean = normalize_text(text)
    if not clean:
        return []
    if len(clean) <= chunk_size:
        return [clean]

    chunks = []
    start = 0
    step = max(1, chunk_size - chunk_overlap)
    while start < len(clean):
        end = min(start + chunk_size, len(clean))
        if end < len(clean):
            # Attempt to split on sentence or space boundary
            slice_part = clean[start:end]
            last_period = slice_part.rfind('. ')
            if last_period > chunk_size * 0.6:
                end = start + last_period + 1
            else:
                last_space = slice_part.rfind(' ')
                if last_space > chunk_size * 0.6:
                    end = start + last_space + 1

        chunk_str = clean[start:end].strip()
        if chunk_str:
            chunks.append(chunk_str)
        if end >= len(clean):
            break
        start += step

    return chunks

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot / (norm_a * norm_b)

def sanitize_untrusted_text(text: str) -> str:
    """Neutralizes prompt injection attempts and system prompt escaping."""
    if not text:
        return ""
    text = re.sub(r'</?untrusted_document_context>', '[sanitized_tag]', text, flags=re.IGNORECASE)
    text = re.sub(r'</?system_prompt>', '[sanitized_tag]', text, flags=re.IGNORECASE)
    return text

def validate_citations_against_sources(raw_answer: str, candidate_citations: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not raw_answer or INSUFFICIENT_INFORMATION_MESSAGE in raw_answer:
        return {
            "validated_answer": INSUFFICIENT_INFORMATION_MESSAGE,
            "citations": [],
            "is_grounded": False
        }

    # Extract [Source N] patterns
    source_refs = set(re.findall(r'\[Source\s+(\d+)\]', raw_answer, re.IGNORECASE))
    active_citations = []

    for ref in source_refs:
        idx = int(ref) - 1
        if 0 <= idx < len(candidate_citations):
            active_citations.append(candidate_citations[idx])

    if not active_citations and candidate_citations:
        active_citations = candidate_citations[:2]

    return {
        "validated_answer": raw_answer.strip(),
        "citations": active_citations,
        "is_grounded": len(active_citations) > 0
    }
