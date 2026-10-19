import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required'],
      trim: true,
    },
    storageFilename: {
      type: String,
      required: true,
      unique: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      default: 'application/pdf',
    },
    fileSize: {
      type: Number,
      required: true, // Size in bytes
    },
    pageCount: {
      type: Number,
      default: 1,
    },
    extractedText: {
      type: String,
      default: '',
    },
    extractionMethod: {
      type: String,
      enum: ['digital_pdf', 'ocr_fallback', 'hybrid', 'pending', 'none'],
      default: 'pending',
    },
    processingStatus: {
      type: String,
      enum: ['uploaded', 'processing', 'completed', 'failed'],
      default: 'uploaded',
      index: true,
    },
    processingError: {
      type: String,
      default: null,
    },
    analysisStatus: {
      type: String,
      enum: ['not_started', 'processing', 'completed', 'failed'],
      default: 'not_started',
      index: true,
    },
    documentType: {
      type: String,
      default: 'General Legal Document',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast user queries and searches
documentSchema.index({ owner: 1, createdAt: -1 });
documentSchema.index({ owner: 1, originalName: 'text' });

export const Document = mongoose.model('Document', documentSchema);
