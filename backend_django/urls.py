"""
DocuMind AI — Django URL Routing
"""
from django.urls import path
from .views import DocumentListView, DocumentDetailView, RAGQueryView

urlpatterns = [
    path('api/documents/', DocumentListView.as_view(), name='document-list'),
    path('api/documents/<uuid:pk>/', DocumentDetailView.as_view(), name='document-detail'),
    path('api/upload/', DocumentListView.as_view(), name='document-upload'),
    path('api/chat/', RAGQueryView.as_view(), name='rag-query'),
]
