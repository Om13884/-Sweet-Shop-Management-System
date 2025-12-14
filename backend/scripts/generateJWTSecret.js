/**
 * Script to generate a secure JWT secret key
 * Run with: node scripts/generateJWTSecret.js
 */

const crypto = require('crypto');

// Generate a random 64-character hexadecimal string
const secret = crypto.randomBytes(32).toString('hex');

console.log('\n========================================');
console.log('JWT_SECRET Generated:');
console.log('========================================');
console.log(secret);
console.log('========================================');
console.log('\nCopy this value and use it as your JWT_SECRET');
console.log('Add it to your .env file or Render environment variables\n');

