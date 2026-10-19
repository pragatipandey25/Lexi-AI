import { Document } from '../models/Document.js';
import { Analysis } from '../models/Analysis.js';
import { Obligation } from '../models/Obligation.js';
import { successResponse } from '../utils/apiResponse.js';

// @desc    Get authenticated user dashboard statistics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Parallel queries to aggregate actual database statistics
    const [
      totalDocuments,
      analyzedDocuments,
      analyses,
      pendingObligations,
      completedObligations,
      upcomingDeadlines,
      recentDocuments,
    ] = await Promise.all([
      Document.countDocuments({ owner: userId }),
      Document.countDocuments({ owner: userId, analysisStatus: 'completed' }),
      Analysis.find({ owner: userId }).select('risks categorizedClauses'),
      Obligation.countDocuments({ owner: userId, status: 'Pending' }),
      Obligation.countDocuments({ owner: userId, status: 'Completed' }),
      Obligation.find({ owner: userId, status: 'Pending' })
        .populate('documentId', 'originalName')
        .sort({ dueDate: 1, createdAt: -1 })
        .limit(5),
      Document.find({ owner: userId })
        .select('-extractedText')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Aggregate risks by severity & type
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;
    let suspiciousCount = 0;
    const clauseCategoryCounts = {};

    analyses.forEach((an) => {
      if (an.risks && Array.isArray(an.risks)) {
        an.risks.forEach((r) => {
          if (r.type === 'suspicious') suspiciousCount++;
          if (r.severity === 'High') highRiskCount++;
          else if (r.severity === 'Medium') mediumRiskCount++;
          else if (r.severity === 'Low') lowRiskCount++;
        });
      }

      if (an.categorizedClauses && Array.isArray(an.categorizedClauses)) {
        an.categorizedClauses.forEach((c) => {
          const cat = c.category || 'Miscellaneous';
          clauseCategoryCounts[cat] = (clauseCategoryCounts[cat] || 0) + 1;
        });
      }
    });

    const categoryBreakdown = Object.keys(clauseCategoryCounts).map((cat) => ({
      name: cat,
      count: clauseCategoryCounts[cat],
    }));

    return successResponse(res, {
      totalDocuments,
      analyzedDocuments,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      suspiciousCount,
      pendingObligations,
      completedObligations,
      upcomingDeadlines,
      recentDocuments,
      riskDistribution: [
        { name: 'High Risk', count: highRiskCount, color: '#ef4444' },
        { name: 'Medium Risk', count: mediumRiskCount, color: '#f59e0b' },
        { name: 'Low Risk', count: lowRiskCount, color: '#10b981' },
        { name: 'Suspicious Anomaly', count: suspiciousCount, color: '#8b5cf6' },
      ],
      categoryBreakdown,
    });
  } catch (error) {
    next(error);
  }
};
