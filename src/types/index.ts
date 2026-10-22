export type DocumentProcessingState = 
  | 'Selected'
  | 'Uploading'
  | 'Extracting text'
  | 'Chunking'
  | 'Generating embeddings'
  | 'Indexing'
  | 'Ready'
  | 'Failed';

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber?: number;
  chunkIndex: number;
  text: string;
  tokenCountEstimate: number;
  embedding?: number[];
}

export interface DocumentRecord {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'txt';
  uploadedAt: string;
  status: DocumentProcessingState;
  errorMessage?: string;
  chunkCount: number;
  totalTokens: number;
  chunks: DocumentChunk[];
  summarySnippet?: string;
}

export interface SourceCitation {
  id: string;
  documentId: string;
  documentName: string;
  pageNumber?: number;
  chunkIndex: number;
  snippet: string;
  similarityScore: number;
  matchedTerms?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: SourceCitation[];
  isGrounded?: boolean;
  retrievalCount?: number;
  similarityScore?: number;
}

export interface WorkspaceStats {
  totalDocuments: number;
  readyDocuments: number;
  totalChunks: number;
  totalTokens: number;
  vectorDbStatus: 'Active' | 'Indexing' | 'Offline';
}

export interface QueryRequest {
  question: string;
  documentIds?: string[];
  relevanceThreshold?: number;
  topK?: number;
}

export interface QueryResponse {
  answer: string;
  citations: SourceCitation[];
  isGrounded: boolean;
  retrievedChunksCount: number;
  bestSimilarity: number;
  processingTimeMs: number;
}
