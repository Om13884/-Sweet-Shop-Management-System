/**
 * Script to verify that the build completed successfully
 * This is run after the build to ensure dist/index.js exists
 */

const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.js');

console.log('Verifying build...');
console.log('Dist directory:', distPath);
console.log('Index file:', indexPath);

if (!fs.existsSync(distPath)) {
  console.error('ERROR: dist directory does not exist!');
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: dist/index.js does not exist!');
  console.log('Files in dist:', fs.readdirSync(distPath));
  process.exit(1);
}

console.log('✓ Build verification successful!');
console.log('✓ dist/index.js exists');
console.log('Build is ready for deployment.');

