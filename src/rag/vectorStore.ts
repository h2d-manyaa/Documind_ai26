import { DocumentChunk, SourceCitation } from '../types';

/**
 * Computes cosine similarity between two numeric dense vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Tokenizes text into lowercase normalized terms, filtering common stopwords.
 */
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

export function extractKeywords(text: string): string[] {
  return (text.toLowerCase().match(/\b[a-z0-9_]{2,}\b/g) || []).filter(
    (w) => !STOPWORDS.has(w)
  );
}

/**
 * Fallback semantic sparse/dense vectorizer: converts text to normalized TF-IDF vector over dynamic vocab.
 */
export class SparseSemanticVectorizer {
  private vocab = new Map<string, number>();
  private docFrequencies = new Map<string, number>();
  private totalDocs = 0;

  public indexPassages(passages: string[]) {
    this.totalDocs = passages.length;
    for (const p of passages) {
      const terms = new Set(extractKeywords(p));
      for (const term of terms) {
        if (!this.vocab.has(term)) {
          this.vocab.set(term, this.vocab.size);
        }
        this.docFrequencies.set(term, (this.docFrequencies.get(term) || 0) + 1);
      }
    }
  }

  public vectorize(text: string): number[] {
    const vec = new Array(this.vocab.size).fill(0);
    const words = extractKeywords(text);
    if (words.length === 0 || this.vocab.size === 0) return vec;

    const tfMap = new Map<string, number>();
    for (const w of words) {
      tfMap.set(w, (tfMap.get(w) || 0) + 1);
    }

    let norm = 0;
    for (const [w, count] of tfMap.entries()) {
      const idx = this.vocab.get(w);
      if (idx !== undefined) {
        const df = this.docFrequencies.get(w) || 1;
        const idf = Math.log(1 + (this.totalDocs + 1) / (df + 1)) + 1;
        const tf = count / words.length;
        const weight = tf * idf;
        vec[idx] = weight;
        norm += weight * weight;
      }
    }

    // L2 normalize
    if (norm > 0) {
      const sqrtNorm = Math.sqrt(norm);
      for (let i = 0; i < vec.length; i++) {
        vec[i] /= sqrtNorm;
      }
    }

    return vec;
  }
}

export interface SearchOptions {
  topK?: number;
  threshold?: number;
  documentIds?: string[];
  queryVector?: number[];
}

export class VectorStore {
  private chunks: Map<string, DocumentChunk> = new Map();
  private vectorizer: SparseSemanticVectorizer = new SparseSemanticVectorizer();

  public addChunks(newChunks: DocumentChunk[]) {
    for (const chunk of newChunks) {
      this.chunks.set(chunk.id, chunk);
    }
    // Refresh fallback vectorizer index
    const allTexts = Array.from(this.chunks.values()).map(c => c.text);
    this.vectorizer.indexPassages(allTexts);
  }

  public removeDocument(documentId: string): number {
    let deletedCount = 0;
    for (const [id, chunk] of this.chunks.entries()) {
      if (chunk.documentId === documentId) {
        this.chunks.delete(id);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  public clear() {
    this.chunks.clear();
  }

  public getChunkCount(): number {
    return this.chunks.size;
  }

  public getAllChunks(): DocumentChunk[] {
    return Array.from(this.chunks.values());
  }

  /**
   * Performs semantic vector retrieval across stored chunks.
   */
  public search(query: string, options: SearchOptions = {}): SourceCitation[] {
    const {
      topK = 4,
      threshold = 0.15,
      documentIds,
      queryVector
    } = options;

    const queryTerms = extractKeywords(query);
    const queryFallbackVec = !queryVector || queryVector.length === 0
      ? this.vectorizer.vectorize(query)
      : null;

    const results: Array<{ chunk: DocumentChunk; score: number; matchedTerms: string[] }> = [];

    for (const chunk of this.chunks.values()) {
      if (documentIds && documentIds.length > 0 && !documentIds.includes(chunk.documentId)) {
        continue;
      }

      let score = 0;

      // Dense embedding cosine similarity if available
      if (queryVector && chunk.embedding && queryVector.length === chunk.embedding.length) {
        score = cosineSimilarity(queryVector, chunk.embedding);
      } else {
        // Fallback semantic vectorizer similarity + keyword overlap boost
        const chunkVec = this.vectorizer.vectorize(chunk.text);
        const vecSim = cosineSimilarity(queryFallbackVec || [], chunkVec);

        // Lexical token match ratio
        const chunkKeywords = new Set(extractKeywords(chunk.text));
        let matchCount = 0;
        const matchedTerms: string[] = [];
        for (const qt of queryTerms) {
          if (chunkKeywords.has(qt)) {
            matchCount++;
            matchedTerms.push(qt);
          }
        }
        const lexicalRatio = queryTerms.length > 0 ? matchCount / queryTerms.length : 0;
        score = (vecSim * 0.6) + (lexicalRatio * 0.4);
      }

      // Identify matched query keywords for highlighting in UI
      const chunkLower = chunk.text.toLowerCase();
      const matched = queryTerms.filter(term => chunkLower.includes(term));

      if (score >= threshold) {
        results.push({
          chunk,
          score,
          matchedTerms: matched
        });
      }
    }

    // Sort descending by similarity score
    results.sort((a, b) => b.score - a.score);

    const topMatches = results.slice(0, topK);

    return topMatches.map(({ chunk, score, matchedTerms }) => ({
      id: chunk.id,
      documentId: chunk.documentId,
      documentName: chunk.documentName,
      pageNumber: chunk.pageNumber,
      chunkIndex: chunk.chunkIndex,
      snippet: chunk.text,
      similarityScore: Number(score.toFixed(3)),
      matchedTerms
    }));
  }
}
