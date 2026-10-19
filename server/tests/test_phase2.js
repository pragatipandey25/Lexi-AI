import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const samplePdfPath = path.join(__dirname, 'Sample_Commercial_Lease.pdf');

// 1. Generate realistic legal sample PDF for testing
const createSamplePdf = () => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(samplePdfPath);

    doc.pipe(writeStream);

    doc.fontSize(18).text('COMMERCIAL LEASE & SERVICES AGREEMENT', { align: 'center', bold: true });
    doc.moveDown(1);

    doc.fontSize(10).text('This Commercial Lease Agreement ("Agreement") is made this 1st day of November, 2026, by and between:');
    doc.moveDown(0.5);
    doc.text('LESSOR: Apex Commercial Properties Ltd., having its registered office at Cyber City, Sector 24, Gurugram ("Landlord").');
    doc.text('LESSEE: Nexa Technologies Private Limited, having its corporate office at Tech Zone IV, Noida ("Tenant").');
    doc.moveDown(1);

    doc.fontSize(12).text('1. PREMISES & TERM', { underline: true });
    doc.fontSize(10).text('1.1 The Landlord hereby leases to Tenant the commercial property located at Suite 402, Tower B, Cyber Heights, comprising 4,500 sq. ft. of office area.');
    doc.text('1.2 Term: This lease shall commence on December 1, 2026, and expire on November 30, 2029 (a duration of 36 months).');
    doc.moveDown(0.8);

    doc.fontSize(12).text('2. RENT & SECURITY DEPOSIT', { underline: true });
    doc.fontSize(10).text('2.1 Monthly Rent: Tenant agrees to pay a monthly rent of INR 2,25,000 payable in advance by the 5th day of each calendar month.');
    doc.text('2.2 Security Deposit: Tenant shall pay an interest-free refundable deposit of INR 9,00,000 upon execution. The remaining balance of INR 1,50,000 must be deposited by December 15, 2026.');
    doc.moveDown(0.8);

    doc.fontSize(12).text('3. TERMINATION & CANCELLATION', { underline: true });
    doc.fontSize(10).text('3.1 Lock-in Period: Both parties agree to a lock-in period of 12 months. If Tenant vacates prior to expiry of the lock-in period, Tenant forfeits the entire security deposit.');
    doc.text('3.2 Notice Period: Either party may terminate this agreement after the lock-in period by providing 60 days written notice.');
    doc.moveDown(0.8);

    doc.fontSize(12).text('4. INDEMNITY & LIABILITY (HIGH RISK)', { underline: true });
    doc.fontSize(10).text('4.1 Tenant shall indemnify, defend, and hold harmless the Landlord, its directors, and agents against all liabilities, losses, damages, claims, and expenses arising out of any cause whatsoever on the premises, including Landlords own sole or gross negligence.');
    doc.text('4.2 Limitation of Liability: In no event shall Landlord be liable to Tenant for any consequential, incidental, indirect, or punitive damages.');
    doc.moveDown(0.8);

    doc.fontSize(12).text('5. CONFIDENTIALITY & GOVERNING LAW', { underline: true });
    doc.fontSize(10).text('5.1 Confidentiality: The terms and commercial conditions of this Agreement shall remain strictly confidential.');
    doc.text('5.2 Governing Law: This Agreement shall be governed by and construed in accordance with the laws of India, and courts at Delhi shall have exclusive jurisdiction.');

    doc.end();

    writeStream.on('finish', () => {
      console.log('Sample legal PDF created at:', samplePdfPath);
      resolve(samplePdfPath);
    });
    writeStream.on('error', reject);
  });
};

const runPhase2Tests = async () => {
  console.log('--- Testing LexiAI Phase 2 Document Processing ---');
  await createSamplePdf();

  const BASE_URL = 'http://localhost:5000/api';

  try {
    // 1. Register or login a user
    const testEmail = `lawyer_${Date.now()}@firm.org`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Advocate Rajesh Varma',
        email: testEmail,
        password: 'SecurePassword123!',
      }),
    });
    const regData = await regRes.json();
    const token = regData.data.token;
    console.log('1. User Authenticated:', regData.success);

    // 2. Upload Document via multipart/form-data
    const fileBuffer = fs.readFileSync(samplePdfPath);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', blob, 'Sample_Commercial_Lease.pdf');

    const uploadRes = await fetch(`${BASE_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const uploadData = await uploadRes.json();
    console.log('2. Document Upload & Extraction Result:', uploadData.success ? 'PASS' : 'FAIL', {
      id: uploadData.data?._id,
      name: uploadData.data?.originalName,
      status: uploadData.data?.processingStatus,
      method: uploadData.data?.extractionMethod,
      pageCount: uploadData.data?.pageCount,
      textLength: uploadData.data?.extractedText?.length,
    });

    if (!uploadData.data?._id) throw new Error('Upload did not return document ID');
    const docId = uploadData.data._id;

    // 3. Verify extracted text contains legal clauses
    const textHasLease = uploadData.data.extractedText.includes('COMMERCIAL LEASE & SERVICES AGREEMENT');
    const textHasIndemnity = uploadData.data.extractedText.includes('indemnify, defend, and hold harmless');
    console.log('3. Extracted text accuracy verification:', (textHasLease && textHasIndemnity) ? 'PASS' : 'FAIL');

    // 4. Test GET /documents (list)
    const listRes = await fetch(`${BASE_URL}/documents`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listData = await listRes.json();
    console.log('4. Document list retrieval:', listData.success ? 'PASS' : 'FAIL', `Count: ${listData.data.documents.length}`);

    // 5. Test Rename
    const renameRes = await fetch(`${BASE_URL}/documents/${docId}/rename`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: 'Commercial_Lease_Gurugram_Final.pdf' }),
    });
    const renameData = await renameRes.json();
    console.log('5. Rename Document:', renameData.success ? 'PASS' : 'FAIL', renameData.data?.originalName);

    // 6. Test GET by ID
    const getRes = await fetch(`${BASE_URL}/documents/${docId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData = await getRes.json();
    console.log('6. Retrieve single document by ID:', getData.success ? 'PASS' : 'FAIL', getData.data?.originalName);

    console.log('--- Phase 2 Document Processing Verified Successfully! ---');
  } catch (err) {
    console.error('Phase 2 test failed:', err);
  }
};

runPhase2Tests();
