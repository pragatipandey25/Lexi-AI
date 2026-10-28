import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { Document } from '../models/Document.js';
import { Analysis } from '../models/Analysis.js';
import { Obligation } from '../models/Obligation.js';
import { processPdfDocument } from '../services/pdfService.js';
import { analyzeLegalDocument } from '../services/geminiService.js';
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

// @desc    One-click sample document ingestion for instant viva / demo testing
// @route   POST /api/documents/load-sample
// @access  Private
export const loadSampleDocument = async (req, res, next) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const isComparisonDraft = req.body?.type === 'comparison' || req.query?.type === 'comparison';
    const sampleDocTitle = isComparisonDraft
      ? 'Sample_Commercial_Lease_Revised.pdf'
      : 'Sample_Commercial_Lease_Agreement.pdf';

    const sampleFileName = `sample_${isComparisonDraft ? 'revised_lease' : 'commercial_lease'}_${Date.now()}.pdf`;
    const sampleFilePath = path.join(uploadsDir, sampleFileName);

    // Create realistic PDF on disk
    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(sampleFilePath);
      doc.pipe(stream);

      if (isComparisonDraft) {
        doc.fontSize(16).text('COMMERCIAL LEASE AGREEMENT (REVISED COUNTER-DRAFT)', { align: 'center', bold: true });
        doc.moveDown(1);
        doc.fontSize(10).text('This Revised Counter-Agreement is made on 10th November 2026 between Apex Commercial Properties Ltd ("Landlord") and Nexa Technologies Private Limited ("Tenant").');
        doc.moveDown(0.5);
        doc.text('1. PREMISES & TERM: Suite 402, Tower B, Cyber Heights (4,500 sq ft). Term extended to 48 months starting December 1, 2026.');
        doc.moveDown(0.5);
        doc.text('2. RENT & ESCALATION: Tenant agrees to pay a higher base rent of INR 2,50,000 per month, with a mandatory 10% annual escalation compounded annually.');
        doc.moveDown(0.5);
        doc.text('3. SECURITY DEPOSIT: Tenant pays an increased deposit of INR 12,00,000. Landlord reserves unilateral rights to deduct maintenance and inspection charges at discretion.');
        doc.moveDown(0.5);
        doc.text('4. TERMINATION & EXPANDED LOCK-IN: Mandatory 24-month strict lock-in period. Vacating early triggers accelerated liquidated damages for the full remaining term.');
        doc.moveDown(0.5);
        doc.text('5. UNILATERAL INDEMNITY: Tenant shall indemnify, defend, and hold harmless Landlord against all liabilities, claims, and structural losses without exception.');
        doc.moveDown(0.5);
        doc.text('6. DISPUTE RESOLUTION: Exclusive arbitration at New Delhi with expenses borne solely by the Tenant.');
      } else {
        doc.fontSize(16).text('COMMERCIAL LEASE & SERVICES AGREEMENT', { align: 'center', bold: true });
        doc.moveDown(1);
        doc.fontSize(10).text('This Agreement is made on 1st November 2026 between Apex Commercial Properties Ltd ("Landlord") and Nexa Technologies Private Limited ("Tenant").');
        doc.moveDown(0.5);
        doc.text('1. PREMISES & TERM: Suite 402, Tower B, Cyber Heights, comprising 4,500 sq ft. Term: 36 months starting December 1, 2026 to November 30, 2029.');
        doc.moveDown(0.5);
        doc.text('2. RENT: Tenant agrees to pay a monthly rent of INR 2,25,000 in advance by the 5th day of each calendar month. A late penalty of 18% per annum applies for delays.');
        doc.moveDown(0.5);
        doc.text('3. SECURITY DEPOSIT: Tenant pays an interest-free refundable deposit of INR 9,00,000 upon signing. The balance of INR 1,50,000 must be deposited by December 15, 2026.');
        doc.moveDown(0.5);
        doc.text('4. TERMINATION & LOCK-IN: Both parties agree to a lock-in period of 12 months. If Tenant vacates prior to 12 months, Tenant forfeits the entire security deposit. 60 days written notice required after lock-in.');
        doc.moveDown(0.5);
        doc.text('5. INDEMNITY & LIABILITY (HIGH RISK): Tenant shall indemnify, defend, and hold harmless Landlord, its directors, and agents against all liabilities, losses, and damages arising on the premises, including Landlords own sole or gross negligence.');
        doc.moveDown(0.5);
        doc.text('6. CONFIDENTIALITY & GOVERNING LAW: All commercial terms shall remain strictly confidential for 5 years. This Agreement is governed by the laws of India, jurisdiction at New Delhi.');
      }
      doc.end();

      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    const stats = fs.statSync(sampleFilePath);
    const extractionResult = await processPdfDocument(sampleFilePath);

    const docRecord = await Document.create({
      owner: req.user.id,
      originalName: sampleDocTitle,
      storageFilename: sampleFileName,
      filePath: sampleFilePath,
      fileSize: stats.size,
      mimeType: 'application/pdf',
      pageCount: extractionResult.pageCount || 1,
      extractedText: extractionResult.extractedText,
      extractionMethod: extractionResult.extractionMethod || 'digital_pdf',
      processingStatus: 'completed',
      analysisStatus: 'processing',
      documentType: isComparisonDraft ? 'Revised Commercial Lease' : 'Commercial Lease Agreement',
    });

    // Run AI analysis
    try {
      const aiData = await analyzeLegalDocument(docRecord.extractedText, req.user.geminiApiKey);

      const analysis = await Analysis.create({
        documentId: docRecord._id,
        owner: req.user.id,
        documentType: aiData.documentType || (isComparisonDraft ? 'Revised Commercial Lease' : 'Commercial Lease Agreement'),
        summary: aiData.summary || {},
        keyClauses: aiData.keyClauses || [],
        risks: aiData.risks || [],
        categorizedClauses: aiData.categorizedClauses || [],
        explanationEn: aiData.explanationEn || '',
        explanationHi: aiData.explanationHi || '',
        legalTermsGlossary: aiData.legalTermsGlossary || [],
        status: 'completed',
        modelUsed: aiData._modelUsed || 'gemini-3-flash-preview',
      });

      if (aiData.obligations && Array.isArray(aiData.obligations)) {
        const obs = aiData.obligations.map((ob) => ({
          documentId: docRecord._id,
          owner: req.user.id,
          title: ob.title || 'Contract Commitment',
          description: ob.description || ob.title,
          responsibleParty: ob.responsibleParty || 'Party',
          dueDateRaw: ob.dueDateRaw || 'Specified in clause',
          priority: ['High', 'Medium', 'Low'].includes(ob.priority) ? ob.priority : 'Medium',
          status: 'Pending',
        }));
        if (obs.length > 0) await Obligation.insertMany(obs);
      }

      docRecord.analysisStatus = 'completed';
      await docRecord.save();
    } catch (aiErr) {
      console.warn('[Sample Doc] AI auto-analysis warning:', aiErr.message);
      docRecord.analysisStatus = 'not_started';
      await docRecord.save();
    }

    return successResponse(res, docRecord, `${sampleDocTitle} loaded successfully`, 201);
  } catch (err) {
    next(err);
  }
};
