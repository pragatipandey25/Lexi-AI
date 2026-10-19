import { Document } from '../models/Document.js';
import { Analysis } from '../models/Analysis.js';
import { Obligation } from '../models/Obligation.js';
import { generatePdfAuditReport } from '../services/reportService.js';
import { errorResponse } from '../utils/apiResponse.js';

// @desc    Generate and download AI Legal Analysis PDF report
// @route   GET /api/reports/:documentId
// @access  Private
export const downloadReport = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const [document, analysis, obligations] = await Promise.all([
      Document.findOne({ _id: documentId, owner: req.user.id }),
      Analysis.findOne({ documentId, owner: req.user.id }),
      Obligation.find({ documentId, owner: req.user.id }),
    ]);

    if (!document) {
      return errorResponse(res, 'Document not found or access denied', 404);
    }

    if (!analysis || analysis.status !== 'completed') {
      return errorResponse(
        res,
        'Cannot generate audit report: AI legal analysis has not been completed for this document yet.',
        400
      );
    }

    const pdfBuffer = await generatePdfAuditReport(document, analysis, obligations);

    const safeFilename = `LexiAI_Audit_${document.originalName.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
