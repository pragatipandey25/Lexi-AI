import PDFDocument from 'pdfkit';

/**
 * Generates an executive AI Legal Audit PDF report using PDFKit
 */
export const generatePdfAuditReport = (document, analysis, obligations = []) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 45,
        size: 'A4',
        info: {
          Title: `LexiAI Audit - ${document.originalName}`,
          Author: 'LexiAI Legal Document Assistant',
          Subject: 'AI-Generated Legal Risk Audit Report',
        },
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Colors
      const brandDark = '#0f172a';
      const brandBlue = '#2563eb';
      const riskRed = '#dc2626';
      const riskAmber = '#d97706';
      const riskGreen = '#16a34a';
      const textGray = '#475569';

      // --- Header Banner ---
      doc.rect(45, 45, 505, 55).fill('#0f172a');
      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold')
        .text('LexiAI — Legal Intelligence Audit Report', 60, 58);
      doc.fillColor('#94a3b8').fontSize(9).font('Helvetica')
        .text('AI-Assisted Contract Comprehension & Risk Diagnostic', 60, 78);

      doc.moveDown(3.5);

      // --- Metadata Grid ---
      const metaTop = 115;
      doc.rect(45, metaTop, 505, 60).fillAndStroke('#f8fafc', '#e2e8f0');

      doc.fillColor(brandDark).fontSize(9).font('Helvetica-Bold')
        .text('Document Name:', 55, metaTop + 10)
        .font('Helvetica').text(document.originalName, 155, metaTop + 10);

      doc.font('Helvetica-Bold').text('Document Type:', 55, metaTop + 24)
        .font('Helvetica').text(analysis.documentType || 'General Contract', 155, metaTop + 24);

      doc.font('Helvetica-Bold').text('Audit Timestamp:', 55, metaTop + 38)
        .font('Helvetica').text(new Date().toUTCString(), 155, metaTop + 38);

      doc.font('Helvetica-Bold').text('Pages & Size:', 330, metaTop + 10)
        .font('Helvetica').text(`${document.pageCount} pages • ${(document.fileSize / (1024*1024)).toFixed(2)} MB`, 415, metaTop + 10);

      doc.font('Helvetica-Bold').text('Extraction Method:', 330, metaTop + 24)
        .font('Helvetica').text(document.extractionMethod?.toUpperCase() || 'DIGITAL PDF', 415, metaTop + 24);

      doc.font('Helvetica-Bold').text('AI Engine:', 330, metaTop + 38)
        .font('Helvetica').text('Gemini 1.5/2.0 Flash', 415, metaTop + 38);

      doc.y = metaTop + 80;

      // --- 1. Executive Summary ---
      doc.fillColor(brandBlue).fontSize(12).font('Helvetica-Bold')
        .text('1. EXECUTIVE SUMMARY & COMMERCIAL OVERVIEW');
      doc.strokeColor(brandBlue).lineWidth(1).moveTo(45, doc.y + 3).lineTo(550, doc.y + 3).stroke();
      doc.moveDown(0.8);

      const overview = analysis.summary?.overview || 'No executive summary available.';
      doc.fillColor(brandDark).fontSize(9.5).font('Helvetica').lineGap(3)
        .text(overview, { align: 'justify' });
      doc.moveDown(0.8);

      // Financial and Term
      if (analysis.summary?.financialTerms) {
        doc.font('Helvetica-Bold').text('Financial & Commercial Terms: ')
          .font('Helvetica').text(analysis.summary.financialTerms);
        doc.moveDown(0.4);
      }
      if (analysis.summary?.durationAndTerm) {
        doc.font('Helvetica-Bold').text('Duration & Effective Period: ')
          .font('Helvetica').text(analysis.summary.durationAndTerm);
        doc.moveDown(0.8);
      }

      // --- 2. Risk & Suspicious Scanner Findings ---
      doc.moveDown(1);
      doc.fillColor(riskRed).fontSize(12).font('Helvetica-Bold')
        .text('2. RISK & SUSPICIOUS ANOMALY SCANNER FINDINGS');
      doc.strokeColor(riskRed).lineWidth(1).moveTo(45, doc.y + 3).lineTo(550, doc.y + 3).stroke();
      doc.moveDown(0.8);

      const risks = analysis.risks || [];
      if (risks.length === 0) {
        doc.fillColor(riskGreen).fontSize(9).font('Helvetica')
          .text('No high or medium severity risks were flagged by the diagnostic scanner.');
      } else {
        risks.forEach((r, idx) => {
          if (doc.y > 680) doc.addPage();

          const sevColor = r.severity === 'High' ? riskRed : r.severity === 'Medium' ? riskAmber : riskGreen;

          doc.fillColor(sevColor).fontSize(9.5).font('Helvetica-Bold')
            .text(`[${r.severity.toUpperCase()} RISK] ${idx + 1}. ${r.title}`);

          if (r.clauseText) {
            doc.fillColor('#64748b').fontSize(8.5).font('Helvetica-Oblique')
              .text(`Evidence: "${r.clauseText}"`, { indent: 10 });
          }

          doc.fillColor(brandDark).fontSize(8.5).font('Helvetica')
            .text(`Why It Matters: ${r.whyItMatters || 'Requires review.'}`, { indent: 10 })
            .text(`Recommended Action: ${r.recommendedAction || 'Consult qualified legal counsel.'}`, { indent: 10 });

          doc.moveDown(0.6);
        });
      }

      // --- 3. Key Clauses & Plain Language Translations ---
      doc.addPage();
      doc.fillColor(brandBlue).fontSize(12).font('Helvetica-Bold')
        .text('3. KEY CONTRACT CLAUSES & PLAIN-LANGUAGE EXPLANATION');
      doc.strokeColor(brandBlue).lineWidth(1).moveTo(45, doc.y + 3).lineTo(550, doc.y + 3).stroke();
      doc.moveDown(0.8);

      const keyClauses = analysis.keyClauses || [];
      keyClauses.slice(0, 8).forEach((clause, idx) => {
        if (doc.y > 700) doc.addPage();

        doc.fillColor(brandDark).fontSize(9.5).font('Helvetica-Bold')
          .text(`${idx + 1}. ${clause.title || 'Contract Provision'} (${clause.sectionOrPage || 'Section'})`);

        doc.fillColor('#334155').fontSize(8.5).font('Helvetica-Bold')
          .text('Plain Translation: ', { continued: true })
          .font('Helvetica').text(clause.plainExplanation || 'See original clause.');

        if (clause.originalText) {
          doc.fillColor('#64748b').fontSize(8).font('Helvetica-Oblique')
            .text(`Original Excerpt: "${clause.originalText}"`, { indent: 10 });
        }
        doc.moveDown(0.6);
      });

      // --- 4. Obligations & Deadlines ---
      if (obligations.length > 0) {
        if (doc.y > 600) doc.addPage();
        doc.moveDown(1);
        doc.fillColor(brandDark).fontSize(12).font('Helvetica-Bold')
          .text('4. EXTRACTED OBLIGATIONS & DEADLINE MILESTONES');
        doc.strokeColor(brandDark).lineWidth(1).moveTo(45, doc.y + 3).lineTo(550, doc.y + 3).stroke();
        doc.moveDown(0.8);

        obligations.slice(0, 10).forEach((ob, idx) => {
          if (doc.y > 700) doc.addPage();
          doc.fontSize(9).font('Helvetica-Bold').fillColor(brandDark)
            .text(`• ${ob.title} (${ob.responsibleParty || 'Party'})`);
          doc.fontSize(8.5).font('Helvetica').fillColor('#475569')
            .text(`Deadline: ${ob.dueDateRaw || 'Conditional'} | Status: ${ob.status} | Priority: ${ob.priority}`, { indent: 12 });
          doc.moveDown(0.4);
        });
      }

      // --- Mandatory Legal Disclaimer Footer ---
      if (doc.y > 680) doc.addPage();
      doc.moveDown(1.5);
      doc.rect(45, doc.y, 505, 55).fill('#f1f5f9');
      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica')
        .text(
          'IMPORTANT DISCLAIMER: This audit report is produced by LexiAI using automated artificial intelligence. It is provided for informational and educational purposes only and does NOT constitute formal legal advice, representation, or an attorney-client relationship. You must have all documents and findings reviewed by a licensed attorney before signing or executing binding legal agreements.',
          55,
          doc.y + 8,
          { width: 485, align: 'justify' }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
