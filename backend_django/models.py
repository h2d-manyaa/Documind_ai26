"""
DocuMind AI — Django Backend Models
Enterprise Document Intelligence with RAG and Tenant Isolation
"""
import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Document(models.Model):
    STATUS_CHOICES = [
        ('SELECTED', 'Selected'),
        ('UPLOADING', 'Uploading'),
        ('EXTRACTING', 'Extracting text'),
        ('CHUNKING', 'Chunking'),
        ('INDEXING', 'Indexing vectors'),
        ('READY', 'Ready'),
        ('FAILED', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documind_documents', null=True, blank=True)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='documind_uploads/%Y/%m/%d/')
    file_type = models.CharField(max_length=10, choices=[('pdf', 'PDF'), ('txt', 'TXT')])
    file_size_bytes = models.BigIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SELECTED')
    error_message = models.TextField(blank=True, null=True)
    total_chunks = models.PositiveIntegerField(default=0)
    total_tokens_estimate = models.PositiveIntegerField(default=0)
    summary_snippet = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.name} ({self.status})"


class DocumentChunk(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    chunk_index = models.PositiveIntegerField()
    page_number = models.PositiveIntegerField(null=True, blank=True)
    text_content = models.TextField()
    token_count_estimate = models.PositiveIntegerField(default=0)
    embedding_json = models.JSONField(blank=True, null=True, help_text="Stored float vector for cosine retrieval")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['document', 'chunk_index']
        indexes = [
            models.Index(fields=['document', 'page_number']),
            models.Index(fields=['document', 'chunk_index']),
        ]

    def __str__(self):
        page_str = f", p.{self.page_number}" if self.page_number else ""
        return f"Chunk {self.chunk_index}{page_str} of {self.document.name}"
