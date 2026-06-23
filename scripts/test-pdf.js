const fs = require('fs');
const path = require('path');

async function testPdf() {
  console.log('Testing pdf-parse as a class...');
  try {
    const { PDFParse } = require('pdf-parse');
    
    // Create a dummy PDF buffer
    const dummyBuffer = Buffer.from('hello pdf');
    const parser = new PDFParse(new Uint8Array(dummyBuffer));
    const data = await parser.getText();
    console.log('Success! pdfData text:', data.text);
  } catch (err) {
    console.error('pdf-parse class failed:', err.message);
  }
}

testPdf();
