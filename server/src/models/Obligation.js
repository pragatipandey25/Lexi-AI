import mongoose from 'mongoose';

const obligationSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    responsibleParty: {
      type: String,
      default: 'Unspecified Party',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    dueDateRaw: {
      type: String,
      default: 'Conditional upon milestone',
    },
    sourceClause: {
      type: String,
      default: '',
    },
    sectionOrPage: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Overdue'],
      default: 'Pending',
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

obligationSchema.index({ owner: 1, status: 1, dueDate: 1 });

export const Obligation = mongoose.model('Obligation', obligationSchema);
