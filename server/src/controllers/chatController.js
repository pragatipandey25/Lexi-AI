import { Document } from '../models/Document.js';
import { ChatMessage } from '../models/ChatMessage.js';
import { chatWithDocument } from '../services/geminiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Send a question grounded in the document
// @route   POST /api/chat/:documentId
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return errorResponse(res, 'Please provide a question or message', 400);
    }

    const document = await Document.findOne({
      _id: documentId,
      owner: req.user.id,
    });

    if (!document) {
      return errorResponse(res, 'Document not found or access denied', 404);
    }

    if (!document.extractedText) {
      return errorResponse(res, 'Cannot chat: Document text has not been extracted', 400);
    }

    // 1. Save user's question
    const userMsg = await ChatMessage.create({
      documentId: document._id,
      owner: req.user.id,
      role: 'user',
      content: message.trim(),
    });

    // 2. Fetch past conversation history
    const history = await ChatMessage.find({
      documentId: document._id,
      owner: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(6);

    const reversedHistory = history.reverse();

    // 3. Grounded answer from Gemini
    const aiAnswer = await chatWithDocument(
      document.extractedText,
      reversedHistory,
      message.trim(),
      req.user.geminiApiKey
    );

    // 4. Save assistant's answer
    const assistantMsg = await ChatMessage.create({
      documentId: document._id,
      owner: req.user.id,
      role: 'assistant',
      content: aiAnswer.answer || 'Unable to formulate an answer.',
      sources: aiAnswer.sources || [],
    });

    return successResponse(
      res,
      {
        userMessage: userMsg,
        assistantMessage: assistantMsg,
      },
      'Response generated',
      201
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat history for a document
// @route   GET /api/chat/:documentId
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    // Verify ownership
    const document = await Document.findOne({
      _id: documentId,
      owner: req.user.id,
    });

    if (!document) {
      return errorResponse(res, 'Document not found or access denied', 404);
    }

    const messages = await ChatMessage.find({
      documentId,
      owner: req.user.id,
    }).sort({ createdAt: 1 });

    return successResponse(res, { messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear chat history for a document
// @route   DELETE /api/chat/:documentId
// @access  Private
export const clearChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;

    await ChatMessage.deleteMany({
      documentId,
      owner: req.user.id,
    });

    return successResponse(res, null, 'Chat history cleared');
  } catch (error) {
    next(error);
  }
};
