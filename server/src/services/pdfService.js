import fs from 'fs';
import { extractText } from 'unpdf';
import { extractTextWithOCR } from './ocrService.js';

/**
 * Clean and normalize extracted PDF text
 */
export const cleanText = (rawText) => {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/**
 * Process a PDF document: modern digital extraction via unpdf, OCR fallback if scanned/sparse
 */
export const processPdfDocument = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('PDF file not found on server storage');
  }

  const dataBuffer = fs.readFileSync(filePath);

  // Check PDF header
  const header = dataBuffer.subarray(0, 5).toString();
  if (!header.startsWith('%PDF-')) {
    throw new Error('Invalid PDF format: File header does not match PDF specification');
  }

  let pageCount = 1;
  let rawText = '';
  let extractionMethod = 'digital_pdf';

  try {
    const uint8Array = new Uint8Array(dataBuffer);
    const parsed = await extractText(uint8Array, { mergePages: true });

    pageCount = parsed.totalPages || 1;
    rawText = parsed.text || '';
  } catch (err) {
    if (err.message && (err.message.includes('password') || err.message.includes('encrypted'))) {
      throw new Error('This PDF is password-protected or encrypted. Please remove encryption before uploading.');
    }
    console.warn('[PDF Parsing] Digital extraction error:', err.message);
  }

  let cleaned = cleanText(rawText);

  // If text is suspiciously short (< 80 characters for the entire document),
  // it is likely a scanned image inside a PDF.
  if (cleaned.length < 80) {
    console.log(`[PDF Extraction] Minimal text found (${cleaned.length} chars). Attempting OCR fallback...`);
    try {
      const ocrResult = await extractTextWithOCR(filePath);
      if (ocrResult && ocrResult.length > cleaned.length) {
        cleaned = cleanText(ocrResult);
        extractionMethod = 'ocr_fallback';
      }
    } catch (ocrErr) {
      console.warn('[PDF Extraction] OCR fallback did not yield additional text:', ocrErr.message);
      if (cleaned.length === 0) {
        cleaned = '[Notice: This PDF contains scanned image pages with no detectable digital text layers. Please ensure high scan contrast or upload a digital version for optimal AI analysis.]';
        extractionMethod = 'none';
      }
    }
  }

  return {
    extractedText: cleaned,
    pageCount,
    extractionMethod,
    characterCount: cleaned.length,
    wordCount: cleaned.split(/\s+/).filter(Boolean).length,
  };
};
