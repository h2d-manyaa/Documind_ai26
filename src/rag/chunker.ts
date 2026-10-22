import { DocumentChunk } from '../types';

export interface ChunkOptions {
  documentId: string;
  documentName: string;
  chunkSize?: number; // Characters per chunk (default 500)
  chunkOverlap?: number; // Character overlap between chunks (default 100)
  pages?: { pageNumber: number; text: string }[];
}

/**
 * Normalizes document text by collapsing extraneous whitespace and stripping non-printable characters.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Splits raw document text or page arrays into overlapping chunks with metadata.
 */
export function chunkDocument(
  rawText: string,
  options: ChunkOptions
): DocumentChunk[] {
  const {
    documentId,
    documentName,
    chunkSize = 500,
    chunkOverlap = 100,
    pages
  } = options;

  const chunks: DocumentChunk[] = [];
  let chunkIndex = 0;

  // If pages are provided (from PDF parser), chunk page by page to preserve exact page references
  if (pages && pages.length > 0) {
    for (const page of pages) {
      const cleanPageText = normalizeText(page.text);
      if (!cleanPageText) continue;

      const pageChunks = createOverlappingChunks(cleanPageText, chunkSize, chunkOverlap);
      for (const textSegment of pageChunks) {
        if (textSegment.trim().length < 15) continue; // Skip trivial noise
        chunkIndex++;
        chunks.push({
          id: `${documentId}-p${page.pageNumber}-c${chunkIndex}`,
          documentId,
          documentName,
          pageNumber: page.pageNumber,
          chunkIndex,
          text: textSegment.trim(),
          tokenCountEstimate: Math.max(1, Math.ceil(textSegment.trim().length / 4))
        });
      }
    }
  } else {
    // Plain text or unpaged PDF
    const cleanText = normalizeText(rawText);
    if (!cleanText) return [];

    const rawChunks = createOverlappingChunks(cleanText, chunkSize, chunkOverlap);
    for (const textSegment of rawChunks) {
      if (textSegment.trim().length < 15) continue;
      chunkIndex++;
      chunks.push({
        id: `${documentId}-c${chunkIndex}`,
        documentId,
        documentName,
        chunkIndex,
        text: textSegment.trim(),
        tokenCountEstimate: Math.max(1, Math.ceil(textSegment.trim().length / 4))
      });
    }
  }

  return chunks;
}

/**
 * Helper to split a single body of text into sliding window overlapping strings.
 */
export function createOverlappingChunks(
  text: string,
  chunkSize: number,
  chunkOverlap: number
): string[] {
  if (!text || text.length === 0) return [];
  if (text.length <= chunkSize) return [text];

  const results: string[] = [];
  let start = 0;
  const step = Math.max(1, chunkSize - chunkOverlap);

  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);

    // Try to break at a sentence or word boundary if not at end
    if (end < text.length) {
      const slice = text.substring(start, end);
      const lastPeriod = slice.lastIndexOf('. ');
      const lastNewline = slice.lastIndexOf('\n');
      const boundary = Math.max(lastPeriod !== -1 ? lastPeriod + 1 : -1, lastNewline);

      if (boundary > chunkSize * 0.6) {
        end = start + boundary + 1;
      } else {
        const lastSpace = slice.lastIndexOf(' ');
        if (lastSpace > chunkSize * 0.6) {
          end = start + lastSpace + 1;
        }
      }
    }

    const chunk = text.substring(start, end).trim();
    if (chunk) {
      results.push(chunk);
    }

    if (end >= text.length) break;
    start += step;
  }

  return results;
}
