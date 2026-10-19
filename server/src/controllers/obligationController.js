import { Obligation } from '../models/Obligation.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get obligations for authenticated user
// @route   GET /api/obligations
// @access  Private
export const getObligations = async (req, res, next) => {
  try {
    const { status, priority, documentId, sortBy = 'dueDate', order = 'asc' } = req.query;

    const query = { owner: req.user.id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (documentId) {
      query.documentId = documentId;
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const obligations = await Obligation.find(query)
      .populate('documentId', 'originalName')
      .sort(sortOptions);

    return successResponse(res, {
      total: obligations.length,
      obligations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update obligation status (e.g. mark Completed or Pending)
// @route   PUT /api/obligations/:id/status
// @access  Private
export const updateObligationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !['Pending', 'Completed', 'Overdue'].includes(status)) {
      return errorResponse(res, 'Valid status must be Pending, Completed, or Overdue', 400);
    }

    const obligation = await Obligation.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!obligation) {
      return errorResponse(res, 'Obligation not found or access denied', 404);
    }

    obligation.status = status;
    obligation.completedAt = status === 'Completed' ? new Date() : null;
    await obligation.save();

    return successResponse(res, obligation, `Status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

// @desc    Create manual obligation
// @route   POST /api/obligations
// @access  Private
export const createObligation = async (req, res, next) => {
  try {
    const { documentId, title, description, responsibleParty, dueDate, priority } = req.body;

    if (!documentId || !title) {
      return errorResponse(res, 'Please provide documentId and title', 400);
    }

    const obligation = await Obligation.create({
      documentId,
      owner: req.user.id,
      title: title.trim(),
      description: description || title,
      responsibleParty: responsibleParty || 'Party',
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || 'Medium',
      status: 'Pending',
    });

    return successResponse(res, obligation, 'Obligation created', 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete obligation
// @route   DELETE /api/obligations/:id
// @access  Private
export const deleteObligation = async (req, res, next) => {
  try {
    const obligation = await Obligation.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!obligation) {
      return errorResponse(res, 'Obligation not found or access denied', 404);
    }

    return successResponse(res, null, 'Obligation removed');
  } catch (error) {
    next(error);
  }
};
