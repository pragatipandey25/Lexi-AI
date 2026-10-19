import fs from 'fs';
import path from 'path';
import { Document } from '../models/Document.js';
import { processPdfDocument } from '../services/pdfService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Upload new PDF document and extract text
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res, next) => {
  if (!req.file) {
    return errorResponse(res, 'No PDF file was provided. Please upload a file.', 400);
  }

  const { originalname, filename, path: filePath, size, mimetype } = req.file;

  let docRecord = null;
  try {
    // 1. Create document entry with processing status
    docRecord = await Document.create({
      owner: req.user.id,
      originalName: originalname,
      storageFilename: filename,
      filePath,
      fileSize: size,
      mimeType: mimetype,
      processingStatus: 'processing',
    });

    // 2. Run PDF text extraction pipeline
    const extractionResult = await processPdfDocument(filePath);

    // 3. Update document with extracted content
    docRecord.extractedText = extractionResult.extractedText;
    docRecord.pageCount = extractionResult.pageCount;
    docRecord.extractionMethod = extractionResult.extractionMethod;
    docRecord.processingStatus = 'completed';
    await docRecord.save();

    return successResponse(
      res,
      docRecord,
      'Document uploaded and processed successfully',
      201
    );
  } catch (error) {
    console.error('[Document Upload Error]:', error);
    if (docRecord) {
      docRecord.processingStatus = 'failed';
      docRecord.processingError = error.message;
      await docRecord.save();
    }
    return errorResponse(res, `Document processing failed: ${error.message}`, 422);
  }
};

// @desc    Get all documents for the current user
// @route   GET /api/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
  try {
    const { search, status, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

    const query = { owner: req.user.id };

    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    if (status && status !== 'all') {
      query.processingStatus = status;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    // Do not return heavy extractedText in list view for performance
    const [documents, total] = await Promise.all([
      Document.find(query)
        .select('-extractedText')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Document.countDocuments(query),
    ]);

    return successResponse(res, {
      documents,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Private
export const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!document) {
      return errorResponse(res, 'Document not found or you are not authorized to view it', 404);
    }

    return successResponse(res, document);
  } catch (error) {
    next(error);
  }
};

// @desc    Rename document
// @route   PUT /api/documents/:id/rename
// @access  Private
export const renameDocument = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return errorResponse(res, 'Please provide a valid document name', 400);
    }

    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!document) {
      return errorResponse(res, 'Document not found or access denied', 404);
    }

    // Preserve .pdf extension if user omitted it
    let sanitizedName = name.trim();
    if (!sanitizedName.toLowerCase().endsWith('.pdf')) {
      sanitizedName += '.pdf';
    }

    document.originalName = sanitizedName;
    await document.save();

    return successResponse(res, document, 'Document renamed successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document and associated files
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!document) {
      return errorResponse(res, 'Document not found or access denied', 404);
    }

    // Delete file from disk if it exists
    if (document.filePath && fs.existsSync(document.filePath)) {
      try {
        fs.unlinkSync(document.filePath);
      } catch (fileErr) {
        console.warn(`Could not delete file from disk: ${document.filePath}`);
      }
    }

    // Delete document record
    await Document.deleteOne({ _id: document._id });

    // Optionally cascade delete other models if they exist
    try {
      const { Analysis } = await import('../models/Analysis.js');
      await Analysis.deleteMany({ documentId: document._id });
    } catch (e) {}

    try {
      const { ChatMessage } = await import('../models/ChatMessage.js');
      await ChatMessage.deleteMany({ documentId: document._id });
    } catch (e) {}

    try {
      const { Obligation } = await import('../models/Obligation.js');
      await Obligation.deleteMany({ documentId: document._id });
    } catch (e) {}

    return successResponse(res, null, 'Document and all associated data deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Reprocess document extraction/OCR
// @route   POST /api/documents/:id/reprocess
// @access  Private
export const reprocessDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!document) {
      return errorResponse(res, 'Document not found or access denied', 404);
    }

    document.processingStatus = 'processing';
    document.processingError = null;
    await document.save();

    const extractionResult = await processPdfDocument(document.filePath);

    document.extractedText = extractionResult.extractedText;
    document.pageCount = extractionResult.pageCount;
    document.extractionMethod = extractionResult.extractionMethod;
    document.processingStatus = 'completed';
    await document.save();

    return successResponse(res, document, 'Document reprocessed successfully');
  } catch (error) {
    if (document) {
      document.processingStatus = 'failed';
      document.processingError = error.message;
      await document.save();
    }
    return errorResponse(res, `Reprocessing failed: ${error.message}`, 422);
  }
};

// @desc    Download original uploaded PDF
// @route   GET /api/documents/:id/download
// @access  Private
export const downloadDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!document) {
      return errorResponse(res, 'Document not found or access denied', 404);
    }

    if (!fs.existsSync(document.filePath)) {
      return errorResponse(res, 'File not found on server storage', 404);
    }

    return res.download(document.filePath, document.originalName);
  } catch (error) {
    next(error);
  }
};
