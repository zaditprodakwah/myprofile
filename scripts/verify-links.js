const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '../.context');

let brokenLinksCount = 0;
let checkedLinksCount = 0;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

console.log('Verifying markdown links in .context directory...');

walkDir(BASE_DIR, (filePath) => {
  if (path.extname(filePath) !== '.md') return;

  const content = fs.readFileSync(filePath, 'utf8');
  // Match standard markdown links: [text](link)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const linkUrl = match[2];
    
    // Ignore external web links and anchors
    if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://') || linkUrl.startsWith('mailto:') || linkUrl.startsWith('#')) {
      continue;
    }

    // Ignore specialized schema templates like OSM queries
    if (linkUrl.startsWith('around:')) {
      continue;
    }

    checkedLinksCount++;
    const cleanLinkUrl = linkUrl.split('#')[0];
    if (!cleanLinkUrl) continue;

    let absoluteLinkPath;
    if (cleanLinkUrl.startsWith('file:///')) {
      // Resolve absolute file:/// path
      // On macOS/Linux, file:///path/to/file means /path/to/file
      // On Windows it might be file:///C:/path/to/file
      // We can decode and clean it
      const cleanPath = decodeURIComponent(cleanLinkUrl.replace(/^file:\/\/\//, '/'));
      absoluteLinkPath = path.normalize(cleanPath);
    } else {
      // Resolve relative path
      absoluteLinkPath = path.resolve(path.dirname(filePath), cleanLinkUrl);
    }

    if (!fs.existsSync(absoluteLinkPath)) {
      console.error(`Broken Link Found in ${path.relative(BASE_DIR, filePath)}: Referencing "${linkUrl}" (resolved to: ${absoluteLinkPath})`);
      brokenLinksCount++;
    }
  }
});

console.log(`Link check completed. Total checked: ${checkedLinksCount}. Broken links found: ${brokenLinksCount}.`);

if (brokenLinksCount > 0) {
  process.exit(1);
} else {
  console.log('All relative and local file:// markdown links are valid.');
  process.exit(0);
}
