const fs = require('fs');
const path = require('path');

const CONTEXT_DIR = path.resolve(__dirname, '../.context');
const OUTPUT_FILE = path.join(CONTEXT_DIR, 'MASTER_KNOWLEDGE_BASE.md');

console.log('Generating consolidated MASTER_KNOWLEDGE_BASE.md...');

let output = '';

// Add Title & Header
output += `# 🚀 MASTER KNOWLEDGE BASE: DIGITAL INTELLIGENCE & PRODUCT EXPERIENCE

Welcome to the consolidated Product Engineering & Human Experience Operating System. This document combines all standards, playbooks, checklists, templates, prompts, and advanced research benchmarks.

---

## 📋 TABLE OF CONTENTS
`;

const sections = [
  { name: 'Standards', dir: 'standards' },
  { name: 'Playbooks', dir: 'playbooks' },
  { name: 'Checklists', dir: 'checklists' },
  { name: 'Templates', dir: 'templates' },
  { name: 'Prompts', dir: 'prompts' },
  { name: 'Research & Benchmarks', dir: 'research' }
];

let toc = '';
let contentBody = '';

// Helper to clean markdown title anchors
function getAnchor(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

sections.forEach(sec => {
  const secDir = path.join(CONTEXT_DIR, sec.dir);
  if (!fs.existsSync(secDir)) return;

  toc += `\n### [${sec.name}](#${getAnchor(sec.name)})\n`;
  contentBody += `\n\n# ${sec.name.toUpperCase()}\n\n---\n`;

  if (sec.dir === 'research') {
    // Traverse subfolders in research
    const subcats = fs.readdirSync(secDir).filter(f => fs.statSync(path.join(secDir, f)).isDirectory());
    subcats.sort();

    subcats.forEach(sub => {
      const subDir = path.join(secDir, sub);
      const subTitle = `Research: ${sub.toUpperCase()}`;
      toc += `- [${subTitle}](#${getAnchor(subTitle)})\n`;
      contentBody += `\n\n## ${subTitle}\n\n`;

      const files = ['README.md', 'awesome.md', 'repositories.md', 'libraries.md', 'patterns.md', 'anti-patterns.md', 'implementation-notes.md'];
      files.forEach(file => {
        const filePath = path.join(subDir, file);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const fileHeader = `### Folder: \`research/${sub}/${file}\``;
          toc += `  - [research/${sub}/${file}](#${getAnchor(`Folder: research/${sub}/${file}`)})\n`;
          contentBody += `\n\n${fileHeader}\n\n${fileContent}\n\n---\n`;
        }
      });
    });
  } else {
    // Read files directly in standard folders
    const files = fs.readdirSync(secDir).filter(f => f.endsWith('.md') && f !== 'MASTER_KNOWLEDGE_BASE.md');
    files.sort();

    files.forEach(file => {
      const filePath = path.join(secDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileTitle = `${sec.dir}/${file}`;
      toc += `- [${fileTitle}](#${getAnchor(fileTitle)})\n`;
      contentBody += `\n\n## ${fileTitle}\n\n${fileContent}\n\n---\n`;
    });
  }
});

output += toc;
output += '\n\n---\n\n';
output += contentBody;

// Write Output File
fs.writeFileSync(OUTPUT_FILE, output);

console.log(`Successfully generated MASTER_KNOWLEDGE_BASE.md in ${OUTPUT_FILE}`);
console.log(`Total Length: ${output.length} characters.`);
