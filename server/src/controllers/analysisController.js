import { Document } from '../models/Document.js';
import { Analysis } from '../models/Analysis.js';
import { Obligation } from '../models/Obligation.js';
import { analyzeLegalDocument } from '../services/geminiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Trigger AI Legal Analysis for a document
// @route   POST /api/analysis/:documentId
// @access  Private
export const runAnalysis = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findOne({
      _id: documentId,
      owner: req.user.id,
    });

    if (!document) {
      return errorResponse(res, 'Document not found or unauthorized', 404);
    }

    if (!document.extractedText || document.extractedText.length < 50) {
      return errorResponse(
        res,
        'Cannot analyze document: extracted text is too sparse or empty. Try reprocessing with OCR.',
        400
      );
    }

    document.analysisStatus = 'processing';
    await document.save();

    // Call Gemini with user custom key (if available) or server env key
    const aiData = await analyzeLegalDocument(
      document.extractedText,
      req.user.geminiApiKey
    );

    // Save or update Analysis model
    let analysis = await Analysis.findOne({ documentId: document._id });
    if (!analysis) {
      analysis = new Analysis({
        documentId: document._id,
        owner: req.user.id,
      });
    }

    analysis.documentType = aiData.documentType || 'General Contract';
    analysis.summary = aiData.summary || {};
    analysis.keyClauses = aiData.keyClauses || [];
    analysis.risks = aiData.risks || [];
    analysis.categorizedClauses = aiData.categorizedClauses || [];
    analysis.explanationEn = aiData.explanationEn || '';
    analysis.explanationHi = aiData.explanationHi || '';
    analysis.legalTermsGlossary = aiData.legalTermsGlossary || [];
    analysis.status = 'completed';
    analysis.modelUsed = 'gemini-1.5-flash';

    await analysis.save();

    // Populate or refresh obligations in Obligation model
    if (aiData.obligations && Array.isArray(aiData.obligations)) {
      // Remove previously extracted obligations for this document to avoid duplication
      await Obligation.deleteMany({ documentId: document._id });

      const obligationsToInsert = aiData.obligations.map((ob) => {
        // Attempt to parse dueDate if it looks like a recognizable date
        let parsedDate = null;
        if (ob.dueDateRaw) {
          const timestamp = Date.parse(ob.dueDateRaw);
          if (!isNaN(timestamp)) {
            parsedDate = new Date(timestamp);
          }
        }

        return {
          documentId: document._id,
          owner: req.user.id,
          title: ob.title || 'Contractual Commitment',
          description: ob.description || ob.title,
          responsibleParty: ob.responsibleParty || 'Party',
          dueDate: parsedDate,
          dueDateRaw: ob.dueDateRaw || 'Specified in clause',
          sourceClause: ob.sourceClause || '',
          sectionOrPage: ob.sectionOrPage || '',
          priority: ['High', 'Medium', 'Low'].includes(ob.priority) ? ob.priority : 'Medium',
          status: 'Pending',
        };
      });

      if (obligationsToInsert.length > 0) {
        await Obligation.insertMany(obligationsToInsert);
      }
    }

    // Update document record
    document.analysisStatus = 'completed';
    document.documentType = analysis.documentType;
    await document.save();

    return successResponse(res, analysis, 'AI Legal Analysis completed successfully');
  } catch (error) {
    console.error('[Run Analysis Error]:', error);
    try {
      await Document.updateOne(
        { _id: req.params.documentId },
        { analysisStatus: 'failed' }
      );
    } catch (e) {}

    return errorResponse(res, `Legal analysis failed: ${error.message}`, 500);
  }
};

// @desc    Get saved analysis for a document
// @route   GET /api/analysis/:documentId
// @access  Private
export const getAnalysis = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    const analysis = await Analysis.findOne({
      documentId,
      owner: req.user.id,
    });

    if (!analysis) {
      return successResponse(res, null, 'No analysis found for this document');
    }

    return successResponse(res, analysis);
  } catch (error) {
    next(error);
  }
};

// @desc    Get filtered risk findings
// @route   GET /api/analysis/:documentId/risks
// @access  Private
export const getRisks = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { type, severity } = req.query;

    const analysis = await Analysis.findOne({
      documentId,
      owner: req.user.id,
    });

    if (!analysis) {
      return errorResponse(res, 'Analysis not found', 404);
    }

    let risks = analysis.risks || [];

    if (type && type !== 'all') {
      risks = risks.filter((r) => r.type === type);
    }

    if (severity && severity !== 'all') {
      risks = risks.filter((r) => r.severity.toLowerCase() === severity.toLowerCase());
    }

    return successResponse(res, {
      total: risks.length,
      risks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categorized clauses with filter
// @route   GET /api/analysis/:documentId/clauses
// @access  Private
export const getClauses = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { category, search } = req.query;

    const analysis = await Analysis.findOne({
      documentId,
      owner: req.user.id,
    });

    if (!analysis) {
      return errorResponse(res, 'Analysis not found', 404);
    }

    let clauses = analysis.categorizedClauses || [];

    if (category && category !== 'all') {
      clauses = clauses.filter((c) => c.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      clauses = clauses.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.clauseText?.toLowerCase().includes(q) ||
          c.explanation?.toLowerCase().includes(q)
      );
    }

    return successResponse(res, {
      total: clauses.length,
      clauses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bilingual explanation and legal glossary
// @route   GET /api/analysis/:documentId/explain
// @access  Private
export const getExplanation = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { lang = 'en' } = req.query;

    const analysis = await Analysis.findOne({
      documentId,
      owner: req.user.id,
    });

    if (!analysis) {
      return errorResponse(res, 'Analysis not found', 404);
    }

    const explanation = lang === 'hi' ? analysis.explanationHi : analysis.explanationEn;

    return successResponse(res, {
      language: lang,
      explanation,
      legalTermsGlossary: analysis.legalTermsGlossary || [],
      disclaimer:
        'This explanation is generated by AI for informational purposes and does not substitute for qualified legal counsel.',
    });
  } catch (error) {
    next(error);
  }
};
