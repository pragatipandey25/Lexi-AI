import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    documentType: {
      type: String,
      default: 'General Contract',
    },
    summary: {
      overview: { type: String, default: '' },
      partyRoles: [
        {
          party: String,
          role: String,
          keyResponsibilities: [String],
        },
      ],
      financialTerms: { type: String, default: '' },
      durationAndTerm: { type: String, default: '' },
      criticalConditions: [String],
      unfavorableTerms: [String],
    },
    keyClauses: [
      {
        title: String,
        originalText: String,
        plainExplanation: String,
        sectionOrPage: String,
        importance: {
          type: String,
          enum: ['Crucial', 'Important', 'Standard'],
          default: 'Important',
        },
      },
    ],
    risks: [
      {
        title: { type: String, required: true },
        type: {
          type: String,
          enum: ['legal_risk', 'suspicious'],
          required: true,
          default: 'legal_risk',
        },
        severity: {
          type: String,
          enum: ['High', 'Medium', 'Low'],
          required: true,
          default: 'Medium',
        },
        clauseText: { type: String, default: '' },
        sectionOrPage: { type: String, default: '' },
        whyItMatters: { type: String, default: '' },
        recommendedAction: { type: String, default: '' },
      },
    ],
    categorizedClauses: [
      {
        category: {
          type: String,
          enum: [
            'Payment and Fees',
            'Termination',
            'Confidentiality',
            'Liability and Indemnity',
            'Dispute Resolution',
            'Renewal',
            'Obligations',
            'Intellectual Property',
            'Privacy and Data Protection',
            'Governing Law',
            'Miscellaneous',
          ],
          default: 'Miscellaneous',
        },
        title: String,
        clauseText: String,
        explanation: String,
        sectionOrPage: String,
      },
    ],
    explanationEn: {
      type: String,
      default: '',
    },
    explanationHi: {
      type: String,
      default: '',
    },
    legalTermsGlossary: [
      {
        term: String,
        plainMeaning: String,
        hindiMeaning: String,
      },
    ],
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
    modelUsed: {
      type: String,
      default: 'gemini-1.5-flash',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
analysisSchema.index({ documentId: 1, owner: 1 });

export const Analysis = mongoose.model('Analysis', analysisSchema);
