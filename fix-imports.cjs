const fs = require('fs');
const path = require('path');

function getRelativePath(filePath) {
  // Count how deep the file is in the src directory
  const parts = filePath.split(path.sep);
  const srcIndex = parts.indexOf('src');
  const depth = parts.length - srcIndex - 2;
  
  if (depth === 0) {
    return './';
  } else if (depth === 1) {
    return '../';
  } else {
    return '../../';
  }
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const prefix = getRelativePath(filePath);
  
  // Replace @/ imports with relative paths
  content = content.replace(/@\/components\//g, `${prefix}components/`);
  content = content.replace(/@\/hooks\//g, `${prefix}hooks/`);
  content = content.replace(/@\/lib\//g, `${prefix}lib/`);
  content = content.replace(/@\/pages\//g, `${prefix}pages/`);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed: ${filePath}`);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
      processDirectory(filePath);
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !file.endsWith('.d.ts')) {
      fixImports(filePath);
    }
  });
}

console.log('Starting to fix imports...\n');
const clientSrc = path.join(__dirname, 'client', 'src');
processDirectory(clientSrc);
console.log('\n✅ All imports fixed! Restart your dev server.');