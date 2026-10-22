# DocuMind AI — Django Backend Service Reference

This module provides the production-grade Django & Django REST Framework (DRF) backend implementation for enterprise deployment of DocuMind AI.

## Architecture Highlights
- **Multi-tenant Document Model**: Documents and Chunks partitioned with foreign-key isolation and cascade deletion.
- **RAG Pipeline**: Adaptive sliding-window chunking (480 characters with 100-character overlap) with page boundary retention.
- **Persistent Vector Search**: Integrated cosine similarity calculation with indexed embeddings.
- **Strict Grounding & Citation Validation**: Rejects prompt injection and enforces abstention when relevance thresholds are unmet.
- **Automated Tests**: Unit test suite verifying chunking, vector similarity, and citation grounding.

## Requirements (`requirements.txt`)
```text
Django>=5.0.0
djangorestframework>=3.15.0
pypdf>=4.0.0
google-genai>=2.4.0
numpy>=1.26.0
django-cors-headers>=4.3.0
```

## Setup & Running with Django
1. Add `'backend_django'` to your Django `INSTALLED_APPS` in `settings.py`.
2. Include the URLs in your root `urls.py`:
   ```python
   path('', include('backend_django.urls')),
   ```
3. Run migrations:
   ```bash
   python manage.py makemigrations backend_django
   python manage.py migrate
   ```
4. Run automated tests:
   ```bash
   python manage.py test backend_django
   ```
5. Run dev server:
   ```bash
   python manage.py runserver 8000
   ```
