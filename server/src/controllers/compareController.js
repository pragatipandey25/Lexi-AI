import { Document } from '../models/Document.js';
import { compareLegalDocuments } from '../services/geminiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Compare two documents owned by the user
// @route   POST /api/compare
// @access  Private
export const compareDocuments = async (req, res, next) => {
  try {
    const { doc1Id, doc2Id } = req.body;

    if (!doc1Id || !doc2Id) {
      return errorResponse(res, 'Please provide both doc1Id and doc2Id to compare', 400);
    }

    if (doc1Id === doc2Id) {
      return errorResponse(res, 'Please select two distinct documents for comparison', 400);
    }

    // Verify ownership of both documents
    const [doc1, doc2] = await Promise.all([
      Document.findOne({ _id: doc1Id, owner: req.user.id }),
      Document.findOne({ _id: doc2Id, owner: req.user.id }),
    ]);

    if (!doc1 || !doc2) {
      return errorResponse(res, 'One or both documents could not be found or access is denied', 404);
    }

    if (!doc1.extractedText || !doc2.extractedText) {
      return errorResponse(res, 'Both documents must have extracted text before comparing', 400);
    }

    const comparisonResult = await compareLegalDocuments(
      doc1.extractedText,
      doc2.extractedText,
      doc1.originalName,
      doc2.originalName,
      req.user.geminiApiKey
    );

    return successResponse(res, {
      doc1: { id: doc1._id, name: doc1.originalName },
      doc2: { id: doc2._id, name: doc2.originalName },
      comparison: comparisonResult,
    });
  } catch (error) {
    next(error);
  }
};
