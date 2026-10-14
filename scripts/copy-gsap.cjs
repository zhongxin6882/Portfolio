const fs = require('node:fs');
const path = require('node:path');

const destination = path.resolve(__dirname, '../assets/vendor');
fs.mkdirSync(destination, { recursive: true });
for (const file of ['gsap.min.js', 'ScrollTrigger.min.js']) {
  fs.copyFileSync(require.resolve(`gsap/dist/${file}`), path.join(destination, file));
  process.stdout.write(`Copied ${file}\n`);
}
