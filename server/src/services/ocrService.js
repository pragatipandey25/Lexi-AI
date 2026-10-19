import { createWorker } from 'tesseract.js';

/**
 * Service to execute OCR via Tesseract.js
 */
export const extractTextWithOCR = async (imageBufferOrPath) => {
  let worker = null;
  try {
    worker = await createWorker('eng');
    const ret = await worker.recognize(imageBufferOrPath);
    await worker.terminate();
    return ret.data.text.trim();
  } catch (err) {
    if (worker) {
      try {
        await worker.terminate();
      } catch (termErr) {
        // ignore termination errors
      }
    }
    console.warn('[OCR Service] Error during OCR processing:', err.message);
    throw err;
  }
};
