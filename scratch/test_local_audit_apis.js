const fs = require('fs');
const path = require('path');

async function testWebAudit() {
  console.log('\n--- TESTING WEB AUDIT ---');
  try {
    const res = await fetch('http://localhost:3000/api/audit-speed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'google.com' }),
    });
    
    console.log('Status Code:', res.status);
    const json = await res.json();
    console.log('Response JSON:', JSON.stringify(json, null, 2));
  } catch (e) {
    console.error('Error during web audit test:', e);
  }
}

async function testCvAudit() {
  console.log('\n--- TESTING CV AUDIT ---');
  try {
    const pdfPath = path.join(__dirname, '../.context/CV Resume Khoiruzzadittaqwa.pdf');
    if (!fs.existsSync(pdfPath)) {
      console.error('Error: CV Resume Khoiruzzadittaqwa.pdf does not exist in .context/');
      return;
    }
    
    const buffer = fs.readFileSync(pdfPath);
    const blob = new Blob([buffer], { type: 'application/pdf' });
    
    // Step 1: Register Job with /api/v2/audit
    console.log('Step 1: Registering job at /api/v2/audit...');
    const registerForm = new FormData();
    registerForm.append('type', 'pdf');
    registerForm.append('name', 'Test CV User');
    registerForm.append('whatsapp', '08123456789');
    registerForm.append('file', blob, 'CV Resume Khoiruzzadittaqwa.pdf');

    const regRes = await fetch('http://localhost:3000/api/v2/audit', {
      method: 'POST',
      body: registerForm,
    });
    
    const regJson = await regRes.json();
    console.log('Register Response:', JSON.stringify(regJson, null, 2));

    if (!regJson.success || !regJson.data?.job_id) {
      console.error('Job registration failed!');
      return;
    }

    const jobId = regJson.data.job_id;
    console.log('Obtained JobID:', jobId);

    // Step 2: Run parsing and analysis with /api/audit-cv
    console.log('Step 2: Processing CV audit at /api/audit-cv...');
    const cvPayload = new FormData();
    cvPayload.append('file', blob, 'CV Resume Khoiruzzadittaqwa.pdf');
    cvPayload.append('jobId', jobId);

    const res = await fetch('http://localhost:3000/api/audit-cv', {
      method: 'POST',
      body: cvPayload,
    });

    console.log('Status Code:', res.status);
    const json = await res.json();
    console.log('Response JSON:', JSON.stringify(json, null, 2));
  } catch (e) {
    console.error('Error during CV audit test:', e);
  }
}

async function run() {
  await testWebAudit();
  await testCvAudit();
}

run();
