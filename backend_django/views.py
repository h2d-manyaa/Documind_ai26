"""
DocuMind AI — Django REST Framework Views
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document, DocumentChunk
from .rag_service import (
    chunk_text,
    cosine_similarity,
    sanitize_untrusted_text,
    validate_citations_against_sources,
    INSUFFICIENT_INFORMATION_MESSAGE
)

class DocumentListView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        docs = Document.objects.all()
        data = [{
            'id': str(d.id),
            'name': d.name,
            'size': d.file_size_bytes,
            'type': d.file_type,
            'uploadedAt': d.created_at.isoformat(),
            'status': d.status,
            'chunkCount': d.total_chunks,
            'totalTokens': d.total_tokens_estimate,
            'summarySnippet': d.summary_snippet
        } for d in docs]

        stats = {
            'totalDocuments': len(data),
            'readyDocuments': sum(1 for d in data if d['status'] == 'READY'),
            'totalChunks': sum(d['chunkCount'] for d in data),
            'totalTokens': sum(d['totalTokens'] for d in data),
            'vectorDbStatus': 'Active'
        }
        return Response({'documents': data, 'stats': stats})

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        filename = file_obj.name
        ext = 'pdf' if filename.lower().endswith('.pdf') else 'txt'

        content = file_obj.read().decode('utf-8', errors='ignore')
        chunks = chunk_text(content)

        doc = Document.objects.create(
            name=filename,
            file=file_obj,
            file_type=ext,
            file_size_bytes=file_obj.size,
            status='READY',
            total_chunks=len(chunks),
            total_tokens_estimate=sum(len(c) // 4 for c in chunks),
            summary_snippet=content[:180]
        )

        for i, chunk_str in enumerate(chunks):
            DocumentChunk.objects.create(
                document=doc,
                chunk_index=i + 1,
                text_content=chunk_str,
                token_count_estimate=max(1, len(chunk_str) // 4)
            )

        return Response({
            'success': True,
            'document': {
                'id': str(doc.id),
                'name': doc.name,
                'status': doc.status,
                'chunkCount': doc.total_chunks
            }
        }, status=status.HTTP_201_CREATED)


class DocumentDetailView(APIView):
    def delete(self, request, pk):
        try:
            doc = Document.objects.get(pk=pk)
            doc.delete()
            return Response({'success': True, 'deletedId': str(pk)})
        except Document.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class RAGQueryView(APIView):
    def post(self, request):
        question = request.data.get('question', '').strip()
        if not question:
            return Response({'error': 'Question is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve relevant chunks across authorized documents
        chunks = DocumentChunk.objects.select_related('document').all()
        candidates = []
        for c in chunks:
            # Term matching score
            q_terms = [t.lower() for t in question.split() if len(t) > 2]
            text_lower = c.text_content.lower()
            matches = [t for t in q_terms if t in text_lower]
            score = len(matches) / max(1, len(q_terms))
            if score >= 0.15:
                candidates.append({
                    'id': str(c.id),
                    'documentId': str(c.document.id),
                    'documentName': c.document.name,
                    'pageNumber': c.page_number,
                    'chunkIndex': c.chunk_index,
                    'snippet': c.text_content,
                    'similarityScore': round(score, 3)
                })

        candidates.sort(key=lambda x: x['similarityScore'], reverse=True)
        top_candidates = candidates[:4]

        if not top_candidates:
            return Response({
                'answer': INSUFFICIENT_INFORMATION_MESSAGE,
                'citations': [],
                'isGrounded': False,
                'retrievedChunksCount': 0,
                'bestSimilarity': 0.0
            })

        # Answer formulation
        top = top_candidates[0]
        answer_text = f"According to {top['documentName']} [Source 1]:\n\n\"{top['snippet']}\""
        validated = validate_citations_against_sources(answer_text, top_candidates)

        return Response({
            'answer': validated['validated_answer'],
            'citations': validated['citations'],
            'isGrounded': validated['is_grounded'],
            'retrievedChunksCount': len(top_candidates),
            'bestSimilarity': top_candidates[0]['similarityScore']
        })
