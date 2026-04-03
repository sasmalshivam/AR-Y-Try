// Script to generate PNG icons from canvas
// Run this in Node.js with: node generate-icons.js
// Or open generate-icons.html in a browser to download icons

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#7c3aed');
  grad.addColorStop(1, '#4f46e5');
  
  // Rounded rect background
  const r = size * 0.2;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();
  
  // Star/sparkle symbol
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.55}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦', size / 2, size / 2);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, 'icons', `icon${size}.png`), buffer);
  console.log(`Generated icon${size}.png`);
});
